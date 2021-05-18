const { Router } = require("express");
const router = Router();
const Place = require("../models/places")

//index route
router.get("/", async (req, res) => {
    res.json(await Place.find({}));
  });

  //create route
router.post("/", async (req, res) => {
    res.json(await Place.create(req.body));
  });
  
  //update route
  router.put("/:id", async (req, res) => {
    res.json(await Place.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  });
  
  //delete route
  router.delete("/:id", async (req, res) => {
    res.json(await Place.findByIdAndRemove(req.params.id));
  });
  
  // EXPORT ROUTER
  module.exports = router;