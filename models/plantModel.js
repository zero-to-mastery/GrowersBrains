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
plantSchema.statics.calculNumberOfPlants = async function (growerId) {
  const stats = await this.aggregate([
    {
      $match: { grower: growerId },
    },
    {
      $group: {
        _id: '$grower',
        numPlant: { $sum: 1 },
      },
    },
  ]);
  // console.log(stats);
  if (stats > 0) {
    await User.findByIdAndUpdate(growerId, {
      numberOfPlants: stats[0].numPlant,
    });
  } else {
    await User.findByIdAndUpdate(growerId, {
      numberOfPlants: 0,
    });
  }
};

//DOCUMENT MIDDLEWARE : run before .save() and .create() methods
plantSchema.post('save', function () {
  this.constructor.calculNumberOfPlants(this.grower);
});

//This is a query middleware run before findByIdAndUpdate & findByIdAndDelete
//so whenever a plant was updated or deleted the numberOfplants fields also will be updated
plantSchema.pre(/^findOneAnd/, async function (next) {
  this.plant = await this.findOne();
  // console.log(this.plant);
  next();
});
plantSchema.post(/^findOneAnd/, async function () {
  //we access this.plant from the pre middleware
  await this.plant.constructor.calculNumberOfPlants(this.plant.grower);
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
