const bookingModel = require('../bookings/model');
const venueModel = require('../venues/model');
const userModel = require('../users/model');
const moment = require('moment');

module.exports = {
    createBooking: async (req, res, next) =>{
        let {errTitle, errVenue, errStart, errEnd, errEmail, errPhoneNumber} = "";
        let {title, venueId,  start, end, email, phoneNumber} = req.body;
        if ( !title ) {
            errTitle = "Please provide a booking title";
        }
        if ( !venueId ) {
            errVenue = "Venue Id is Required";
        }
        else {
            let venueCount = await venueModel.findOne({_id: venueId}).count();
            if ( venueCount < 1 ) {
                errVenue = "Venue does not exist";
            }
        }
        if ( !start ) {
            errStart = "Booking Start Time is not provided";
        }
        else {
            let startTime = moment(start, 'YYYY-MM-DD h:mm:ss', true).isValid();
            if (!startTime) {
                errStart = "Format is not Valid";
            }
        }
        if ( !end ) {
            errEnd = "Booking End Time is not provided";
        }
        else {
            let endTime = moment(end, 'YYYY-MM-DD h:mm:ss', true).isValid();
            if (!endTime) {
                errEnd = "Format is not Valid";
            }
        }
        let validTime = new Date(end) - new Date(start);
        if ( validTime <= 0 ){
            errEnd = "End Time should be greater than Start Time";
        }

        if ( email ) {
            let userCount = await userModel({email: email}).count();
            if (userCount > 0){
                errEmail = "Email already Taken";
            }
        }

        if ( phoneNumber ) {
            let userCount = await userModel({phoneNumber: phoneNumber}).count();
            if (userCount > 0){
                errPhoneNumber = "PhoneNumber Already Taken";
            }
        }

        if ( errTitle || errVenue || errStart || errEnd || errEmail || errPhoneNumber ) {
            let error = {
                title: errTitle,
                venueId: errVenue,
                start: errStart, 
                end: errEnd,
                email: errEmail,
                phoneNumber: errPhoneNumber
            }
            return res.json({status: "Failed", error: error});
        }
        next();
    },
    updateBooking: async (req, res, next) => {
        let {title, venueId, purpose, start, end} = req.body;
        if ( !title ) {
            return res.json({status: "Failed", title: "Please provide a booking title"});
        }
        if ( !venueId ) {
            return res.json({status: "Failed", venueId: "Venue not Selected"});
        }
        else {
            let venueCount = await venueModel.findOne({_id: venueId}).count();
            if ( venueCount < 1 ) {
                return res.json({status: "Failed", venueId: "Venue does not exist"});
            }
        }
        if ( !start ) {
            return res.json({status: "Failed", start: "Booking Start Time is not provided"});
        }
        if ( !end ) {
            return res.json({status: "Failed", end: "Booking End Time is not provided"});
        }
        next();
    }
}