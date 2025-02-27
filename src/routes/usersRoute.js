const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.get('/getUsers', userController.getUser);

router.post('/getAppToken', userController.getAppToken);

router.post('/login', userController.login);

module.exports = router;