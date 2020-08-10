const express = require('express');

const {
  getAllGreenhouseReviews,
  getGreenhouseReview,
  createGreenhouseReview,
  updateGreenhouseReview,
  deleteGreenhouseReview,
  setUserGreenhouseIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllGreenhouseReviews)
  .post(restrictTo('user'), setUserGreenhouseIds, createGreenhouseReview); //??the grower can post a review or only the user ??

router
  .route('/:id')
  .get(getGreenhouseReview)
  .patch(restrictTo('user', 'admin'), updateGreenhouseReview)
  .delete(restrictTo('user', 'admin'), deleteGreenhouseReview);

module.exports = router;
