const express = require('express');

const {
  getAllArticleReviews,
  getArticleReview,
  createArticleReview,
  updateArticleReview,
  deleteArticleReview,
  setUserArticleIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllArticleReviews)
  .post(restrictTo('user'), setUserArticleIds, createArticleReview); //??the grower can post a review or only the user ??

router
  .route('/:id')
  .get(getArticleReview)
  .patch(restrictTo('user', 'admin'), updateArticleReview)
  .delete(restrictTo('user', 'admin'), deleteArticleReview);

module.exports = router;
