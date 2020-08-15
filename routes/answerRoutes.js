const express = require('express');
const router = express.Router();
const {
  getAllAnswers,
  createAnswer,
  getAnswer,
  updateAnswer,
  deleteAnswer,
} = require('../controllers/answerController');

router.route('/').get(getAllAnswers).post(createAnswer);

router.route('/:id').get(getAnswer).patch(updateAnswer).delete(deleteAnswer);

module.exports = router;
