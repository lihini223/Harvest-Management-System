const mongoose = require('mongoose');

const reportImageBasePath = 'uploads/harvest-photos';

const ReportSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    reportImage1Name: {
        type: String,
        require: true
    },
    reportImage2Name: {
        type: String
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
module.exports.reportImageBasePath = reportImageBasePath;