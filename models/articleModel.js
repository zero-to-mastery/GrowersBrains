const mongoose = require('mongoose');
const User = require('./userModel');

const articleSchema = new mongoose.Schema(
  {
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
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { validate: true },
    toObject: { validate: true },
  }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
