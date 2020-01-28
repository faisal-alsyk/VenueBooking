const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        trim: true,
        required: true
    },
    venueId: {
        type: String,
        trim: true,
        required: true
    },
    purpose: {
        type: String,
        trim: true
    },
    date: {
        type: String,
        trim: true,
        required: true
    },
    time: {
        type: String,
        trim: true,
        required: true
    },
    endDate: {
        type: String,
        trim: true
    },
    startTime: {
        type: String,
        trim: true
    },
    endTime: {
        type: String,
        trim: true
    }
    
},{timestamps: true});


module.exports = mongoose.model('Booking', BookingSchema);