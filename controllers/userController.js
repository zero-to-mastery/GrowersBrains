const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const filterRequestObj = async (reqBodyObj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(reqBodyObj).forEach((el) => {
    if (allowedFields.includes(el)) filteredObj[el] = reqBodyObj[el];
  });
  return filteredObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //To avoid that a malicious user change his role to an admin and grant all the access to the app
  const filteredBody = await filterRequestObj(req.body, 'name', 'email');
  // we use req.user from the protect middellware
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
