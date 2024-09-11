const express = require('express');
const { createSession, openSession, closeSession, deleteSession } = require('../controllers/sessionController');

const router = express.Router();

router.post('/create', createSession);
router.post('/open', openSession); 
router.post('/close', closeSession); 
router.post('/delete', deleteSession); 

module.exports = router;