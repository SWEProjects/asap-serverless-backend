const express = require('express');
const { selectBatch } = require('../controllers/studentManageController');

const router = express.Router();

router.post('/assign/batch', selectBatch);

module.exports = router;