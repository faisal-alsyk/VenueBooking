const userModel = require('../users/model');

module.exports = {
    createUser: async (req, res, next) => {
        let { errName, errEmail, errPhoneNumber } = "";
        let { name, email, phoneNumber } = req.body;
        if (!name) {
            errName = "Name is Required";
        }
        if (!email) {
            errEmail = "Email is Required";
        }
        else {
            let userCount = await userModel.findOne({ email: email }).count();
            if (userCount > 0) {
                errEmail = "Email already taken";
            }
        }
        if (!phoneNumber) {
            errPhoneNumber = "A Unique Phone Number is Required";
        }
        else {
            let userCount = await userModel.findOne({ phoneNumber: phoneNumber }).count();
            if (userCount > 0) {
                errPhoneNumber = "Phone Number already taken";
            }
        }
        if (errName || errEmail || errPhoneNumber) {
            let error = {
                name: errName,
                email: errEmail,
                password: errPhoneNumber
            };
            return res.json({ status: "Failed", error: error });
        }
        else {
            next();
        }
    }
}