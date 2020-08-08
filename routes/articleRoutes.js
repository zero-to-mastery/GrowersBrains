const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');

router.route('/').get(getAllArticles).post(createArticle);

router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle);

module.exports = router;
