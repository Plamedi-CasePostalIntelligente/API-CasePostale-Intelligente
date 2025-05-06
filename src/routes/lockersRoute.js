const express = require('express');
const router = express.Router();
const lockersController = require('../controllers/lockersController');

router.get('/verifyIfFactor/:uid', lockersController.verifyIfFactor);
// Route commentée car la méthode correspondante est commentée
// router.get('/verifyIfClientHasDelivery/:uid', lockersController.verifyIfClientHasDelivery);
router.get('/verifyIfHasDelivery/:uid', lockersController.verifyIfHasDelivery); // Corrigé
// Route commentée car la méthode correspondante est commentée
// router.get('/hasFactorDelivered/:uid', lockersController.hasFactorDelivered);
router.get('/isDelivered/:uid', lockersController.isDelivered); // Corrigé
router.get('/isCaseFilled/:uid', lockersController.isCaseFilled); // Corrigé
// Route commentée car la méthode correspondante est commentée
// router.get('/isFactorCaseEmptied/:uid', lockersController.isFactorCaseEmptied);
// Route commentée car la méthode correspondante est commentée
// router.get('/openClientCase/:uid', lockersController.openClientCase);
router.get('/openCase/:uid', lockersController.openCase); // Corrigé
router.post('/updateCaseState', lockersController.updateCaseState); // Changé en POST
router.post('/updateDeliveryState', lockersController.updateDeliveryState);

module.exports = router;