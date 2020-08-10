const mongoose = require('mongoose');

const Article = require('./articleModel');

const reviewArticleSchema = new mongoose.Schema({
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
    required: [true, 'A review must belong to a user'],
  },
  article: {
    type: mongoose.Schema.ObjectId,
    ref: 'GreenHouse',
    required: [true, 'A review must belong to an Article'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//populate the user field (select only the name and photo)
reviewArticleSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewArticleSchema.statics.calculAverageRatings = async function (articleId) {
  const stats = await this.aggregate([
    {
      $match: { article: articleId },
    },
    {
      $group: {
        _id: '$article',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Article.findByIdAndUpdate(articleId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRating,
    });
  } else {
    await Article.findByIdAndUpdate(articleId, {
      ratingsAverage: 5,
      ratingsQuantity: 0,
    });
  }
};
//DOCUMENT MIDDLEWARE : run before .save() and .create() methods
reviewArticleSchema.post('save', function () {
  //this points to current review
  //this.constructor points to the current Model
  this.constructor.calculAverageRatings(this.article);
});

//This is a query middleware run before findByIdAndUpdate & findByIdAndDelete
//so whenever a review was updated or deleted the ratingsAverage and ratingsQuantity fields also will be updated
//NOTE : findByIdAndUpdate is a shortand for findOneAndUpdate , same for all finById.... check mongoose documentation for more info
reviewArticleSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  // console.log(this.rev)
  next();
});
reviewArticleSchema.post(/^findOneAnd/, async function () {
  //we access this.rev from the pre middleware
  await this.rev.constructor.calculAverageRatings(this.rev.article);
});
const ReviewArticle = mongoose.model('ReviewArticle', reviewArticleSchema);

module.exports = ReviewArticle;
