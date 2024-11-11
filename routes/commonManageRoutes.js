const express = require('express');
const { getBatches, getAllCourses } = require('../controllers/commonManageController');

const router = express.Router();

router.get('/batch', getBatches);
router.get('/courses',getAllCourses)

module.exports = router;