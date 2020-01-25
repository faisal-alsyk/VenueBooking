const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
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
    staffId: {
        type: String,
        trim: true
    },
    adminVerificationCode: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    token: {
        type: String,
        trim: true,
    },
    resetpasswordtoken: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Staff'],
        default: 'Staff'
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Active',
        trim: true
    }
},{timestamps: true});
// hash user password before saving into database
UserSchema.pre('save', async function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);