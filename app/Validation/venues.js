const venueModel = require('../venues/model');

module.exports = {
    createVenue: async (req, res, next) =>{
        let {name, size, status, venueId} = req.body;
        if ( !name ) {
            return res.json({status: "Failed", message: "Name for Venue is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({name: name}).count();
            if ( venueCount > 0 ) {
                return res.json({status: "Failed", message: "Name already taken"});
            }
        }
        if ( !venueId ) {
            return res.json({status: "Failed", message: "Venue Id is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({venueId: venueId}).count();
            if ( venueCount > 0 ) {
                return res.json({status: "Failed", message: "Venue ID should be Unique"});
            }
        }
        next();
    }
}