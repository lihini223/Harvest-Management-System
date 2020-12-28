if(process.env.NODE_ENV != 'production'){ // load environment variables in development, this is automatically done by server in production therefore inside if condition
    require('dotenv').config();
}

// bring in necessary packages
const express = require('express'); // web server
const mongoose = require('mongoose'); // database driver for mongodb
const expressLayouts = require('express-ejs-layouts'); // layout package
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

// database connection
const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express(); // initialise web server

const initializePassport = require('./config/passport');
initializePassport(passport);

// bring in url handlers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminsRouter = require('./routes/admins');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// redirect user depending on url
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);

// redirect to page not found
app.use((req, res) => {
    res.render('page-not-found');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));