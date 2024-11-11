const express = require('express');
const { editCourses , editProfile, getCurrentCourses} = require('../controllers/facultyManageController');

const router = express.Router();

router.post('/course/edit', editCourses);
router.post('/profile/edit', editProfile);
router.get('/current/courses',getCurrentCourses);

module.exports = router;