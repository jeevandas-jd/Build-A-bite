var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

const cors=require("cors")
dotenv.config();
// Connect to MongoDB
connectDB();
//loadaing Routes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
//app.use(cors({ origin: "http://localhost:3000" }));
//app.use(cors({ origin: "http://localhost:3001" }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
const authRoutes=require("./routes/auth")
app.use('/api/auth', authRoutes);
const playerRoutes=require('./routes/player')
app.use('/api/player', playerRoutes);
const gameRoutes=require('./routes/game')
app.use('/api/game', gameRoutes);
const productRoutes=require('./routes/product')
app.use('/api/products', productRoutes);
const leaderboardRoutes=require('./routes/leaderboard')
app.use('/api/leaderboard', leaderboardRoutes);
const adminRoutes=require('./routes/admin')
app.use('/api/admin', adminRoutes);
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
