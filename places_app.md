## Express React Favorite Places App

You will create a Favorite Places App with the Following Design:

#### User Stories

- User can see their favorite places listed
- User can add a new favorite place
- User can update a favorite place
- User can delete a favorite

#### Places Model

- name: String
- img: String
- description: String

#### Backend Routes

| Name    | Endpoint    | Method | Purpose               |
| ------- | ----------- | ------ | --------------------- |
| INDEX   | /places     | GET    | GET ALL PLACES        |
| CREATE  | /places     | POST   | CREATE NEW PLACE      |
| UPDATE  | /places/:id | PUT    | UPDATE EXISTING PLACE |
| DESTROY | /places/:id | DELETE | DELETE EXISTING PLACE |

**REFER TO DOGS API FROM DAY LESSON**

- [Dogs App Backend Reference Code](https://github.com/AlexMercedCoder/1207dogsbackend)
- [Dogs App Frontend Reference Code](https://github.com/AlexMercedCoder/1207dogsfrontend)

#### Frontend Architecture

This should follow the "dogs" app from the day lesson

## Setup

- Create a `places_app` folder somewhere that is NOT a repo

- Open terminal to the `places app` folder and create a backend folder `mkdir backend`

- generate a frontend folder with CRA `npx create-react-app frontend`

- cd into the `backend` folder and create the following files `touch server.js .env .gitignore` and the following folders `mkdir db controllers models`

- create a new npm project in the `backend` folder `npm init -y`

- install dependencies `npm install express mongoose dotenv nodemon morgan cors`

#### Review of Dependencies

- express: backend server framework

- mongoose: MongoDB ODM for connecting and interacting with database

- dotenv: allows us to specify environmental variables using a `.env` file

- nodemon: restarts server whenever we update files

- morgan: logs output when server receives request to help debugging

- cors: add cors headers so frontend won't get cors errors

#### Create Scripts

update package.json with the following scripts

```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

add a `console.log("hello world")` to server.js and run both scripts `npm start` and `npm run dev` and make sure the log show when you run both in terminal. (Terminal Processes can always be shut down with CTRL+C)

#### Make sure not to commit sensitive or needless stuff

The .gitignore file allows us to specify files and folders for git to ignore. It should look like this.

```
.env
/node_modules
```

- We ignore .env cause that's where we store sensitive data
- We node_modules cause it's bulky and not needed in version control since package.json already know our dependencies and versions

#### Our Environmental Variables

These are generally variables we want defined based on the environment our app is running or sensitive pieces of info. This is mainly the PORT variable since Heroku uses that to deploy our API and MONGODB_URI cause that tells our app where our database is.

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/people
```

The mongo URL above assumes you are running a local mongo server, feel free to connect your MongoDB.com database instead if you have the URL handy.

## Setting Up Our Database Connection

- Create a file called connection.js in the `db` folder and put the following. Read the comments so you know what everything does.

```js
// LOAD ENVIRONMENTAL VARIABLES
require("dotenv").config();

// IMPORT DEPENDENCIES
const mongoose = require("mongoose");

// PULL OUT ENVIRONMENTAL VARIABLE FROM PROCESS.ENV OBJECT
const MONGODB_URI = process.env.MONGODB_URI;

// Optional Configuration Object to Remove Mongo Deprecation Warnings
const config = { useUnifiedTopology: true, useNewUrlParser: true };

//Establish Connection to Database
mongoose.connect(MONGODB_URI, config);

// Create Database Connection message for Open, Close, Error
mongoose.connection
  .on("open", () => console.log("MONGO CONNECTION IS OPEN"))
  .on("close", () => console.log("MONGO CONNECTION IS CLOSED"))
  .on("error", (error) =>
    console.log("MONGO CONNECTION ERROR \n***************\n", error)
  );

// EXPORT MONGOOSE CONNECTION TO USE IN SERVER.JS
module.exports = mongoose;
```

## Server.js

- put the following in your server.js then test the server by running `npm run dev` then going to localhost:4000 in the browser

```js
// GET ENVIRONMENTAL VARIABLES
require("dotenv").config();

//GET PORT FROM ENV VARIABLES
const PORT = process.env.PORT;

// IMPORT DEPENDENCIES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// IMPORT DATABASE CONNECTION
const mongoose = require("./db/connection");

// CREATE EXPRESS APPLICATION OBJECT
const app = express();

// Setup Middleware
app.use(cors()); // <----- add cors headers
app.use(express.json()); // <---- parses JSON bodies and adds them to req.body
app.use(morgan("tiny")); // <----- logging for debugging

// ROUTES AND ROUTES
app.get("/", (req, res) => res.send("Server is Working")); // <--- Route to test server

// Server Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
```

## Building our Places Model

In the models folder create a `Place.js` and let's create and export our model.

```js
// Import Mongoose
const mongoose = require("mongoose");

// Pull Schema and model from mongoose
const Schema = mongoose.Schema;
const model = mongoose.model;

// Create Place Schema
const placeSchema = new Schema(
  {
    name: String,
    img: String,
    description: String,
  },
  { timestamps: true }
);

// Create our Model Object
const Place = model("Place", placeSchema);

// Export our Model Object
module.exports = Place;
```

## Our Router

In the controllers folder make a `Place.js` file with the following. Here is where we will house all routes that start with `/place`. The router is then exported so we can import it into server.js.

```js
// CREATE A NEW EXPRESS ROUTE
const router = require("express").Router();

const { Router } = require("express");
//IMPORT OUR MODEL
const Place = require("../models/Place");

// SEED DATA FOR SEED ROUTE
const placeSeed = [
  {
    name: "Mt. Everest",
    img: "https://media.gq.com/photos/5dcaf2db81b355000904c757/master/pass/mount-everest-gq-men-of-the-year-2019-lede.jpg",
    description: "This is a Mountain",
  },
  {
    name: "Lake Eola",
    img: "https://a.cdn-hotels.com/gdcs/production142/d1678/02312c78-cd46-4e43-b6c6-d174700968a8.jpg",
    description: "This is a Lake",
  },
  {
    name: "Mall Of America",
    img: "https://www.visittheusa.com/sites/default/files/styles/hero_l_x2/public/images/hero_media_image/2016-11/IMG_7491_0.jpg?itok=lrDxDud3",
    description: "This is a Mall",
  },
];

// ROUTES (async, since database actions are asynchronous)

// Seed Route for Seeding Database
router.get("/seed", async (req, res) => {
  // try block for catching errors
  try {
    // remove all places from database
    await Place.remove({});
    // add the seed data to the database
    await Place.create(placeSeed);
    // get full list of places to confirm seeding worked
    const places = await Place.find({});
    // return full list of places as JSON
    res.json(places);
  } catch (error) {
    // return error as JSON with an error status
    res.status(400).json(error);
  }
});

// export the router which has all our routes registered to it
module.exports = router;
```

Let's now import that router into server.js so we can direct all requests for endpoints starting with "/places" to this router.

server.js

import the router anywhere above our routes

```js
// IMPORT PEOPlE ROUTER
const peopleRouter = require("./controllers/Place");
```

connect the router with our other routes

```js
// ROUTES AND ROUTES
app.get("/", (req, res) => res.send("Server is Working")); // <--- Route to test server
app.use("/places", peopleRouter); // send all "/places" requires to the peopleRouter
```

head over to localhost:4000/places/seed to confirm that our initial data was seeded! Think of this route as a reset button whenever you want to reset the data.

## The Crud Routes

Now we just need to build out our crud routes in `controllers/Place.js` to complete our API. Make sure to read the comments to understand what each line is doing.

#### Index Route

```js
// Index Route
router.get("/", async (Req, res) => {
  try {
    // query database for all the places
    const places = await Place.find({});
    // send places as JSON
    res.json(places);
  } catch (error) {
    // return error as JSON with an error status
    res.status(400).json(error);
  }
});
```

Go to localhost:4000/places to test

#### Create Route

```js
// CREATE Route
router.post("/", async (req, res) => {
  try {
    // pass the request body to create a new place in the database
    const newPlace = await Place.create(req.body);
    // send newly created place back as JSON
    res.json(newPlace);
  } catch (error) {
    // return error as JSON with an error status
    res.status(400).json(error);
  }
});
```

Use postman to make a post request /places with a new place in the body.

#### Update

```js
// update Route
router.put("/:id", async (req, res) => {
  try {
    // pass the request body to update and existing place in the database
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // send newly updated place back as JSON
    res.json(updatedPlace);
  } catch (error) {
    // return error as JSON with an error status
    res.status(400).json(error);
  }
});
```

Use postman to make a post request to update one of the places, don't forget to include the id in the url. `/places/h34090j3h09fc0jf049`

#### Destroy Route

```js
// update Route
router.delete("/:id", async (req, res) => {
  try {
    // delete existing place in the database
    const deletedPlace = await Place.findByIdAndRemove(req.params.id);
    // send delete place back as JSON
    res.json(deletedPlace);
  } catch (error) {
    // return error as JSON with an error status
    res.status(400).json(error);
  }
});
```

Using postman make a delete request to delete one of the places, don't forget to include the id in the URL. `/places/h34090j3h09fc0jf049`

- [Repo With How Your API Code Should Look When Done](https://git.generalassemb.ly/HomeworkReviews/places_backend)

## THE API IS COMPLETE

Leave it running, open a new terminal in the `frontend` folder with your React frontend application.

- install react router `npm install react-router-dom`

- start the dev server `npm start`

#### Setup Router

Go to src/index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

- going forward reference the "dogs" app we made during class to complete the frontend

- make sure both the backend and frontend are in their respective repos and turn in both repos
