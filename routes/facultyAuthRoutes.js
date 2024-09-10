const express = require('express');
const { loginFaculty } = require('../controllers/facultyAuthController');

const router = express.Router();

router.post('/login', loginFaculty);
module.exports = router;