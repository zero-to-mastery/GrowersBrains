const express = require('express');
const router = express.Router();
const { getAllUsers, updateMe } = require('./../controllers/userController');
const { protect, restrictTo } = require('./../controllers/authController');

const {
  login,
  signup,
  updatePassword,
} = require('./../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/updateMe', protect, updateMe);
router.patch('/updateMyPassword', protect, updatePassword);

router.route('/').get(protect, restrictTo('admin'), getAllUsers);

module.exports = router;
