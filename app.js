
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { query, validationResult , ExpressValidator, body } = require('express-validator');
const mongoose = require('mongoose');
const { Server } = require("socket.io");

// const server = http.createServer(app); // TBD
// const { Server } = require("socket.io"); // TBD
// const io = new Server(server); // TBD
// const ejs = require('ejs'); // TBD
// const {MongoClient} = require('mongodb') // TBD

const routes = require('./routes/index');
const users = require('./routes/users');
const chat = require('./routes/chat');

const moongoseConnectDB = require('./models/db');


// env
PORT = process.env.PORT;

// set view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// set io
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected to chat');

  socket.on('disconnect', () => {
    console.log('user disconnected');

    socket.on('send message'), (conversation, message) => {
      i0.socket.emit('new message', {
        conversation: conversation,
        message: message
      });
    }
  });
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.json());

// handle session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));


//flash
app.use(flash());
app.use((req, res, next) =>{
  res.locals.message = req.flash();
  next();
});

//
app.get('*', (req, res, next) => {
  // console.log(req.user)
  res.locals.user = req.user || null;
  next();
})

//db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/?retryWrites=true&w=majority`;
moongoseConnectDB(uri);

// start listening
server.listen(PORT, () => {
  console.log(`listen on port : ${PORT}`);
  });

// route
app.use('/', routes);
app.use('/users', users);
app.use('/chat', chat);