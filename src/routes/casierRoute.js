const express = require('express');
const router = express.Router();

const casierController = require('../controllers/casierController');
router.get('/getAllCasierStatus', casierController.getAllCasierStatut);

module.exports=router;