const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (element) {
          return this.password === element;
        },
        message: 'Passwords are not the same !',
      },
    },
    bio: {
      type: String,
      default: '',
    },
    memberSince: {
      type: Date,
      default: Date.now(),
    },
    invitedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    usersInvited: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    numberOfPlants: {
      type: Number,
      default: 0,
    },
    numberOfArticles: {
      type: Number,
      default: 0,
    },
    jobsCompleted: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
      },
    ],
    jobsPosted: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
      },
    ],
    role: {
      type: String,
      enum: ['admin', 'user', 'grower'],
      default: 'user',
    },
    photo: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//use the mongoose `pre` middleware to hash the password before saved it to the db
userSchema.pre('save', async function (next) {
  //if the password was modified call the next middleware
  if (!this.isModified('password')) return next();

  //otherwise hash the password & delete the passwordConfirm field
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  //-1s to ensure that the token is always created after the password has been changed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWT_iat) {
  //check if the password has changed
  if (this.passwordChangedAt) {
    const changedTimeTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(JWT_iat, changedTimeTamp);
    return changedTimeTamp > JWT_iat; //true or false
  }
  // false mean that password has not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
