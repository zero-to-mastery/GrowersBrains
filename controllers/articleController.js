const Article = require('../models/articleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: {
      articles,
    },
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  const newArticle = await Article.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      Article: newArticle,
    },
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError('No Article found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      Article,
    },
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const updatedArticle = await Article.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedArticle) {
    return next(new AppError('No Article found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      Article: updatedArticle,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    return next(new AppError('No Article found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
