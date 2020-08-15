const Job = require('../models/jobModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();
  res.status(200).json({
    status: 'success',
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      job: newJob,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError('No Job found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      job,
    },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedJob) {
    return next(new AppError('No Job found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      job: updatedJob,
    },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return next(new AppError('No Job found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
