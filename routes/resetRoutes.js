const express = require('express');
const { dbReset } = require('../controllers/resetController');

const router = express.Router();

router.get('/db', dbReset);

module.exports = router;