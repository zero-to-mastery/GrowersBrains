const express = require('express');

const router = express.Router();

const {
  getAllArticleReviews,
  getArticleReview,
  createArticleReview,
  updateArticleReview,
  deleteArticleReview,
  getAllGreenhouseReviews,
  getGreenhouseReview,
  createGreenhouseReview,
  updateGreenhouseReview,
  deleteGreenhouseReview,
} = require('../controllers/reviewController');

//Routes for reviews/article

router.route('/article').get(getAllArticleReviews).post(createArticleReview);

router
  .route('/article/:id')
  .get(getArticleReview)
  .patch(updateArticleReview)
  .delete(deleteArticleReview);

//Routes for reviews/greenhouses

router
  .route('/greenhouse')
  .get(getAllGreenhouseReviews)
  .post(createGreenhouseReview);

router
  .route('/greenhouse/:id')
  .get(getGreenhouseReview)
  .patch(updateGreenhouseReview)
  .delete(deleteGreenhouseReview);

module.exports = router;
