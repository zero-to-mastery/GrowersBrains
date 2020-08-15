const mongoose = require('mongoose');
const User = require('./userModel');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article must have a title'],
  },
  content: {
    type: String,
    required: [true, 'Article must have a content'],
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Article must have an author'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
articleSchema.statics.calculNumberOfArticles = async function (authorId) {
  const stats = await this.aggregate([
    {
      $match: { author: authorId },
    },
    {
      $group: {
        _id: '$author',
        numArticle: { $sum: 1 },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await User.findByIdAndUpdate(authorId, {
      numberOfArticles: stats[0].numArticle,
    });
  } else {
    await User.findByIdAndUpdate(authorId, {
      numberOfArticles: 0,
    });
  }
};
//DOCUMENT MIDDLEWARE : run before .save() and .create() methods
articleSchema.post('save', function () {
  this.constructor.calculNumberOfArticles(this.author);
});

//This is a query middleware run before findByIdAndUpdate & findByIdAndDelete
//so whenever an article was updated or deleted the numberOfArticles fields also will be updated
//NOTE : findByIdAndUpdate is a shortand for findOneAndUpdate , same for all finById.... check mongoose documentation for more info
articleSchema.pre(/^findOneAnd/, async function (next) {
  this.article = await this.findOne();
  // console.log(this.article);
  next();
});
articleSchema.post(/^findOneAnd/, async function () {
  //we access this.article from the pre middleware
  await this.article.constructor.calculNumberOfArticles(this.article.author);
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
