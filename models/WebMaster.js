const mongoose = require('mongoose');

const WebMasterSchema = mongoose.Schema({
    empId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    empType: {
        type: String,
        required: true
    }
});

const WebMaster = mongoose.model('Webmaster', WebMasterSchema);

module.exports = WebMaster;