const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');
const User = require('../models/User');
const WebMaster = require('../models/WebMaster');

function initialize(passport){
    const authenticateUser = async (userId, password, done) => {
        try{
            let user;

            if(userId.includes('@webmaster')){
                user = await WebMaster.findOne({ empId: userId });
            } else if(userId.includes('@slharvest')) {
                user = await Admin.findOne({ nic: userId.substring(0, userId.indexOf('@slharvest')) });
            } else {
                user = await User.findOne({ nic: userId });
            }

            if(user == null){
                return done(null, false, { message: 'Invalid credentials' });
            }

            if(userId.includes('@webmaster') && password == user.password){
                if(password == user.password){
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect' });
                }
            }

            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password Incorrect' });
            }
        } catch(error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'userId'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {

        WebMaster.findById(id, (err, webadmin) => {
            if(webadmin){
                return done(err, webadmin);
            }

            Admin.findById(id, (err, admin) => {
                if(admin){
                    return done(err, admin);
                }

                User.findById(id, (err, user) => {
                    return done(err, user);
                });
            })
        })
    });
}

module.exports = initialize;