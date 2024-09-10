const express = require('express');
const { loginFaculty, registerFaculty } = require('../controllers/facultyAuthController');

const router = express.Router();

router.post('/login', loginFaculty);
router.post('/register', registerFaculty);
module.exports = router;