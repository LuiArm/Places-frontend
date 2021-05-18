import React, { useEffect } from "react";
import "./App.css";
import { Route, Link, Switch } from "react-router-dom";
import Display from "./Display";
import Form from "./Form";


function App() {
  const url = "http:localhost:4500"

  const [places,setPlaces] = React.useState([])

  const emptyPlace = {
    name: "",
    img: "",
    description: ""
  }

  const [selectedPlace, setselectedPlace] = React.useState(emptyPlace)

  const getPlaces = () => {
    fetch(url + "/place/")
    .then((response) => response.json())
    .then((data) => {
      setPlaces(data)
    })
  }

  React.useEffect(() => {
    getPlaces()
  }, [])

  const handleCreate = (newPlace) => {
    fetch(url + "/place/", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(newPlace)
    })
    .then(() => getPlaces())
  }

  const handleUpdate = (place) => {
    fetch(url + "/place/" + place._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify(place)
    })
    .then(() => getPlaces())
  }

  const selectPlace = (place) => {setselectedPlace(place)}

  const deletePlace = (place) => {
    fetch(url + "/place/" + place._id, {
      method: "DELETE",
    })
    .then(() =>{
      getPlaces()
    })
  }

  return (
    <div className="App">
     <h1>The World Is Yours</h1>
     <hr />
     <Link to="/create">
       <button>Add your paradise</button>
     </Link>
     <main>
        <Switch>
          <Route exact path="/" render={(rp) => <Display
          {...rp}
        places={places}
        selectPlace={selectPlace}
        deletePlace={deletePlace}
        />} />
        <Route 
        exact path="/create"
        render={(rp) => (
          <Form {...rp} label="create" place={emptyPlace} handleSubmit={handleCreate} />
        )}
        />
        <Route
        exact path="/edit"
        render={(rp) => (
          <Form {...rp} label="update" place={selectedPlace} handleSubmit={handleUpdate} />
        )}
        />
        </Switch>
     </main>
    </div>
  );
}

export default App;
