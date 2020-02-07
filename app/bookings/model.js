const mongoose = require('mongoose');
const Venues = require('../venues/model');
const moment = require('moment');
//Define a schema
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    venueId: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        trim: true
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    }
    
},{timestamps: true});


module.exports = mongoose.model('Booking', BookingSchema);