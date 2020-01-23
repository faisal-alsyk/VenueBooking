const venueModel = require('./model');

module.exports = {
    createVenue: async (req, res) => {
        try {
            let venue = await venueModel.create({name: req.body.name, size: req.body.size,
                status: req.body.status, venueId: req.body.venueId});
            if (venue) {
                res.status(200).json({status: "Success", data: venue});
            }
            else{
                res.status(500).json({status: "Failed", message: "Unable to create a Venue"});
            }
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    updateVenue: async (req, res) => {
        try {
            await venueModel.update({_id: req.decoded._id}, {status: req.body.status});
            res.status(200).json({status: "Success", message: "Venue Status Updated"});   
        } 
        catch (e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    listVenues: async (req, res) => {
        try {
            let venues = await venueModel.find({});
            if(venues) {
                res.status(200).json({status: "Success", data: venues});
            }
            else{
                res.status(401).json({status: "Failed", message: "No venue Exist. Please add some Venues"});
            }
        } 
        catch(e) {
            return res.status(403).json({ status: "error", message: e.message });
        }
    },
    deleteVenue: async (req, res) => {
        try{
            let venue = await venueModel.remove({ _id: req.params.id });
            if(user){
               return res.status(404).json({ status: "Error", message: " Venue not Found! " });
            }
            else {
               return res.status(200).json({ status: "Deleted!", data: venue });
            }
         }
         catch (e) {
            return res.status(403).json({ status: "Error", message: e.message });
         }
    }
}