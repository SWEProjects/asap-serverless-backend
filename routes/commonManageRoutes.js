const express = require('express');
const { getBatches } = require('../controllers/commonManageController');

const router = express.Router();

router.get('/batch', getBatches);

module.exports = router;