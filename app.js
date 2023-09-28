const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { Server } = require("socket.io");
const routers = require('./routers/index');
const users = require('./routers/users');
const chat = require('./routers/chat');
const moongoseConnectDB = require('./models/db');
const {ioHandler , ioAuthorization} = require('./models/io.js')
const {initPassport} = require('./utils/passport')

//setup express app
const app = express();
const server = http.createServer(app);

// env
dotenv.config();
const { PORT, SECRET_KEY } = process.env;

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
  secret: SECRET_KEY,
  saveUninitialized: true,
  resave: true
});

app.use(sessionMiddleware)

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
initPassport();

// socket.io middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use(ioAuthorization);

ioHandler(io)


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
moongoseConnectDB();

// start listening
server.listen(PORT, () => {
  console.log(`listen on port : ${PORT}`);
});

// route
app.use('/', routers);
app.use('/users', users);
app.use('/chat', chat);