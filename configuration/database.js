//Set up mongoose connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env['MONGODB_URL'], {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('failed connected to database');
});;

mongoose.Promise = global.Promise;
module.exports = mongoose;