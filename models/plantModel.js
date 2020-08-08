const mongoose = require('mongoose');
const User = require('./userModel');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A plant must have a name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A plant must have a description'],
  },
  images: [String],
  plantingTips: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  grower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
