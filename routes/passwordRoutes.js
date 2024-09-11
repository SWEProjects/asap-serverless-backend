const express = require('express');
const { changePassword } = require('../controllers/passwordController');

const router = express.Router();

router.post('/change', changePassword);

module.exports = router;