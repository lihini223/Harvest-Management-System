const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const Report = require('../models/Report');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const router = express.Router();

const uploadPath = path.join('public', Report.reportImageBasePath); // upload location of report images

const imageMimeTypes = ['image/jpeg', 'image/png']; // accepted image types

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// new report
router.post('/new', checkAuthenticated, upload.array('reportImages', 2), async (req, res) => {
    const image1 = req.files[0] != null ? req.files[0].filename : null;
    const image2 = req.files[1] != null ? req.files[1].filename : null;

    const report = {
        userId: req.user.nic,
        details: req.body.details,
        reportImage1Name: image1
    };

    //if(image2) report.reportImage2Name = image2;

    report.reportImage2Name = image2 != null ? image2 : '';

    const existingReport = await Report.findOne({ userId: req.user.nic }); // check for existing report

    try{
        const newReport = await Report.updateOne(
            { userId: req.user.nic },
            report,
            { upsert: true }
        );

        // remove previous report images
        if(existingReport){
            if(existingReport.reportImage1Name && existingReport.reportImage1Name != null){
                removeReportImage(existingReport.reportImage1Name);
            }
            if(existingReport.reportImage2Name && existingReport.reportImage2Name != null && existingReport.reportImage2Name != ''){
                removeReportImage(existingReport.reportImage2Name);
            }
        }

        const currentReport = await Report.findOne({ userId: req.user.nic });

        res.redirect('/users/dashboard');
    } catch(err) {
        if(report.reportImage1Name && report.reportImage1Name != null){
            removeReportImage(report.reportImage1Name);
        }

        res.redirect('/users/dashboard');
    }
    
    /*try{
        const newReport = await report.save();

        res.redirect('/users/profile');
    } catch{
        if(report.reportImage1Name != null){
            removeReportImage(report.reportImage1Name);
        }

        res.render('profile');
    }*/
});

router.delete('/delete', checkAuthenticated, async (req, res) => {
    let report;

    try{
        report = await Report.findOne({ userId: req.user.nic });

        const deletedReport = await Report.deleteOne({ userId: req.user.nic });

        if(report.reportImage1Name && report.reportImage1Name != null){
            removeReportImage(report.reportImage1Name);
        }
        if(report.reportImage2Name && report.reportImage2Name != null && report.reportImage2Name != ''){
            removeReportImage(report.reportImage2Name);
        }

        res.redirect('/users/profile');
    } catch(err) {
        res.redirect('/users/profile');
    }
});

function removeReportImage(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err);
    });
}

module.exports = router;