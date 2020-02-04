const venueModel = require('../venues/model');

module.exports = {
    createVenue: async (req, res, next) =>{
        let {name, size, status, venueId} = req.body;
        if ( !name ) {
            return res.json({status: "Failed", name: "Name for Venue is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({name: name}).count();
            if ( venueCount > 0 ) {
                return res.json({status: "Failed", name: "Name already taken"});
            }
        }
        if ( !venueId ) {
            return res.json({status: "Failed", venueId: "Venue Id is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({venueId: venueId}).count();
            if ( venueCount > 0 ) {
                return res.json({status: "Failed", venueId: "Venue ID should be Unique"});
            }
        }
        if ( size === 0 ){
            return res.json({status: "Failed", size: "Size should be greater than 0."});
        }
        if ( !status ) {
            return res.json({status: "Failed", role: "Please define the status of venue."});
        }
        next();
    }
}