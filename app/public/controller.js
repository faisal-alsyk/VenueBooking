const publicModel = require('../users/model');

module.exports = {
    create: async (req, res) => {
        try {
            let {name, email, phoneNumber} = req.body;
            const token = jwt.sign({ _id: user.id.toString() }, process.env['SECRET'], { expiresIn: "7 days" });
            let user = await publicModel.create({name: name, email: email, phoneNumber: phoneNumber,
                role: 'Public', token: token});
            if ( user ) {
                res.status(200).json({status: "Success", message: "You can Access as a Public Now", data: user});
            }
            else{
                res.status(500).json({status: "Failed", message: "Some Problem occured. Please try Again"});
            }
        }
        catch (e) {
            res.json({status: "Error", message: e.message});
        }
    },
    existingPublicUser: async (req, res) => {
        try {
            let {email} = req.body;
            let user = await publicModel.findOne({email: email});
            if ( user ) {
                if (user.role === 'Public'){
                    const token = jwt.sign({ _id: user.id.toString() }, process.env['SECRET'], { expiresIn: "7 days" });
                    await publicModel.update({_id: user.id},{token: token});
                    user = await publicModel.findOne({_id: user.id});
                res.status(200).json({status: "Success", message: "You can Access as a Public Now", data: user});
                }
                else {
                    res.json({status: "Failed", message: "This Feature is for Public User"});
                }
            }
            else{
                res.status(500).json({status: "Failed", message: "Some Problem occured. Please try Again"});
            }
        }
        catch (e) {
            res.json({status: "Error", message: e.message});
        }
    }
}