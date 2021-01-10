const mongoose = require('mongoose');

const requiredString = {
    type: String,
    required: true
};

const AdminSchema = mongoose.Schema({
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
    empType: requiredString
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;