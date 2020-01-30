const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const userController = require('./controller');


require('dotenv').config;

router.post('/create', middleware.authenticateToken, userController.create);
router.get('/', middleware.authenticateToken, userController.ListUsers);
router.post('/login', userController.login);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/authenticate', middleware.authenticateToken, userController.dashboard);
router.patch('/changepassword', middleware.authenticateToken, userController.changePassword);
router.post('/resetpassword/:token', userController.resetPassword);
router.patch('/:id', middleware.authenticateToken, userController.updateUser);
router.delete('/:id', middleware.authenticateToken, userController.removeUser);
router.get('/:id', middleware.authenticateToken, userController.viewUser);

module.exports = router;