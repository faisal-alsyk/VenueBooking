const userModel = require('../users/model');

module.exports = {
    createUser: async (req, res, next) =>{
        let {name, email, password, phoneNumber, status, department, role, staffId} = req.body;
        if( !name ) {
            return res.json({status: "Failed", name: "Name is Required"});
        }
        if ( !email ) {
            return res.json({status: "Failed", email: "Email is Required"});
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", email: "Email already taken"});
            }
        }
        if( !password ) {
            return res.json({status: "Failed", password: "Password is Required"});
        }
        if ( !phoneNumber ) {
            return res.json({status: "Failed", phoneNumber: "A Unique Phone Number is Required"});
        }
        else{
            let userCount = await userModel.findOne({phoneNumber: phoneNumber}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", phoneNumber: "Phone Number already taken"});
            }
        }
        if ( !role ) {
            return res.json({status: "Failed", role: "Role is not defined. Please Select a User Role"});
        }
        if ( !staffId ) {
            return res.json({status: "Failed", staffId: "Staff Id is Required"});
        }
        else if ( staffId === 0 ) {
            return res.json({status: "Failed", staffId: "Staff Id should not be 0"});
        }
        else{
            let userCount = await userModel.findOne({staffId: staffId}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", staffId: "Staff Id already assigned"});
            }
        }
        if ( !department ) {
            return res.json({status: "Failed", department: "Department not selected"});

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
    },
    updateUser: async (req, res, next) => {
        let {name, email, status, department, role} = req.body;
        
        if( !name ) {
            return res.json({status: "Failed", name: "Name is Required"});
        }
        if ( !email ) {
            return res.json({status: "Failed", email: "Email is Required"});
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount > 0 ) {
                return res.json({status: "Failed", email: "Email already taken"});
            }
        }
        if ( !role ) {
            return res.json({status: "Failed", role: "Role is not selected"});
        }
        if( !status ){
            return res.json({status: "Failed", status: "Status not selected"});
        }
        if ( !department ) {
            return res.json({status: "Failed", department: "Department not selected"});

        }
        
        next();
    }
}