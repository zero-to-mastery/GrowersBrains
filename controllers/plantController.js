const Plant = require('./../models/plantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPlants = catchAsync(async (req, res, next) => {
  const plants = await Plant.find();
  res.status(200).json({
    status: 'success',
    results: plants.length,
    data: {
      plants,
    },
  });
});

exports.createPlant = catchAsync(async (req, res, next) => {
  const newPlant = await Plant.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      plant: newPlant,
    },
  });
});

exports.getPlant = catchAsync(async (req, res, next) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    return next(new AppError('No plant found with that ID ', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plant,
    },
  });
});

exports.updatePlant = catchAsync(async (req, res, next) => {
  const updatedPlant = await Plant.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedPlant) {
    return next(new AppError('No plant found with that ID ', 404));
  }

  res.status(200).json({
    message: 'success',
    data: {
      plant: updatedPlant,
    },
  });
});

exports.deletePlant = catchAsync(async (req, res, next) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) {
    return next(new AppError('No plant found with that ID ', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
