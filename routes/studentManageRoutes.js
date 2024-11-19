const express = require('express');
const { selectBatch, selectCourses, getCurrentCourses } = require('../controllers/studentManageController');

const router = express.Router();

router.post('/assign/batch', selectBatch);
router.post('/assign/courses', selectCourses);
router.get('/courses', getCurrentCourses);

module.exports = router;