const path = require('path');
const mongoose = require('mongoose');

const reportImageBasePath = 'uploads/harvest-photos';

const requiredString = {
    type: String,
    required: true
};

const ReportSchema = mongoose.Schema({
    nic: requiredString,
    title: requiredString,
    details: requiredString,
    imageName: requiredString,
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    accepted: {
        type: String
    }
});

ReportSchema.virtual('reportImagePath').get(function(){
    if(this.imageName){
        return path.join('/', reportImageBasePath, this.imageName);
    }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
module.exports.reportImageBasePath = reportImageBasePath;