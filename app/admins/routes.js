const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const userController = require('./controller');
const validation = require('../Validation/users');


require('dotenv').config;

router.post('/signup', validation.createUser, userController.create);
router.get('/', middleware.authenticateToken, userController.ListUsers);
router.get('/authenticate', middleware.authenticateToken, userController.dashboard);
router.post('/login', validation.userLogin, userController.login);
router.post('/verifycode', middleware.authenticateToken, userController.verifyCode);
router.post('/forgotpassword', userController.forgotPassword);
router.patch('/:id', middleware.authorizeToken, userController.updateUser);
router.delete('/:id', middleware.authenticateToken, userController.removeUser);
router.get('/:id', middleware.authenticateToken, userController.viewUser);
router.post('/resetpassword/:token', userController.resetPassword);

module.exports = router;