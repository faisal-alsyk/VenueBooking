const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const venueController = require('./controller');


require('dotenv').config;

router.post('/create', venueController.createVenue);
router.get('/', middleware.authenticateToken, venueController.listVenues);
router.patch('/:id', middleware.authorizeToken, venueController.updateVenue);
router.delete('/:id', middleware.authenticateToken, venueController.deleteVenue);

module.exports = router;