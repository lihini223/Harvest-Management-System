const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const Report = require('../models/Report');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const router = express.Router();

const uploadPath = path.join('public', Report.reportImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png'];

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// new report
router.post('/new', (req, res) => {
    res.send('New report added');
});

module.exports = router;