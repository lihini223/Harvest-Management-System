const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
};

const UserSchema = mongoose.Schema({
    nic: requiredString,
    fname: requiredString,
    lname: requiredString,
    email: requiredString,
    password: requiredString,
    contact: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        requied: true
    },
    location: requiredString
});

const User = mongoose.model('User', UserSchema);

module.exports = User;