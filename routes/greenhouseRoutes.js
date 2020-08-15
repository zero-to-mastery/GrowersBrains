const express = require('express');
const router = express.Router();
const {
  getAllGreenhouses,
  createGreenhouse,
  getGreenhouse,
  updateGreenhouse,
  deleteGreenhouse,
} = require('../controllers/greenhouseController');

const { protect, restrictTo } = require('../controllers/authController');

const reviewGreenhouseRouter = require('./reviewGreenhouseRoutes');
router.use('/:greenhouseId/reviews/', reviewGreenhouseRouter);
// "{{URL}}/api/v1/greenhouses/:greenhouseId/reviews"

router
  .route('/')
  .get(protect, getAllGreenhouses)
  .post(protect, restrictTo('grower'), createGreenhouse);

router
  .route('/:id')
  .get(protect, getGreenhouse)
  .patch(protect, restrictTo('admin', 'grower'), updateGreenhouse)
  .delete(protect, restrictTo('admin', 'grower'), deleteGreenhouse);
module.exports = router;
