const express = require('express');
const { validateToken } = require('../controllers/tokenController');

const router = express.Router();

router.get('/validate', validateToken);

module.exports = router;