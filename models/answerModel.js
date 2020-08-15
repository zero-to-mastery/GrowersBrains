const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  answerer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'The answer must have an answerer!'],
  },
  answer: {
    type: String,
    required: [true, 'Answer can not be empty!'],
  },
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
  },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
