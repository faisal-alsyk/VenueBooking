const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const publicController = require('./controller');

router.post('/create', middleware.authenticateToken, publicController.create);

module.exports = router;