const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const userController = require('./controller');


require('dotenv').config;

router.post('/signup', userController.create);
router.get('/', middleware.authenticateToken, userController.ListUsers);
router.patch('/:id', middleware.authorizeToken, userController.updateUser);
router.delete('/:id', middleware.authenticateToken, userController.removeUser);
router.get('/:id', middleware.authenticateToken, userController.viewUser);
router.post('/login', userController.login);
router.post('/verifycode', middleware.authenticateToken, userController.verifyCode);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/resetpassword/:token', userController.resetPassword);
router.get('/authenticate', middleware.authenticateToken, userController.dashboard);

module.exports = router;