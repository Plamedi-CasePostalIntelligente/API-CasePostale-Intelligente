
const express = require('express');
const router = express.Router();
const lockersController = require('../controllers/lockersController');

router.post('/openLocker', lockersController.openLocker);
router.post('/UpdateShippingStatus', lockersController.UpdateShippingStatus);

module.exports=router;