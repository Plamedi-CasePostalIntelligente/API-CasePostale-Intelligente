const express = require('express');
const router = express.Router();

const accessTryController = require('../controllers/accessTryController');
router.get('/getAllAccessTry', accessTryController.getAllAccessTries);

module.exports=router;