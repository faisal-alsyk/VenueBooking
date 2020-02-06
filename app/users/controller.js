const userModel = require('./model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');

require('dotenv').config;

module.exports = {

   create: async (req, res)=>{
      try{
         let {name, email, password, phoneNumber, department, role, staffId} = req.body;
         let user = await userModel.create({ name: name, email: email,
            password: password, phoneNumber: phoneNumber, department: department, 
            role: role, staffId: staffId });
         const token = jwt.sign({ _id: user.id.toString() }, process.env['SECRET'], { expiresIn: "7 days" });
         
         if(user){
            await userModel.update({_id: user.id}, {token: token});
            user = await userModel.findOne({_id: user.id}, {password: 0});
            return res.status(200).json({ status: "Success", message: "User Created Successfully!"});
         }
         else{
            return res.status(500).json({ status: "failed", message: "Unable to Register."});
         }
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      }
   },

   login: async (req, res)=>{
      try{
         passport.authenticate('local', async (err, user)=>{
            if(err){
               return res.status(401).json({ status: "Error", message: err.message });
            }
            if (!user) {
               return res.status(404).json({ status: "Error", message: "User does not exist." });
            }
            else{
               let User = await userModel.findOne({_id: user.id},{password: 0, adminVerificationCode: 0});
               if(User.role === 'Admin'){
                  return res.status(403).json({status: "Not Authorized", message: "You can Login as Admin only"});
               }
               else if (User.role === 'Public'){
                  return res.status(403).json({status: "Not Authorized", message: "You cant Login as a normal user."});
               }
               else{
                  const token = jwt.sign({ _id: user.id.toString() }, process.env['SECRET'], { expiresIn: "7 days" });
                  await userModel.update({_id: user.id},{token: token});
                  User = await userModel.findOne({_id: user.id}, {password: 0, adminVerificationCode: 0});
                  return res.status(200).json({ status: "Success", data: User });
               }
               
            }
         })(req, res);
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      }
   },
   changePassword: async (req, res) => {
      try{
         let { id, password } = req.body;
         password = bcrypt.hashSync(password, 10);
         await userModel.update({_id: id}, {password: password});
         res.status(200).json({status: "Success", message: "Password Changed"});
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      }
   },
   updateUser: async (req, res)=>{
      try{
         let {name, email, phoneNumber, department, role} = req.body;
         await userModel.update({_id: req.params.id}, { name: name, email: email, 
            status: status, role: role, department: department, phoneNumber: phoneNumber});
         const user = await userModel.findOne({ _id: req.params.id }, { password: 0, adminVerificationCode: 0 });
         
         if(user){
            return res.status(200).json({ status: "Updated", message: "User Updated Successfully!", data: user });
         }
         else{
            return res.status(404).json({ status: "Update Failed", message: "User not Found."});
         }
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      }
   },

   removeUser: async (req, res)=> {
      try{
         user = await userModel.remove({ _id: req.params.id });
         if(!user){
            return res.status(404).json({ status: "Error", message: " User not Found! " });
         }
         else {
            return res.status(200).json({ status: "Deleted!", data: user });
         }
      }
      catch(e){
         return res.status(403).json({ status: "Error", message: e.message });
      }
   },

   ListUsers: async (req, res)=>{
      try{
         user = await userModel.find({}, { password: 0, adminVerificationCode: 0});
         if(user){
            return res.status(200).json({ status: "Success", message: "All Users", data: user });
         }
         else{
            return res.status(204).json({status: "No User's yet", message: "There are no users yet on laxir"});
         }
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      } 
   },
   viewUser: async (req, res) => {
      try{
         user = await userModel.findOne({ _id: req.params.id }, { password: 0});
         if (!user) {
            return res.status(404).json({ status: "Error", message: " User not Found! " });
         }
         else {
            return res.status(200).json({ status: "Success!", data: user });
         }
      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      } 
   },
   forgotPassword: async (req, res) => {
      try {
         buf = crypto.randomBytes(20);
         token = buf.toString('hex');
         user = await userModel.findOne({ email: req.body.email });
         if (user) {
            var smtpTransport = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               auth: {

                  type: "login",
                  user: "onestopms@gmail.com", //reset link email sender's email
                  pass: "onestopms1234"  //reset link email sender's password      
               }
            });
            var mailOptions = {
               to: user.email,
               from: 'passwordreset@demo.com',
               subject: 'Laxir Account Password Reset',
               text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  process.env['BASE_URL'] + 'resetpassword/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions);
            user.resetpasswordtoken = token;
            user.save();
            res.status(200);
            return res.json({ status: "Success", message: "An email for the reset password link have been sent." });

         }
      } catch (e) {
         return res.status(403).json({ status: "error", message: e.message });
      }
   },
   resetPassword: async (req, res)=> {
      try{
         user = await userModel.findOne({ resetpasswordtoken: req.params.token });
         if(!user){
            return res.status(404).json({ status: "Error", message: "Password reset token is invalid or has expired." });
         }
         else if (req.body.password !== req.body.confirmpassword) {
            return res.status(400).json({ status: "Error", message: "Password does not match" });
         }
         user.password = req.body.password;
         user.resetpasswordtoken = undefined;
         user.save();

         var smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            auth: {
               type: "login",
               user: "onestepms@gmail.com", //sender email
               pass: "onestepms1234"   //sender email's password
            }
         });
         var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
               'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
         };
         smtpTransport.sendMail(mailOptions);
         return res.status(200).json({status: "Success", message: `Password have been reset for user : ${user.email}.`});

      }
      catch(e){
         return res.status(403).json({ status: "error", message: e.message });
      }
   },
   dashboard: async (req,res)=>{
      let user = true;
      if(req.decoded._id){
         res.status(200).json({status: "Success", data: user});
      }
      else{
         user = false;
         res.status(200).json({status: "Success", data: user});
      }
   },
   userType: async (req, res) => {
      try {
         let user = userModel.findOne({_id: req.decoded._id}, {password: 0, adminVerificationCode: 0});
         if ( user ) {
            res.status(200).json({status: "Success", data: user.role});
         }
         else {
            res.json({message: "Failed", message: "Something is Wrong."});
         }
      }
      catch (e) {
         res.json({status: "Error", message: e.message});
      }
   }
}