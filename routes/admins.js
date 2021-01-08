const express = require('express');
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');

const router = express.Router();

// send home page
router.get('/', (req, res) => {
    res.send('Admin');
});

// send admin register page
router.get('/register', (req, res) => {
    if(req.user){
        const empType = req.user.empType;

        if(empType == 'webmaster'){
            res.render('register-admin', { empType: empType });
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
    
    const { userId, password } = req.body;

    let errors = [];

    if(!userId || !password){
        errors.push({ msg: 'Please enter all the details' });
    }

    if(userId.length < 8 || userId.length > 20){
        errors.push({ msg: 'Invalid Employee ID' });
    }

    if(password.length < 8 || password.length > 20){
        errors.push({ msg: 'Password should be between 8 and 20 characters' });
    }

    if(errors.length > 0){
        res.render('register-admin', { empType, errors, userId }); // reload same page if there are errors, send back entered details
    } else {
        try{
            // check if employee already exists
            const adminExists = await Admin.findOne({ empId: userId });
            
            // employee id already exists
            if(adminExists){
                errors.push({ msg: 'Employee ID already exists' });
                res.render('register-admin', { empType, errors });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10); // hash password, 10 is number of rounds

                const admin = new Admin({ empId: userId, password: hashedPassword });

                const newAdmin = await admin.save(); // add admin to database

                res.send('Success');
            }
        } catch(err) {
            console.log(err);
            errors.push({ msg: 'Internal error, try again later.' });
            res.redirect('register-admin', { empType, errors });
        }
    }
});

module.exports = router;