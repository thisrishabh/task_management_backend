const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ResUtil = require('../utils/res');

router.get('/', async (req, res) => {
    try {
        const data = await User.find();
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS");
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR");
    };
});

module.exports = router