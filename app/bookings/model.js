const mongoose = require('mongoose');

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
        type: String,
        trim: true
    },
    end: {
        type: String,
        trim: true
    }
    
},{timestamps: true});


module.exports = mongoose.model('Booking', BookingSchema);