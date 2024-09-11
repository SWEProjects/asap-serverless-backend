const express = require('express');
const { createSession, openSession, closeSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/create', createSession);
router.post('/open', openSession); 
router.post('/close', closeSession); 

module.exports = router;