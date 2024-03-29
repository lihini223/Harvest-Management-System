const express = require('express');
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');
const Report = require('../models/Report');
const Chat = require('../models/Chat');
const { checkAuthenticated } = require('../config/auth');

const router = express.Router();

// send admin register page
router.get('/register', (req, res) => {
    if(req.user){
        const empType = req.user.empType;

        if(empType == 'webmaster'){
            res.render('register-admin', { user: req.user, empType });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/');
    }
});

// register admin
router.post('/register', async (req, res) => {
    if(!req.user){
        return res.redirect('/');
    }

    const empType = req.user.empType;

    if(empType != 'webmaster'){
        return res.redirect('/');
    }
    
    const {
        userId,
        fname,
        lname,
        email,
        password,
        contact,
        dob,
        adminType
    } = req.body;

    let errors = [];

    if(!userId || !fname || !lname || !email || !password || !contact || !dob){
        errors.push({ msg: 'Please enter all the details' });
    }

    if(userId.length < 8 || userId.length > 20){
        errors.push({ msg: 'Invalid Employee ID' });
    }

    if(password.length < 8 || password.length > 20){
        errors.push({ msg: 'Password should be between 8 and 20 characters' });
    }

    if(adminType != 'keells' && adminType != 'doa'){
        errors.push({ msg: 'Select a valid admin type' });
    }

    if(errors.length > 0){
        // reload same page if there are errors, send back entered details
        res.render('register-admin', { empType, errors,
            userId,
            fname,
            lname,
            email,
            contact
        });
    } else {
        try{
            // check if employee already exists
            const adminExists = await Admin.findOne({ empId: userId });
            
            // employee id already exists
            if(adminExists){
                errors.push({ msg: 'Employee ID already exists' });
                res.render('register-admin', { user: req.user, empType, errors });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10); // hash password, 10 is number of rounds

                const admin = new Admin({
                    nic: userId,
                    fname,
                    lname,
                    email,
                    password: hashedPassword,
                    contact,
                    dob: new Date(dob),
                    empType: adminType
                });

                const newAdmin = await admin.save(); // add admin to database

                const name = req.user.empId ? req.user.empId : req.user.nic;
                res.render('register-admin', { user: req.user, empType });
            }
        } catch(err) {
            console.log(err);
            errors.push({ msg: 'Internal error, try again later.' });
            res.render('register-admin', { user: req.user, empType, errors });
        }
    }
});

router.get('/dashboard', checkAuthenticated, async (req, res) => {
    const user = req.user;
    
    if(user.empType && user.empType != 'webmaster'){
        try{
            const reports = await Report.find();

            const chats = await Chat.find();
            
            res.render('dashboard', { user, reports: JSON.stringify(reports), chats: JSON.stringify(chats) });
        }catch(err){
            console.log(err);
            res.render('dashboard', { user });
        }
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;