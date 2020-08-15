const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  asker: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'The question must have an asker!'],
  },
  question: {
    type: String,
    required: [true, 'Question can not be empty!'],
  },
  category: {
    type: String,
    enum: ['Planting', 'Soil', 'Water'], //temporary
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
