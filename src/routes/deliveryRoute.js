const express = require('express');
const router = express.Router();

const deliveryController = require('../controllers/deliveryController');
router.get('/getAllDelivery', deliveryController.getAllDelivery);

module.exports=router;