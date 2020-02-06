const express = require('express');
const middleware = require('../../functions/middleware');
const router = express.Router();
const bookingController = require('./controller');
const validation = require('../Validation/bookings');


require('dotenv').config;

router.post('/', middleware.authenticateToken, bookingController.createBooking);
router.post('/public', bookingController.createBooking);
router.post('/bulkbooking', middleware.authenticateToken, bookingController.createBookinginBulk);
router.post('/prioritybooking', middleware.authenticateToken, bookingController.priorityBooking);
// router.get('/', middleware.authenticateToken, bookingController.listBookings);
router.get('/', bookingController.getCalendarData);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', validation.updateBooking, middleware.authenticateToken, bookingController.updateBooking);
router.delete('/:id', middleware.authenticateToken, bookingController.deleteBooking);
router.post('/:id',bookingController.deleteBooking);


module.exports = router;