const express = require('express');
const router = express.Router();
const {
  getAllGreenHouses,
  createGreenHouse,
} = require('../controllers/greenhouseController');

const reviewGreenhouseRouter = require('./reviewGreenhouseRoutes');
router.use('/:greenhouseId/reviews/', reviewGreenhouseRouter);
// "{{URL}}/api/v1/greenhouses/:greenhouseId/reviews"

router.route('/').get(getAllGreenHouses).post(createGreenHouse);

module.exports = router;
