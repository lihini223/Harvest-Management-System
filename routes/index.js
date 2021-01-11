const express = require('express');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const router = express.Router();

// send home page
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/dashboard', checkAuthenticated, (req, res) => {
    if(req.user.empType){
        const empType = req.user.empType;
        if(empType == 'webmaster') res.redirect('/admins/register');
        else if(empType == 'keells' || empType == 'doa') res.redirect('/admins/dashboard');
        else res.redirect('/');
    }
    else{
        res.redirect('/users/dashboard');
    }
    //res.render('dashboard', { name, empType: req.user.empType, userId: req.user._id });
});

router.delete('/logout', (req, res) => {
    req.logout(); // clear session variables
    res.redirect('/users/login');
});

module.exports = router;