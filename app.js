const createError = require('http-errors');
const express = require('express');
require("dotenv").config();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('./passport');
const session= require("express-session");

const indexRouter = require('./routes/index');
const usersRouter = require('./components/users');
const classesRouter = require('./components/classes');
// const joinRouter = require('./components/classes/classService');


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
// app.use('/', joinRouter);

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
