const express = require('express');
const { getReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/', getReport);

module.exports = router;