const express = require('express');
const { changePassword, resetPasswordEmail } = require('../controllers/passwordController');

const router = express.Router();

router.post('/change', changePassword);
router.post('/reset/sendOtp', resetPasswordEmail);

module.exports = router;