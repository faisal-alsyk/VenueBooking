const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Define a schema
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    adminVerificationCode: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true,
    },
    resetpasswordtoken: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        default: 'Admin'
    }
},{timestamps: true});
// hash user password before saving into database
AdminSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

AdminSchema.methods.comparePassword = function (candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);