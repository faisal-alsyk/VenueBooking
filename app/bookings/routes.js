const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const bookingController = require('./controller');
const validation = require('../Validation/bookings');


require('dotenv').config;

router.post('/', validation.createBooking, middleware.authenticateToken, bookingController.createBooking);
router.post('/bulkbooking', middleware.authenticateToken, bookingController.createBookinginBulk);
router.post('/prioritybooking', middleware.authenticateToken, bookingController.priorityBooking);
// router.get('/', middleware.authenticateToken, bookingController.listBookings);
router.get('/', middleware.authenticateToken, bookingController.getCalendarData);
router.get('/:id', middleware.authenticateToken, bookingController.getBooking);
router.patch('/:id', validation.updateBooking, middleware.authenticateToken, bookingController.updateBooking);
router.delete('/:id', middleware.authenticateToken, bookingController.deleteBooking);

module.exports = router;