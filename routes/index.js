const express = require('express');

const router = express.Router();

// send home page
router.get('/', (req, res) => {
    res.render('index');
});

// send login page
router.get('/login', (req, res) => {
    res.render('login');
});

// login user
router.post('/login', (req, res) => {
    res.send('hello');
});

// send register page
router.get('/register', (req, res) => {
    res.render('register');
});

// register user
router.post('/register', (req, res) => {
    res.send('register');
});

module.exports = router;