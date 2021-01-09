const path = require('path');
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

ReportSchema.virtual('reportImage1Path').get(function(){
    if(this.reportImage1Name){
        return path.join('/', reportImageBasePath, this.reportImage1Name);
    }
});

ReportSchema.virtual('reportImage2Path').get(function(){
    if(this.reportImage2Name){
        return path.join('/', reportImageBasePath, this.reportImage2Name);
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
module.exports.reportImageBasePath = reportImageBasePath;