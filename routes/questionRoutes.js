const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

router.route('/').get(getAllQuestions).post(createQuestion);

router
  .route('/:id')
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
