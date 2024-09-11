const express = require('express');
const { editCourses , editProfile} = require('../controllers/facultyManageController');

const router = express.Router();

router.post('/course/edit', editCourses);
router.post('/profile/edit', editProfile);


module.exports = router;