const path = require('path');
const mongoose = require('mongoose');

const profileImageBasePath = 'uploads/profile-pictures';

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
    location: requiredString,
    profileImageName: {
        type: String
    }
});

UserSchema.virtual('profileImagePath').get(function(){
    if(this.profileImageName){
        return path.join('/', profileImageBasePath, this.profileImageName);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
module.exports.profileImageBasePath = profileImageBasePath;