const express = require('express');
const router = express.Router();

const cityController = require('../controllers/cityController');
router.get('/getAllCity', cityController.getAllCity);

module.exports=router;