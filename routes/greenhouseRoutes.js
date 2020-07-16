const express = require('express');
const router = express.Router();
const {
  getAllGreenHouses,
  createGreenHouse,
} = require('./../controllers/greenhouseController');

router.route('/').get(getAllGreenHouses).post(createGreenHouse);

module.exports = router;
