const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  createPlant,
  getPlant,
  updatePlant,
  deletePlant,
} = require("./../controllers/plantController");

router.route("/").get(getAllPlants).post(createPlant);

router.route("/:id").get(getPlant).patch(updatePlant).delete(deletePlant);

module.exports = router;
