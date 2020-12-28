const express = require('express');
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');

const router = express.Router();

// send home page
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/dashboard', checkAuthenticated, (req, res) => {
    const name = req.user.empId ? req.user.empId : req.user.nic;
    res.render('dashboard', { name });
});

router.delete('/logout', (req, res) => {
    req.logout(); // clear session variables
    res.redirect('/users/login');
});

module.exports = router;