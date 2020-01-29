const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const bookingController = require('./controller');


require('dotenv').config;

router.post('/', middleware.authenticateToken, bookingController.createBooking);
router.post('/bulkbooking', middleware.authenticateToken, bookingController.createBookinginBulk);
router.get('/', middleware.authenticateToken, bookingController.listBookings);
router.get('/events', middleware.authenticateToken, bookingController.getCalendarData);
router.get('/:id', middleware.authenticateToken, bookingController.getBooking);
router.patch('/:id', middleware.authenticateToken, bookingController.updateBooking);
router.delete('/:id', middleware.authenticateToken, bookingController.deleteBooking);

module.exports = router;