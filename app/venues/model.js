const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const VenueSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    size: {
        type: Number
    },
    status: {
        type: String,
        trim: true
    },
    venueId: {
        type: Number,
        unique: true,
        unique: true
    }
    
},{timestamps: true});


module.exports = mongoose.model('Venue', VenueSchema);