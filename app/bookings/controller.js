const bookingModel = require('./model');
const userModel = require('../users/model');

module.exports = {
    createBooking: async (req, res) => {
        try {
            let user = await userModel.findOne({_id: req.decoded._id},{password: 0, adminVerificationCode: 0});
            let {name, venueId, purpose, date, time, startTime, endTime, endDate} = req.body;
            let booking = await bookingModel.create({name: name, venueId: venueId, userId: user.userId,
                    purpose: purpose, date: date, time: time, startTime: startTime,
                    endTime: endTime, endDate: endDate});
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
                let {name, venueId, userId, purpose, date, time, startTime, endTime, endDate} = booking;
                let bookvenue = await bookingModel.create({name: name, venueId: venueId, userId: userId,
                    purpose: purpose, date: date, time: time, startTime: startTime,
                    endTime: endTime, endDate: endDate});
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
            let {name, venueId, userId, purpose, date, time, startTime, endTime, endDate} = req.body;
            await bookingModel.update({_id: req.params.id}, {name: name, venueId: venueId,
                userId: userId,purpose: purpose, date: date, time: time, startTime: startTime,
                endTime: endTime, endDate: endDate});
            res.status(200).json({status: "Updated", message: "booking Updated Successfully"});   
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    listBookings: async (req, res) => {
        try {
            let bookings = await bookingModel.find({});
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
                return res.status(401).json({ status: "Failed", message: "Booking not Found" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    }
}