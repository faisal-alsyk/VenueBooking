const venueModel = require('../venues/model');

module.exports = {
    createVenue: async (req, res, next) =>{
        let {errName, errSize, errStatus, errVenue} = "";
        let {name, size, status, venueId} = req.body;
        if ( !name ) {
            errName = "Name for Venue is Required";
            return res.json({status: "Failed", name: "Name for Venue is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({name: name}).count();
            if ( venueCount > 0 ) {
                errName = "Name already taken";
                return res.json({status: "Failed", name: "Name already taken"});
            }
        }
        if ( !venueId ) {
            errVenue = "Venue Id is Required";
            return res.json({status: "Failed", venueId: "Venue Id is Required"});
        }
        else{
            let venueCount = await venueModel.findOne({venueId: venueId}).count();
            if ( venueCount > 0 ) {
                errVenue = "Venue ID should be Unique";
                return res.json({status: "Failed", venueId: "Venue ID should be Unique"});
            }
        }
        if ( size === 0 ){
            errSize = "Size should be greater than 0";
            return res.json({status: "Failed", size: "Size should be greater than 0."});
        }
        if ( !status ) {
            errStatus = "Please define the status of venue";
            return res.json({status: "Failed", role: "Please define the status of venue."});
        }
        if(errName || errSize || errStatus || errVenue) {
            let error = {
                name: errName,
                size: errSize,
                role: errStatus,
                venueId: errVenue
            }
            res.json({status: "Failed", error: error});
        }
        next();
    },
    updateVenue: async (req, res, next) => {
        let {errName, errSize, errStatus} = "";
        let {name, size, status} = req.body;
        if ( !name ) {
            errName = "Name for Venue is Required";
        }
        if ( size === 0 ){
            errSize = "Size should be greater than 0";
        }
        if ( !status ) {
            errStatus = "Please define the status of venue";
        }
        if(errName || errSize || errStatus) {
            let error = {
                name: errName,
                size: errSize,
                role: errStatus
            }
            res.json({status: "Failed", error: error});
        }
         next();
     }
}