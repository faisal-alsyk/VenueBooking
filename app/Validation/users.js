const userModel = require('../users/model');

module.exports = {
    createUser: async (req, res, next) =>{
        let {errName, errEmail, errPassword, errPhoneNumber, errDepartment, errRole, errStaffId} = "";
        let {name, email, password, phoneNumber, status, department, role, staffId} = req.body;
        if( !name ) {
            errName = "Name is Required";
            return res.json({status: "Failed", name: "Name is Required"});
        }
        if ( !email ) {
            errEmail = "Email is Required";
            return res.json({status: "Failed", email: "Email is Required"});
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount > 0 ) {
                errEmail = "Email already taken";
                return res.json({status: "Failed", email: "Email already taken"});
            }
        }
        if( !password ) {
            return res.json({status: "Failed", password: "Password is Required"});
        }
        if ( !phoneNumber ) {
            errPhoneNumber = "A Unique Phone Number is Required";
            return res.json({status: "Failed", phoneNumber: "A Unique Phone Number is Required"});
        }
        else{
            let userCount = await userModel.findOne({phoneNumber: phoneNumber}).count();
            if ( userCount > 0 ) {
                errPhoneNumber = "Phone Number already taken";
                return res.json({status: "Failed", phoneNumber: "Phone Number already taken"});
            }
        }
        if ( !role ) {
            errRole = "Role is not defined. Please Select a User Role";
            return res.json({status: "Failed", role: "Role is not defined. Please Select a User Role"});
        }
        if ( !staffId ) {
            errStaffId = "User Id is Required";
            return res.json({status: "Failed", staffId: "Staff Id is Required"});
        }
        else if ( staffId === 0 ) {
            errStaffId = "Staff Id should not be 0";
            return res.json({status: "Failed", staffId: "Staff Id should not be 0"});
        }
        else{
            let userCount = await userModel.findOne({staffId: staffId}).count();
            if ( userCount > 0 ) {
                errStaffId = "Staff Id already assigned";
                return res.json({status: "Failed", staffId: "Staff Id already assigned"});
            }
        }
        if ( !department ) {
            errDepartment = "Department not selected";
            return res.json({status: "Failed", department: "Department not selected"});
        }
        next();
    },
    userLogin : async ( req, res, next) => {
        let {errEmail, errPassword} = "";
        let { email, password } = req.body;
        if ( !email ) {
            errEmail = "You can not login without Email";
        }
        else{
            let userCount = await userModel.findOne({email: email}).count();
            if ( userCount < 1 ) {
                errEmail = "Email does not Exist";
            }
        }
        if( !password ){
            errPassword = "Please Enter Password";
        }
        if (errEmail || errPassword){
            let error = {
                email: errEmail,
                password: errPassword
            };
            return res.json({status: "Failed", error: error});
        }
        else {
            next();
        } 
    },
    updateUser: async (req, res, next) => {
        let {errName, errEmail, errDepartment, errRole, errStatus} = "";
        let {name, email, status, department, role} = req.body;
        
        if( !name ) {
            errName = "Name is Required";
        }
        if ( !email ) {
            errEmail = "Email is Required";
        }
        if ( !role || role === "Select Role") {
            errRole = "User Role not selected";
        }
        if ( !department || department === "Select Department") {
            errDepartment = "Department not selected";
        }
        if( !status || status === "Select Status"){
            errStatus = "Status not selected";
        }
        if(errName || errEmail || errRole || errDepartment || errStatus){
            let error = {
                name: errName,
                email: errEmail,
                status: errStatus,
                role: errRole,
                department: errDepartment
            };
            return res.json({status: "Failed", error: error});
        }
        else {
            next();
        }
        
    }
}