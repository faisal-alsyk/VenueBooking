const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const userController = require('./controller');
const validation = require('../Validation/users');


require('dotenv').config;

router.post('/create', validation.createUser, middleware.authenticateToken, userController.create);
router.get('/', middleware.authenticateToken, userController.ListUsers);
router.post('/login', validation.userLogin, userController.login);
router.post('/forgotpassword', userController.forgotPassword);
router.get('/authenticate', middleware.authenticateToken, userController.dashboard);
router.patch('/changepassword', middleware.authenticateToken, userController.changePassword);
router.post('/resetpassword/:token', userController.resetPassword);
router.patch('/:id', validation.updateUser,middleware.authenticateToken, userController.updateUser);
router.delete('/:id', middleware.authenticateToken, userController.removeUser);
router.get('/:id', middleware.authenticateToken, userController.viewUser);

module.exports = router;