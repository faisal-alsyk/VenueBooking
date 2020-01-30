const bookingModel = require('./model');
const userModel = require('../users/model');
const venueModel = require('../venues/model');

module.exports = {
    createBooking: async (req, res) => {
        try {
            let user = await userModel.findOne({_id: req.decoded._id},{password: 0, adminVerificationCode: 0});
            let {title, venueId, purpose, start, end} = req.body;
            let booking = await bookingModel.create({title: title, venueId: venueId, userId: user._id,
                    purpose: purpose, start: start, end: end});
            if (booking) {
                res.status(200).json({status: "Success", data: booking});
            }
            else{
                res.status(500).json({status: "Failed", message: "Unable to book a Venue"});
            }
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    createBookinginBulk: async (req, res) => {
        try {
            let allBookings = [];
            let bookings = req.body;
            for (booking of bookings){
                let {title, venueId, userId, purpose, start, end} = booking;
                let bookvenue = await bookingModel.create({title: title, venueId: venueId, userId: userId,
                    purpose: purpose, start: start, end: end});
                allBookings.push(bookvenue);
            }
            if (allBookings.length > 0) {
                res.status(200).json({status: "Success", data: allBookings});
            }
            else{
                res.status(500).json({status: "Failed", message: "Unable to book a Venues"});
            }
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    updateBooking: async (req, res) => {
        try {
            let {title, venueId, purpose, start, end} = req.body;
            await bookingModel.update({_id: req.params.id}, {title: title, venueId: venueId,
                purpose: purpose, start: start, end: end});
            res.status(200).json({status: "Updated", message: "booking Updated Successfully"});   
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    listBookings: async (req, res) => {
        try {
            const role = req.query.role;
            let bookings = [];
            if(role){
                let users = await userModel.find({role: role}, {_id: 1});
                bookings = await bookingModel.find({userId: {$in: users}});
            }
            else{
                bookings = await bookingModel.find({});
            }
            if(bookings) {
                res.status(200).json({status: "Success", data: bookings});
            }
            else{
                res.status(401).json({status: "Failed", message: "No booking yet."});
            }
        } 
        catch(e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    deleteBooking: async (req, res) => {
        try{
            let booking = await bookingModel.remove({ _id: req.params.id });
            if(!booking){
               return res.status(404).json({ status: "Error", message: "booking not Found! " });
            }
            else {
               return res.status(200).json({ status: "Deleted!", data: booking });
            }
         }
         catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
         }
    },
    getBooking: async (req, res)=>{
        try {
            let booking = await bookingModel.findOne({_id: req.params.id});
            if(booking){
                return res.status(200).json({status: "Success", data: booking});
            }
            else{
                return res.status(404).json({ status: "Failed", message: "Booking not Found" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    },
    getCalendarData: async (req, res)=>{
        try {
            let resources = [], resource = {}, events = [], event = {};
            const role = req.query.role;
            let bookings = [];
            if(role){
                let users = await userModel.find({role: role}, {password: 0, adminVerificationCode: 0});
                let usersId = [];
                users.map(user=>{
                    usersId.push(user._id);
                });
                bookings = await bookingModel.find({userId: {$in: usersId}});
            }
            else{
                bookings = await bookingModel.find({});
            }
            let venues = await venueModel.find({});
            if( venues ) {
                for (venue of venues) {
                    resource = {
                        "id": venue._id,
                        "title": venue.name
                    };
                    resources.push(resource);
                }
                if(bookings){
                    for (booking of bookings){
                        event = {
                            "id": booking._id,
                            "title": booking.title,
                            "start": booking.start,
                            "end": booking.end,
                            "resourceId": booking.venueId
                        };
                        events.push(event);
                    }
                    return res.status(200).json({status: "Success", resources: resources, events: events});
                }
                else{
                    return res.status(404).json({ status: "Failed", message: "There are no Bookings yet" });
                }
            }
            else{
                return res.status(404).json({ status: "Failed", message: "No Venues yet, Please add some Venues" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    }
}