const express = require('express');
const { selectBatch, selectCourses } = require('../controllers/studentManageController');

const router = express.Router();

router.post('/assign/batch', selectBatch);
router.post('/assign/courses', selectCourses);

module.exports = router;