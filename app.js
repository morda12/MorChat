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
const mongoose = require('mongoose');
const { Server } = require("socket.io");

const routes = require('./routes/index');
const users = require('./routes/users');
const chat = require('./routes/chat');

const moongoseConnectDB = require('./models/db');


// env
PORT = process.env.PORT;

// set view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// set socket.io
const io = new Server(server);

// handle session
sessionMiddleware = session({
  secret: process.env.secret,
  saveUninitialized: true,
  resave: true
});

app.use(sessionMiddleware)

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

// socket.io middleware

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.isAuthenticated()) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

require('./models/io.js')(io);


// pass socket.io to app
app.use((req, res, next) => {
  req.io = io;
  return next();
})

//flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

//
app.get('*', (req, res, next) => {
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