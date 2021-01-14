if(process.env.NODE_ENV != 'production'){ // load environment variables in development, this is automatically done by server in production therefore inside if condition
    require('dotenv').config();
}

// bring in necessary packages
const http = require('http');
const express = require('express'); // web server
const mongoose = require('mongoose'); // database driver for mongodb
const expressLayouts = require('express-ejs-layouts'); // layout package
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const socketio = require('socket.io');

// database connection
const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const app = express(); // initialise web server

const server = http.createServer(app);

const initializePassport = require('./config/passport');
initializePassport(passport);

// bring in url handlers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminsRouter = require('./routes/admins');
const reportsRouter = require('./routes/reports');

//const store = sessionStore.createSessionStore();

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
app.use('/reports', reportsRouter);

// redirect to page not found
app.use((req, res) => {
    res.render('page-not-found');
});

const User = require('./models/User');
const Admin = require('./models/Admin');
const Chat = require('./models/Chat');

const io = socketio(server);

io.use(async (socket, next) => {
    if(!socket.handshake.query.userId) return next(new Error('No access'));

    let user;

    try{
        if(socket.handshake.query.empType && socket.handshake.query.empType == 'keells'){
            user = await Admin.findById(socket.handshake.query.userId);
        } else {
            user = await User.findById(socket.handshake.query.userId);
        }
        
        if(!user) return next(new Error('Invalid user'));
    } catch(error) {
        console.log(error);
        return next(new Error('Error'));
    }

    return next();
});

io.on('connection', socket => {
    if(socket.handshake.query.empType){
        socket.join('keells-room');
    }
    
    socket.on('message', async (data) => {
        if(socket.handshake.query.empType){
            try{
                const newMessage = {
                    msg: data.msg,
                    date: Date.now(),
                    sender: 'keells'
                };

                const newChat = await Chat.updateOne({ nic: data.to }, { $push: { messages: newMessage } }, { upsert: true });
            } catch(err) {
                console.log(err);
            }

            const adminMessage = {
                msg: data.msg,
                to: data.to
            };

            io.emit('message', adminMessage);
        } else {
            try{
                const newMessage = {
                    msg: data,
                    date: Date.now()
                };

                const newChat = await Chat.updateOne({ nic: socket.handshake.query.nic }, { $push: { messages: newMessage } }, { upsert: true });
            } catch(err) {
                console.log(err);
            }

            const userMessage = {
                userId: socket.handshake.query.nic,
                msg: data
            };

            io.to('keells-room').emit('message', userMessage);
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));