const bookingModel = require('../app/bookings/model');
module.exports = {
    getTimeSlot: async (venueId, start, end) =>{
        let bookings = await bookingModel.find({venueId: venueId});
        let available = true;
        let startTime = new Date(start), endTime = new Date(end);
        if (bookings) {
            for (booking of bookings) {
                let vstart = new Date(booking.start);
                let vend = new Date (booking.end);
                available = ( startTime < vend && vstart < endTime );
                if (!available){
                    break;
                }
            }
            return available;
        }
        else {
            return true;
        }
    }
}