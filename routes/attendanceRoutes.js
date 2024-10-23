const express = require('express');
const { markAttendanceByQR, markAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/mark/qr', markAttendanceByQR);
router.post('/mark/manual', markAttendance)

module.exports = router;