const express = require('express');
const { changePassword, resetPasswordEmail, resetPassword } = require('../controllers/passwordController');

const router = express.Router();

router.post('/change', changePassword);
router.post('/reset/sendOtp', resetPasswordEmail);
router.post('/reset', resetPassword);

module.exports = router;