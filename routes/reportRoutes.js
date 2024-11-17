const express = require('express');
const { getReport, getReportForStudents } = require('../controllers/reportController');

const router = express.Router();

router.post('/faculty', getReport);
router.get('/student', getReportForStudents)

module.exports = router;