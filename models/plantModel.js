const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A plant must have a name'],
    unique: true,
  },
  images: [String],
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
