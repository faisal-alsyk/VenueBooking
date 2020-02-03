const bookingModel = require('../bookings/model');
const venueModel = require('../venues/model');

module.exports = {
    createBooking: async (req, res, next) =>{
        let {title, venueId, purpose, start, end} = req.body;
        if ( !title ) {
            return res.json({status: "Failed", message: "Please provide a booking title"});
        }
        if ( !venueId ) {
            return res.json({status: "Failed", message: "Venue Id is Required"});
        }
        else {
            let venueCount = await venueModel.findOne({_id: venueId}).count();
            if ( venueCount < 1 ) {
                return res.json({status: "Failed", message: "Venue does not exist"});
            }
        }
        if ( !start ) {
            return res.json({status: "Failed", message: "Booking Start Time is not provided"});
        }
        if ( !end ) {
            return res.json({status: "Failed", message: "Booking End Time is not provided"});
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