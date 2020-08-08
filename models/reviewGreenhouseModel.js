const mongoose = require('mongoose');

const GreenHouse = require('./greenHouseModel');

const reviewGreenhouseSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review cannot be empty'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  greenHouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'GreenHouse',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewGreenhouseSchema.statics.calculAverageRatings = async function (
  greenHouseId
) {
  const stats = await this.aggregate([
    {
      $match: { greenHouse: greenHouseId },
    },
    {
      $group: {
        _id: '$greenHouse',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await GreenHouse.findByIdAndUpdate(greenHouseId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRating,
    });
  } else {
    await GreenHouse.findByIdAndUpdate(greenHouseId, {
      ratingsAverage: 5,
      ratingsQuantity: 0,
    });
  }
};
//DOCUMENT MIDDLEWARE : run before .save() and .create() methods
reviewGreenhouseSchema.post('save', function () {
  //this points to current review
  //this.constructor points to the current Model
  this.constructor.calculAverageRatings(this.greenHouse);
});

//This is a query middleware run before findByIdAndUpdate & findByIdAndDelete
//so whenever a review was updated or deleted the ratingsAverage and ratingsQuantity fields also will be updated
//NOTE : findByIdAndUpdate is a shortand for findOneAndUpdate , same for all finById.... check mongoose documentation for more info
reviewGreenhouseSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  // console.log(this.rev)
  next();
});
reviewGreenhouseSchema.post(/^findOneAnd/, async function () {
  //we access this.rev from the pre middleware
  await this.rev.constructor.calculAverageRatings(this.rev.greenHouse);
});
const ReviewGreenhouse = mongoose.model(
  'ReviewGreenhouse',
  reviewGreenhouseSchema
);

module.exports = ReviewGreenhouse;
