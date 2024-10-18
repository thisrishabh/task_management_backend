const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ResUtil = require('../utils/res');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return ResUtil.VALIDATION_ERROR(req, res, { message: 'User with this email already exists' }, "ERROR");
        }

         // If user doesn't exist, create a new user
        const user = await User.create(req.body);
        return ResUtil.SUCCESS(req, res, { user }, "SUCCESS");

    } catch (err) {
        return ResUtil.VALIDATION_ERROR(req, res, { error: err.message }, "ERROR")
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
          return ResUtil.VALIDATION_ERROR(req, res, { error: 'Invalid credentials' }, "ERROR");
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });
        return ResUtil.SUCCESS(req, res, { token, ...user.toObject() }, "SUCCESS")
      } catch (err) {
        return ResUtil.VALIDATION_ERROR(req, res, { error: err.message }, "ERROR")
      }
})

module.exports = router;