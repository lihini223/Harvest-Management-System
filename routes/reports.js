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
router.post('/new', checkAuthenticated, upload.single('reportImage'), async (req, res) => {
    const imageName = req.file != null ? req.file.filename : null;

    try{
        const reports = await Report.find({ nic: req.user.nic });

        let errors = [];

        if(reports.length >= 3){
            errors.push({ msg: 'Maximum report limit reached' });

            if(imageName != null){
                removeReportImage(imageName);
            }

            return res.render('reports', { reports, errors });
        } else {
            const report = new Report({
                nic: req.user.nic,
                details: req.body.details,
                imageName
            });

            const newReport = await report.save();

            res.redirect('/users/reports');
        }
    } catch(err){
        if(imageName != null){
            removeReportImage(imageName);
        }

        res.redirect('/users/reports');
    }
});

router.post('/edit/:id', checkAuthenticated, async (req, res) => {
    const reportId = req.params.id;

    const { details } = req.body;

    try{
        const newReport = await Report.updateOne({ _id: reportId }, { details: details });

        res.redirect('/users/reports');
    } catch(err){
        res.redirect('/users/reports');
    }
});

router.delete('/delete/:id', checkAuthenticated, async (req, res) => {
    const reportId = req.params.id;

    try{
        const report = await Report.findOne({ _id: reportId });

        const deletedReport = await Report.deleteOne({ _id: reportId });

        if(report.imageName && report.imageName != null){
            removeReportImage(report.imageName);
        }

        res.redirect('/users/reports');
    } catch(err) {
        res.redirect('/users/reports');
    }
});

function removeReportImage(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err);
    });
}

module.exports = router;

/*const imageName = req.file != null ? req.file.filename : null;

const report = {
    userId: req.user.nic,
    details: req.body.details,
    imageName
};

const existingReport = await Report.findOne({ userId: req.user.nic }); // check for existing report

try{
    const newReport = await Report.updateOne(
        { userId: req.user.nic },
        report,
        { upsert: true }
    );

    // remove previous report images
    if(existingReport){
        if(existingReport.imageName && existingReport.imageName != null){
            removeReportImage(existingReport.imageName);
        }
    }

    const currentReport = await Report.findOne({ userId: req.user.nic });

    res.redirect('/users/dashboard');
} catch(err) {
    if(report.imageName && report.imageName != null){
        removeReportImage(report.imageName);
    }

    res.redirect('/users/dashboard');
}*/

/*
router.post('/new', checkAuthenticated, upload.array('reportImages', 2), async (req, res) => {
    const image1 = req.files[0] != null ? req.files[0].filename : null;
    const image2 = req.files[1] != null ? req.files[1].filename : null;
*/

/*
//if(image2) report.reportImage2Name = image2;

    report.reportImage2Name = image2 != null ? image2 : '';
*/