const fs = require('fs');
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const multer = require('multer');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const User = require('../models/User');
const Report = require('../models/Report');
const Chat = require('../models/Chat');

const router = express.Router();

const uploadPath = path.join('public', User.profileImageBasePath); // upload location of profile images

const imageMimeTypes = ['image/jpeg', 'image/png']; // accepted image types

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// send login page
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

// login user
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}));

// send register page
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
});

// register user
router.post('/register', checkNotAuthenticated, upload.single('profileImage'), async (req, res) => {
    const imageName = req.file != null ? req.file.filename : null;

    const {
        userId,
        fname,
        lname,
        email,
        password,
        contact,
        dob,
        userLocationLat,
        userLocationLng
    } = req.body;

    let errors = [];

    if(!userId || !fname || !lname || !email || !password || !contact || !dob){
        errors.push({ msg: 'Please enter all the details' });
    }

    if(userId.length < 10 || userId.length > 12){
        errors.push({ msg: 'Invalid NIC' });
    }

    if(password.length < 8 || password.length > 20){
        errors.push({ msg: 'Password should be between 8 and 20 characters' });
    }

    if(userLocationLat == '' || userLocationLng == ''){
        errors.push({ msg: 'Please enter a valid location' });
    }

    if(errors.length > 0){
        if(imageName != null){
            removeProfileImage(imageName);
        }
        
        res.render('register', { errors, userId }); // reload same page if there are errors, send back entered details
    } else {
        try{
            // check if user already exists
            const userExists = await User.findOne({ nic: userId });
            
            // user already exists
            if(userExists){
                errors.push({ msg: 'NIC already exists' });

                if(imageName != null){
                    removeProfileImage(imageName);
                }

                res.render('register', { errors });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10); // hash password, 10 is number of rounds

                const lat = Number(userLocationLat);
                const lng = Number(userLocationLng);

                const user = new User({
                    nic: userId,
                    fname,
                    lname,
                    email,
                    password: hashedPassword,
                    contact,
                    dob: new Date(dob),
                    lat,
                    lng,
                    profileImageName: imageName
                });

                const newUser = await user.save(); // add user to database

                res.redirect('/users/login');
            }
        } catch(err) {
            if(imageName != null){
                removeProfileImage(imageName);
            }

            errors.push({ msg: 'Internal error, try again later' });

            res.render('register', { errors });
        }
    }
});

router.get('/dashboard', checkAuthenticated, async (req, res) => {
    if(req.user.empType){
        res.redirect('/users/login');
    } else {
        try{
            const messages = await Chat.findOne({ nic: req.user.nic });

            res.render('user-dashboard', { user: req.user, messages: JSON.stringify(messages.messages) });
        } catch(err) {
            res.render('user-dashboard', { user: req.user });
        }
    }
});

router.get('/reports', checkAuthenticated, async (req, res) => {
    if(req.user.empType){
        res.redirect('/users/login');
    } else {
        try{
            const reports = await Report.find({ nic: req.user.nic });
    
            res.render('reports', { user: req.user, reports });
        } catch{
            res.redirect('/users/dashboard');
        }
    }
});

// send profile page
router.get('/profile', checkAuthenticated, async (req, res) => {
    if(req.user.empType){
        res.redirect('/users/login');
    } else {
        try{
            res.render('profile', { user: req.user });
        } catch{
            res.redirect('/');
        }
    }
});

function removeProfileImage(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err);
    });
}

module.exports = router;