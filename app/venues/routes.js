const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const venueController = require('./controller');
const validation = require('../Validation/venues');


require('dotenv').config;

router.post('/create', validation.createVenue, middleware.authenticateToken, venueController.createVenue);
router.get('/', middleware.authenticateToken, venueController.listVenues);
router.get('/:id', middleware.authenticateToken, venueController.getVenue);
router.patch('/:id', middleware.authenticateToken, venueController.updateVenue);
router.delete('/:id', middleware.authenticateToken, venueController.deleteVenue);

module.exports = router;