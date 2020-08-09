const ArticleReview = require('../models/reviewArticleModel');
const GreenhouseReview = require('../models/reviewGreenhouseModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllArticleReviews = catchAsync(async (req, res, next) => {
  const reviews = await ArticleReview.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.createArticleReview = catchAsync(async (req, res, next) => {
  const newReview = await ArticleReview.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
exports.getArticleReview = catchAsync(async (req, res, next) => {
  const review = await ArticleReview.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateArticleReview = catchAsync(async (req, res, next) => {
  const updatedReview = await ArticleReview.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedreview) {
    return next(new AppError('No review found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      review: updatedReview,
    },
  });
});

exports.deleteArticleReview = catchAsync(async (req, res, next) => {
  const review = await ArticleReview.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllGreenhouseReviews = catchAsync(async (req, res, next) => {
  const reviews = await GreenhouseReview.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.createGreenhouseReview = catchAsync(async (req, res, next) => {
  const newReview = await GreenhouseReview.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
exports.getGreenhouseReview = catchAsync(async (req, res, next) => {
  const review = await GreenhouseReview.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateGreenhouseReview = catchAsync(async (req, res, next) => {
  const updatedReview = await GreenhouseReview.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedreview) {
    return next(new AppError('No review found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      review: updatedReview,
    },
  });
});

exports.deleteGreenhouseReview = catchAsync(async (req, res, next) => {
  const review = await GreenhouseReview.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('No review found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
