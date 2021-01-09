const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const User = require('../models/User');
const Report = require('../models/Report');

const router = express.Router();

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
router.post('/register', checkNotAuthenticated, async (req, res) => {
    const { userId, password, userLocationLat, userLocationLng } = req.body;

    let errors = [];

    if(!userId || !password){
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
        res.render('register', { errors, userId }); // reload same page if there are errors, send back entered details
    } else {
        try{
            // check if user already exists
            const userExists = await User.findOne({ nic: userId });
            
            // user already exists
            if(userExists){
                errors.push({ msg: 'NIC already exists' });
                res.render('register', { errors });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10); // hash password, 10 is number of rounds

                const latLng = { lat: Number(userLocationLat), lng: Number(userLocationLng) };
                const location = JSON.stringify(latLng);

                const user = new User({ nic: userId, password: hashedPassword, location });

                const newUser = await user.save(); // add user to database

                res.redirect('/users/login');
            }
        } catch(err) {
            console.log(err);
            errors.push({ msg: 'Internal error, try again later' });
            res.render('register', { errors });
        }
    }
});

// send profile page
router.get('/profile', async (req, res) => {
    try{
        const report = await Report.findOne({ userId: req.user.nic });
        
        res.render('profile', { report });
    } catch{
        res.redirect('/');
    }
});

module.exports = router;