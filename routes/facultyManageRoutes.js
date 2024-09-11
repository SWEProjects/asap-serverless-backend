const express = require('express');
const { editCourses } = require('../controllers/facultyManageController');

const router = express.Router();

router.post('/course/edit', editCourses);

module.exports = router;