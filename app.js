const createError = require('http-errors');
const express = require('express');
require("dotenv").config();
const url=require('url');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('./passport');
const session= require("express-session");

const indexRouter = require('./routes/index');
const usersRouter = require('./components/users');
const classesRouter = require('./components/classes');
const gradeRouter = require('./components/grade');
const NotiRouter = require('./components/notifications');
const ReviewRouter=require('./components/review');


const app = express();

require('./dal/db');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:  process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next){
  res.locals.user=req.user;
  next();
});

app.use('/', indexRouter);
app.use('/classes', passport.authenticate('jwt', {session: false}), classesRouter);
app.use('/grade', passport.authenticate('jwt', {session: false}),gradeRouter);
app.use('/notification', passport.authenticate('jwt', {session: false}),NotiRouter);
app.use('/review', passport.authenticate('jwt', {session: false}),ReviewRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
