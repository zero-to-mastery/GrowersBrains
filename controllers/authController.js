const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createSignToken = (statusCode, user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // set to true mean that the browser cannot access or modify the cookie in any way (!important to prevent cross-site scripting attacks)
    secure: process.env.NODE_ENV === 'production', //This part is temporary
  };

  res.cookie('jwt', token, cookieOptions); //send cookie 'jwt'

  //remove the password field from the response
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSignToken(201, user, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return new AppError('Please provide an email & password', 400);
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSignToken(200, user, res);
});

//THis will be used as a middleware to protect routes

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged In , Please log in to get access', 401)
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user with that token still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User belonging to this token is no longer exist!', 401)
    );
  }

  //check if user has changed password after jwt was issued

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed his password! Please log in again',
        401
      )
    );
  }

  // Grant access
  req.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) get user from collection
  const user = await User.findById(req.user._id).select('+password');

  //2)Check if POSTed password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError('Your current password is wrong!', 401));
  }
  //3) if So update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4) LOg in user , send JWT
  createSignToken(200, user, res);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address!', 404));
  }

  // 1) Generate the random password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // don't run validator before saving to the db

  //For now we will use that sample message
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}/`;
  const message = `Forgot your password ? Submit a PATCH request to the url : ${resetUrl}.\n 
  If you didn't forget your password please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get User based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //Find the user
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //login the user and send token
  createSignToken(200, user, res);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles it's an array
    //req.user.role accessed from the protect middlleware wich run before restricTo middl
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    next();
  };
};
