const userModel = require('../users/model');

module.exports = {
    createUser: async (req, res, next) =>{
        let {name, email, password, phoneNumber, department, role, staffId} = req.body;
        if ( !email ) {
            return res.json({status: "Failed", message: "Email is Required"});
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", message: "Email already taken"});
            }
        }
        if ( !phoneNumber ) {
            return res.json({status: "Failed", message: "A Unique Phone Number is Required"});
        }
        else{
            let userCount = await userModel.findOne({phoneNumber: phoneNumber}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", message: "Phone Number already taken"});
            }
        }
        if ( !role ) {
            return res.json({status: "Failed", message: "Role is not defined. Please Select a User Role"});
        }
        if ( !staffId ) {
            return res.json({status: "Failed", message: "Staff Id is Required"});
        }
        else{
            let userCount = await userModel.findOne({staffId: staffId}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", message: "Staff Id already assigned"});
            }
        }
        next();
    },
    userLogin : async ( req, res, next) => {
        let { email, password } = req.body;
        if ( !email ) {
            return res.json({status: "Failed", message: "You can not login without Email"});
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount < 1 ) {
                return res.json({status: "Failed", message: "Email does not Exist"});
            }
        }
        if( !password ){
            return res.json({status: "Failed", message: "Password not Entered"});
        }
        next();
    }
}