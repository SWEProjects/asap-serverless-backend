const express = require('express');
const { getQR } = require('../controllers/QrController');

const router = express.Router();

router.post('/', getQR);

module.exports = router;