const express = require('express');
const { getBatches, getAllCourses, getDepartments } = require('../controllers/commonManageController');

const router = express.Router();

router.get('/batch', getBatches);
router.get('/courses',getAllCourses)
router.get('/departments', getDepartments)

module.exports = router;