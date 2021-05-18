const { Schema, model } = require("mongoose");

//SCHEMA
const placeSchema = new Schema(
  {
    name: String,
    img: String,
    description: String
  },
  { timestamps: true }
);

//MODEL
const Place = model("place", placeSchema);

//EXPORT MODEL
module.exports = Place;
