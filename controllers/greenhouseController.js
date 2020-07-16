const GreenHouse = require('./../models/greenhouseModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllGreenHouses = catchAsync(async (req, res, next) => {
  const greenHouse = await GreenHouse.find()
    .populate({ path: 'growerId', select: '-__v -passwordChangedAt' })
    .populate({ path: 'plants', select: '-__v' });
  res.status(200).json({
    status: 'success',
    results: greenHouse.length,
    data: {
      greenHouse,
    },
  });
});

exports.createGreenHouse = catchAsync(async (req, res, next) => {
  const newgreenHouse = await GreenHouse.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      greenHouse: newgreenHouse,
    },
  });
});
