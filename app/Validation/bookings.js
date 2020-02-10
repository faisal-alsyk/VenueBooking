const bookingModel = require('../bookings/model');
const venueModel = require('../venues/model');
const userModel = require('../users/model');
const moment = require('moment');

module.exports = {
    createBooking: async (req, res, next) => {
        let { errTitle, errVenue, errStart, errEnd, errEmail, errPhoneNumber } = "";
        let { title, venueId, start, end, email, phoneNumber } = req.body;
        if (!title) {
            errTitle = "Please provide a booking title";
        }
        if (!venueId) {
            errVenue = "Venue should be selected";
        }
        else {
            let venueCount = await venueModel.findOne({ _id: venueId }).count();
            if (venueCount < 1) {
                errVenue = "Venue does not exist";
            }
        }
        if (!start) {
            errStart = "Booking Start Time is not provided";
        }
        if (!end) {
            errEnd = "Booking End Time is not provided";
        }
        else {
            let validTime = new Date(end) - new Date(start);
            if (validTime <= 0) {
                errEnd = "End Time should be greater than Start Time";
            }
        }
        if (email) {
            let userCount = await userModel({ email: email }).count();
            if (userCount > 0) {
                errEmail = "Email already Taken";
            }
        }

        if (phoneNumber) {
            let userCount = await userModel({ phoneNumber: phoneNumber }).count();
            if (userCount > 0) {
                errPhoneNumber = "PhoneNumber Already Taken";
            }
        }

        if (errTitle || errVenue || errStart || errEnd || errEmail || errPhoneNumber) {
            let error = {
                title: errTitle,
                venueId: errVenue,
                start: errStart,
                end: errEnd,
                email: errEmail,
                phoneNumber: errPhoneNumber
            }
            return res.json({ status: "Failed", error: error });
        }
        next();
    },
    updateBooking: async (req, res, next) => {
        let { errTitle, errVenue, errStart, errEnd } = "";
        let { title, venueId, start, end } = req.body;
        if (!title) {
            errTitle = "Please provide a booking title";
        }
        if (!venueId) {
            errVenue = "Venue should be selected";
        }
        else {
            let venueCount = await venueModel.findOne({ _id: venueId }).count();
            if (venueCount < 1) {
                errVenue = "Venue does not exist";
            }
        }
        if (!start) {
            errStart = "Booking Start Time is not provided";
        }
        if (!end) {
            errEnd = "Booking End Time is not provided";
        }
        else {
            let validTime = new Date(end) - new Date(start);
            if (validTime <= 0) {
                errEnd = "End Time should be greater than Start Time";
            }
        }
        if (errTitle || errVenue || errStart || errEnd) {
            let error = {
                title: errTitle,
                venueId: errVenue,
                start: errStart,
                end: errEnd
            }
            return res.json({ status: "Failed", error: error });
        }
        next();
    }
}