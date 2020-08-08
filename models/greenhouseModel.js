const mongoose = require('mongoose');

const greenhouseSchema = new mongoose.Schema({
  grower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  plants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Plant',
    },
  ],
  ratingsAverage: {
    type: Number,
    default: 5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  soil: {
    type: {
      type: String,
    },
    temperature: {
      type: Number,
    },
    ph: {
      type: Number,
    },
    water_food: String,
  },
});

const Greenhouse = mongoose.model('Greenhouse ', greenhouseSchema);

module.exports = Greenhouse;
