const express = require('express');
const { validateToken } = require('../controllers/tokenController'); 

const router = express.Router();

router.post('/validate', validateToken); 

module.exports = router;
