const mongoose = require('mongoose');

const User = require('./../models/userModel');
const Plant = require('./../models/plantModel');

const greenhouseSchema = new mongoose.Schema({
  growerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  plants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Plant',
    },
  ],
  questions: [
    {
      q: {
        type: String,
      },
      a: {
        type: String,
      },
    },
  ],
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
