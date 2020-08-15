const Answer = require('../models/answerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllAnswers = catchAsync(async (req, res, next) => {
  const answers = await Answer.find();
  res.status(200).json({
    status: 'success',
    results: answers.length,
    data: {
      answers,
    },
  });
});

exports.createAnswer = catchAsync(async (req, res, next) => {
  const newAnswer = await Answer.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      answer: newAnswer,
    },
  });
});

exports.getAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);

  if (!answer) {
    return next(new AppError('No Answer found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      answer,
    },
  });
});

exports.updateAnswer = catchAsync(async (req, res, next) => {
  const updatedAnswer = await Answer.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedAnswer) {
    return next(new AppError('No Answer found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      answer: updatedAnswer,
    },
  });
});

exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const answer = await Answer.findByIdAndDelete(req.params.id);
  if (!answer) {
    return next(new AppError('No Answer found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
