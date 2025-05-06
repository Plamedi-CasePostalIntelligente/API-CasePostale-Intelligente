const express = require('express');
const router = express.Router();

const accessTryController = require('../controllers/accessTryController');
router.get('/getAllAccessTry', accessTryController.getAllAccessTries);
router.post('/insertAccessTry', accessTryController.InsertAccessTries);

module.exports=router;