const bookingModel = require('./model');
const userModel = require('../users/model');
const venueModel = require('../venues/model');
const moment = require('moment');

let clashesWithExisting = (existingBookingStart, existingBookingEnd, newBookingStart, newBookingEnd) => {
    if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd || 
      existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {
      
    //   throw new Error(
        return `Booking could not be saved. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`
    //   )
    }
    return "true";
  }

let priorityBookingClashes = (existingBookingStart, existingBookingEnd, newBookingStart, newBookingEnd) => {
    if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd || 
      existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {
      return true;
    }
    return false;
  }


module.exports = {
    createBooking: async (req, res) => {
        try {
            const type = "Normal";
            let noClashes = "true";
            let user = await userModel.findOne({_id: req.decoded._id},{password: 0, adminVerificationCode: 0});
            let {title, venueId, purpose, start, end} = req.body;
            const bookedVenues = await bookingModel.find({venueId: venueId});
            let newStartTime = new moment(start);
            let newEndTime = new moment(end);
            for (bookedVenue of bookedVenues){
                noClashes = clashesWithExisting(bookedVenue.start, bookedVenue.end, newStartTime, newEndTime);
            }
            if(noClashes === "true"){
                let booking = await bookingModel.create({title: title, venueId: venueId, userId: user._id,
                    purpose: purpose, start: start, end: end, type: type});
                if (booking) {
                    res.status(200).json({status: "Success", data: booking});
                }
                else{
                    res.status(500).json({status: "Failed", message: "Unable to book a Venue"});
                }    
            }
            else {
                res.json({status: "Error", message: noClashes});
            }
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    createBookinginBulk: async (req, res) => {
        try {
            const type = "Normal";
            let allBookings = [], bookVenue = {}, start = '', end = '';
            let bookings = req.body;
            let user = await userModel.findOne({_id: req.decoded._id}, {adminVerificationCode: 0, password: 0});
            for (booking of bookings){
                let {title, venueName, purpose, startDate, endDate, startTime, endTime} = booking;
                let venue = await venueModel.findOne({name: venueName});
                start = moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm:ss').format();
                end = moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm:ss').format();
                if (start && end){
                    bookvenue = await bookingModel.create({title: title, venueId: venue._id, userId: user._id,
                        purpose: purpose, start: start, end: end, type: type});
                    allBookings.push(bookvenue);
                }
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
    },
    priorityBooking : async (req, res) => {
        try {
            let clashes = false, clashedBookings = [], clashbooking = [], booking = {}, clashWithPriority = false, type = "Priority";
            let user = await userModel.findOne({_id: req.decoded._id},{password: 0, adminVerificationCode: 0});
            let {title, venueId, purpose, start, end} = req.body;
            const bookedVenues = await bookingModel.find({venueId: venueId});
            let newStartTime = new moment(start);
            let newEndTime = new moment(end);
            for (bookedVenue of bookedVenues){
                clashes = priorityBookingClashes(bookedVenue.start, bookedVenue.end, newStartTime, newEndTime);
                if(clashes){
                    bookedVenue.time = (bookedVenue.end - bookedVenue.start);
                    clashedBookings.push(bookedVenue);
                    clashbooking.push(bookedVenue._id);
                }
            }
            
            for (clashedBooking of clashedBookings) {
                if(clashedBooking.type === "Priority") {
                    clashWithPriority = true;
                    break;
                }
            }
            if(clashWithPriority){
                return res.status(409).json({status: "Failed", message: "You can not book on already existing Priority Booking"});
            }
            booking = await bookingModel.create({title: title, venueId: venueId, userId: user._id,
                purpose: purpose, start: start, end: end, type: type});
            if (booking) {
                await bookingModel.remove({_id: {$in: clashbooking}});
                let existingBooking = await bookingModel.find({start: {$gte: newEndTime}});
                if(existingBooking.length === 0) {
                    let updatedStartTime = newEndTime, updatedEndTime;
                    for (clashedBooking of clashedBookings) {
                        updatedStartTime = new moment(updatedStartTime);
                        let time = clashedBooking.end - clashedBooking.start;
                        updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                        await bookingModel.create({title: clashedBooking.title, venueId: clashedBooking.venueId,
                                userId: clashedBooking.userId, purpose: clashedBooking.purpose, start: updatedStartTime,
                                end: updatedEndTime});
                    }
                }
                else {
                    for (clashedBooking of clashedBookings){
                        let existingBookingEnd = true;
                        for (let i = 0; i < existingBooking.length-1; i++){
                            let updatedStartTime = existingBooking[i].end, updatedEndTime;
                            let availableGap = existingBooking[i+1] - existingBooking[i];
                            if(availableGap > clashedBooking.time){
                                updatedStartTime = new moment(updatedStartTime);
                                let time = clashedBooking.end - clashedBooking.start;
                                updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                                await bookingModel.create({title: clashedBooking.title, venueId: clashedBooking.venueId,
                                        userId: clashedBooking.userId, purpose: clashedBooking.purpose, 
                                        start: updatedStartTime, end: updatedEndTime});
                                existingBookingEnd = false;
                                break;
                            }
                        }
                        if ( existingBookingEnd ){
                            let updatedStartTime = new moment(existingBooking[(existingBooking.length)-1].end);
                            let time = clashedBooking.end - clashedBooking.start;
                            let updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                            await bookingModel.create({title: clashedBooking.title, venueId: clashedBooking.venueId,
                                    userId: clashedBooking.userId, purpose: clashedBooking.purpose, 
                                    start: updatedStartTime, end: updatedEndTime});
                            existingBooking = await bookingModel.find({start: {$gte: newEndTime}});
                        }
                        existingBooking = await bookingModel.find({start: {$gte: newEndTime}});
                    }
                }

                res.status(200).json({status: "Success", data: booking});
            }
            else{
                res.status(500).json({status: "Failed", message: "Unable to book a Venue"});
            } 
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    }
}