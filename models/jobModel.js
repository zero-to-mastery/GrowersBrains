const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A job must have a title'],
  },
  description: {
    type: String,
    required: [true, 'A job must have a description'],
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  completedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
