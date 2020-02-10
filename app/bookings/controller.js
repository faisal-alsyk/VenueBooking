const bookingModel = require('./model');
const userModel = require('../users/model');
const venueModel = require('../venues/model');
const moment = require('moment');
const jwt = require('jsonwebtoken');
require('dotenv').config;

let clashesWithExisting = (existingBookingStart, existingBookingEnd, newBookingStart, newBookingEnd, type, title) => {
    if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd ||
        existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {
        if (type === "create") {
            return `Booking could not be saved. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`;
        }
        else if (type === "update") {
            return `Booking could not be Updated. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`
        }
        else {
            return `Event "${title}" could not be saved. There is a clash with an existing booking from ${moment(existingBookingStart).format('HH:mm')} to ${moment(existingBookingEnd).format('HH:mm on LL')}`;
        }
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
            let user = {};
            const role = "Public";
            let noClashes = "true";
            let clashes = false;
            let { title, venueId, purpose, start, end, email, phoneNumber } = req.body;
            const bookedVenues = await bookingModel.find({ venueId: venueId });
            let newStartTime = new moment(start);
            let newEndTime = new moment(end);

            for (bookedVenue of bookedVenues) {
                noClashes = clashesWithExisting(bookedVenue.start, bookedVenue.end, newStartTime, newEndTime, "create", title);
                if (noClashes !== "true") {
                    clashes = true;
                    break;
                }
                else {
                    clashes = false;
                }
            }
            if (clashes === false) {
                if (email) {
                    let existingUser = await userModel.findOne({ email: email }, { password: 0, adminVerificationCode: 0 });
                    if (!existingUser) {
                        user = await userModel.create({ email: email, phoneNumber: phoneNumber, role: role });
                        user = await userModel.findOne({ _id: user.id });
                        if (!user) {
                            return res.json({ status: "Failed", message: "Something went wrong. Try Again" });
                        }
                    }
                    else {
                        user = await userModel.findOne({ email: email }, { password: 0, adminVerificationCode: 0 });
                        if (!user) {
                            return res.json({ status: "Failed", message: "Something went wrong. Try Again" });
                        }
                    }

                }
                else {
                    user = await userModel.findOne({ _id: req.decoded._id }, { password: 0, adminVerificationCode: 0 });
                    if (!user) {
                        return res.json({ status: "Failed", message: "Something went wrong. Try Again" });
                    }
                }
                let booking = await bookingModel.create({
                    title: title, venueId: venueId, userId: user._id,
                    purpose: purpose, start: start, end: end
                });
                if (booking) {
                    res.status(200).json({ status: "Success", data: booking });
                }
                else {
                    res.json({ status: "Failed", message: "Unable to book a Venue" });
                }
            }
            else {
                res.json({ status: "Error", message: noClashes });
            }
        }
        catch (e) {
            return res.json({ status: "error", message: e.message });
        }
    },
    createBookinginBulk: async (req, res) => {
        try {
            let clashes = false;
            let noClashes = "true";
            let allBookings = [], bookVenue = {}, start = '', end = '', clashMessages = [];
            let bookings = req.body;
            let user = await userModel.findOne({ _id: req.decoded._id }, { adminVerificationCode: 0, password: 0 });
            for (booking of bookings) {
                let { title, venueName, purpose, startDate, endDate, startTime, endTime } = booking;
                let venue = await venueModel.findOne({ name: venueName });
                if (venue) {
                    start = new moment(`${startDate} ${startTime}`, 'YYYY-MM-DD h:mm:ss').format();
                    end = new moment(`${endDate} ${endTime}`, 'YYYY-MM-DD h:mm:ss').format();
                    let newStart = new moment(start);
                    let newEnd = new moment(end);
                    let venues = await bookingModel.find({ venueId: venue.id });

                    if (start && end) {
                        if (venues.length > 0) {
                            for (bookvenue of venues) {
                                noClashes = clashesWithExisting(bookvenue.start, bookvenue.end, newStart, newEnd, "bulk", title);
                                if (noClashes !== "true") {
                                    clashes = false;
                                    clashMessages.push(noClashes);
                                    break;
                                }
                                else {
                                    clashes = true;
                                }
                            }
                            if (clashes === true) {
                                bookVenue = await bookingModel.create({
                                    title: title, venueId: venue._id, userId: user._id,
                                    purpose: purpose, start: newStart, end: newEnd
                                });
                                allBookings.push(bookVenue);
                            }
                        }
                        else {
                            bookVenue = await bookingModel.create({
                                title: title, venueId: venue._id, userId: user._id,
                                purpose: purpose, start: newStart, end: newEnd
                            });
                            allBookings.push(bookVenue);
                        }
                    }
                }
                else {
                    res.json({ status: "Error", message: "Venue Name you have entered is not Valid. Kindly check if you are missing something." });
                }
            }
            if (allBookings.length > 0) {
                res.status(200).json({ status: "Success", data: allBookings, clashMessages: clashMessages });
            }
            else {
                res.json({ status: "Failed", message: "Unable to book Venues", clashMessages: clashMessages });
            }
        }
        catch (e) {
            return res.json({ status: "error", message: e.message });
        }
    },
    updateBooking: async (req, res) => {
        try {
            let clashes = false;
            let noClashes = "true";
            let { title, venueId, purpose, start, end } = req.body;
            const bookedVenues = await bookingModel.find({ venueId: venueId, _id: { $ne: req.params.id } });
            let newStartTime = new moment(start);
            let newEndTime = new moment(end);
            for (bookedVenue of bookedVenues) {
                noClashes = clashesWithExisting(bookedVenue.start, bookedVenue.end, newStartTime, newEndTime, "update", title);
                if (noClashes !== "true") {
                    clashes = false;
                    break;
                }
                else {
                    clashes = true;
                }
            }
            if (clashes) {
                await bookingModel.update({ _id: req.params.id }, {
                    title: title, venueId: venueId,
                    purpose: purpose, start: start, end: end
                });
                res.status(200).json({ status: "Updated", message: "Booking Updated Successfully" });
            }
            else {
                res.json({ status: "Error", message: noClashes });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    listBookings: async (req, res) => {
        try {
            const role = req.query.role;
            let bookings = [];
            if (role) {
                let users = await userModel.find({ role: role }, { _id: 1 });
                bookings = await bookingModel.find({ userId: { $in: users } });
            }
            else {
                bookings = await bookingModel.find({});
            }
            if (bookings) {
                res.status(200).json({ status: "Success", data: bookings });
            }
            else {
                res.status(401).json({ status: "Failed", message: "No booking yet." });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    deleteBooking: async (req, res) => {
        try {
            let { email } = req.body, user = {};
            if (email) {
                user = await userModel.findOne({ email: email }, { password: 0, adminVerificationCode: 0 });
                if (!user) {
                    return res.json({ status: "Failed", email: "Entered Email not Found." });
                }
            }
            else if (req.decoded._id) {
                user = await userModel.findOne({ _id: req.decoded._id }, { password: 0, adminVerificationCode: 0 });
                if (!user) {
                    return res.json({ status: "Failed", message: "Something went Wrong. Try Again" });
                }
            }
            else {
                return res.json({ status: "Failed", message: "No email or Authentication Supplied" });
            }
            if (user.role === 'Admin') {
                let booking = await bookingModel.remove({ _id: req.params.id });
                if (!booking) {
                    return res.status(404).json({ status: "Error", message: "Booking not Found! " });
                }
                else {
                    return res.status(200).json({ status: "Deleted!", data: booking });
                }
            }
            else {
                let booking = await bookingModel.findOne({ _id: req.params.id });
                if (booking.userId === user.id) {
                    let booking = await bookingModel.remove({ _id: req.params.id });
                    if (!booking) {
                        return res.json({
                            status: "Error",
                            message: "Something went Wrong!"
                        });
                    }
                    else {
                        return res.status(200).json({ status: "Deleted!", data: booking });
                    }
                }
                else {
                    return res.json({
                        status: "Failed",
                        message: "You are not an authorized person to delete other's bookings."
                    });
                }
            }


        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    },
    getBooking: async (req, res) => {
        try {
            let booking = await bookingModel.findOne({ _id: req.params.id });
            if (booking) {
                let user = await userModel.findOne({ _id: booking.userId }, { password: 0, adminVerificationCode: 0 });
                booking.userId = null;
                return res.status(200).json({ status: "Success", data: { booking, user } });
            }
            else {
                return res.status(404).json({ status: "Failed", message: "Booking not Found" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    },
    getCalendarData: async (req, res) => {
        try {
            let resources = [], resource = {}, events = [], event = {};
            const role = req.query.role;
            let bookings = [];
            if (role && role !== "All" && role !== "mybookings") {
                let users = [];
                if (role === "Users") {
                    users = await userModel.find({ role: "User" }, { password: 0, adminVerificationCode: 0 });
                }
                else {
                    users = await userModel.find({ role: role }, { password: 0, adminVerificationCode: 0 });
                }
                let usersId = [];
                users.map(user => {
                    usersId.push(user._id);
                });
                bookings = await bookingModel.find({ userId: { $in: usersId } });
            }
            else if (role === "mybookings") {
                let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
                if (token && token.startsWith('Bearer ')) {
                    token = token.slice(7, token.length);
                }
                if (token) {
                    jwt.verify(token, process.env['SECRET'], async (err, decoded) => {
                        if (err) {
                            return res.json({
                                status: "Failed",
                                message: 'Token is not valid'
                            });
                        } else {
                            bookings = await bookingModel.find({ userId: decoded._id });
                        }
                    });
                }
            }
            else {
                bookings = await bookingModel.find({});
            }
            let venues = await venueModel.find({});
            if (venues) {
                for (venue of venues) {
                    resource = {
                        "id": venue._id,
                        "title": venue.name
                    };
                    resources.push(resource);
                }
                if (bookings) {
                    for (booking of bookings) {
                        event = {
                            "id": booking._id,
                            "title": booking.title,
                            "start": booking.start,
                            "end": booking.end,
                            "resourceId": booking.venueId
                        };
                        events.push(event);
                    }
                    return res.status(200).json({ status: "Success", resources: resources, events: events });
                }
                else {
                    return res.status(404).json({ status: "Failed", message: "There are no Bookings yet" });
                }
            }
            else {
                return res.status(404).json({ status: "Failed", message: "No Venues yet, Please add some Venues" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    },
    priorityBooking: async (req, res) => {
        try {
            let clashes = false, clashedBookings = [], clashbooking = [], booking = {}, clashWithPriority = false, type = "Priority";
            let user = await userModel.findOne({ _id: req.decoded._id }, { password: 0, adminVerificationCode: 0 });
            let { title, venueId, purpose, start, end } = req.body;
            const bookedVenues = await bookingModel.find({ venueId: venueId });
            let newStartTime = new moment(start);
            let newEndTime = new moment(end);
            for (bookedVenue of bookedVenues) {
                clashes = priorityBookingClashes(bookedVenue.start, bookedVenue.end, newStartTime, newEndTime);
                if (clashes) {
                    bookedVenue.time = (bookedVenue.end - bookedVenue.start);
                    clashedBookings.push(bookedVenue);
                    clashbooking.push(bookedVenue._id);
                }
            }
            booking = await bookingModel.create({
                title: title, venueId: venueId, userId: user._id,
                purpose: purpose, start: start, end: end
            });
            if (booking) {
                await bookingModel.remove({ _id: { $in: clashbooking } });
                let existingBooking = await bookingModel.find({ start: { $gte: newEndTime } });
                if (existingBooking.length === 0) {
                    let updatedStartTime = newEndTime, updatedEndTime;
                    for (clashedBooking of clashedBookings) {
                        updatedStartTime = new moment(updatedStartTime);
                        let time = clashedBooking.end - clashedBooking.start;
                        updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                        await bookingModel.create({
                            title: clashedBooking.title, venueId: clashedBooking.venueId,
                            userId: clashedBooking.userId, purpose: clashedBooking.purpose, start: updatedStartTime,
                            end: updatedEndTime
                        });
                    }
                }
                else {
                    for (clashedBooking of clashedBookings) {
                        let existingBookingEnd = true;
                        let availableGap = existingBooking[0].start - new Date(newEndTime);
                        if (availableGap >= clashedBooking.time) {
                            let updatedStartTime = newEndTime;
                            updatedStartTime = new moment(updatedStartTime);
                            let time = clashedBooking.end - clashedBooking.start;
                            updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                            await bookingModel.create({
                                title: clashedBooking.title, venueId: clashedBooking.venueId,
                                userId: clashedBooking.userId, purpose: clashedBooking.purpose,
                                start: updatedStartTime, end: updatedEndTime
                            });
                            existingBooking = await bookingModel.find({ start: { $gte: newEndTime } });
                        }
                        else {
                            for (let i = 0; i < existingBooking.length - 1; i++) {
                                let updatedStartTime = existingBooking[i].end, updatedEndTime;
                                let availableGap = existingBooking[i + 1].start - existingBooking[i].end;
                                if (availableGap >= clashedBooking.time) {
                                    updatedStartTime = new moment(updatedStartTime);
                                    let time = clashedBooking.end - clashedBooking.start;
                                    updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                                    await bookingModel.create({
                                        title: clashedBooking.title, venueId: clashedBooking.venueId,
                                        userId: clashedBooking.userId, purpose: clashedBooking.purpose,
                                        start: updatedStartTime, end: updatedEndTime
                                    });
                                    existingBookingEnd = false;
                                    break;
                                }
                            }
                            if (existingBookingEnd) {
                                let updatedStartTime = new moment(existingBooking[(existingBooking.length) - 1].end);
                                let time = clashedBooking.end - clashedBooking.start;
                                let updatedEndTime = new moment(updatedStartTime).add(time, 'ms');
                                await bookingModel.create({
                                    title: clashedBooking.title, venueId: clashedBooking.venueId,
                                    userId: clashedBooking.userId, purpose: clashedBooking.purpose,
                                    start: updatedStartTime, end: updatedEndTime
                                });
                            }
                            existingBooking = await bookingModel.find({ start: { $gte: newEndTime } });
                        }
                    }

                }
                res.status(200).json({ status: "Success", data: booking });
            }
            else {
                res.status(500).json({ status: "Failed", message: "Unable to book a Venue" });
            }
        }
        catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
        }
    }
}