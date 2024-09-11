const express = require('express');
const { createSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/create', createSession);
// router.post('/open', openSession); 
// router.post('/close', closeSession); 

module.exports = router;