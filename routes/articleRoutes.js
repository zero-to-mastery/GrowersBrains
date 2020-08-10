const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

const { protect, restrictTo } = require('../controllers/authController');

const reviewArticleRouter = require('./reviewArticleRoutes');
router.use('/:articleId/reviews/', reviewArticleRouter);
// "{{URL}}/api/v1/articles/:greenhouseId/reviews"

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllArticles)
  .post(protect, restrictTo('admin', 'grower'), createArticle);

router
  .route('/:id')
  .get(protect, restrictTo('admin'), getArticle)
  .patch(protect, restrictTo('admin', 'grower'), updateArticle)
  .delete(protect, restrictTo('admin', 'grower'), deleteArticle);

module.exports = router;
