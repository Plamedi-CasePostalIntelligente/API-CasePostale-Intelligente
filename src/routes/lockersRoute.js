
const express = require('express');
const router = express.Router();
const lockersController = require('../controllers/lockersController');

router.post('/verifyIfFactor', lockersController.verifyIfFactor);
router.post('/verifyIfClientHasDelivery',lockersController.verifyIfClientHasDelivery);
router.post('/verifyIfFactorHasDelivery',lockersController.verifyIfFactorHasDelivery);
router.post('/hasFactorDelivered',lockersController.hasFactorDelivered);
router.post('/isClientDelivered',lockersController.isClientDelivered);
router.post('/isClientCaseFilled',lockersController.isClientCaseFilled);
router.post('/isFactorCaseEmptied',lockersController.isFactorCaseEmptied);
router.post('/openClientCase',lockersController.openClientCase);
router.post('/openFactorCase',lockersController.openFactorCase);
router.post('/UpdateCaseState',lockersController.UpdateCaseState);
router.post('/UpdateDeliveryState',lockersController.UpdateDeliveryState);

module.exports=router;