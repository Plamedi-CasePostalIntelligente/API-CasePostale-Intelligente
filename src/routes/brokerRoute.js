const express = require('express');
const router = express.Router();

const brokerController = require('../controllers/brokerController');
router.get('/infoBroker', brokerController.getInfoBroker);

module.exports=router;