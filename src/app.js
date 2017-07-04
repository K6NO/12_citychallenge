const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');


var index = require('./routes/index');
var apiRouter = require('./api/router-api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

// Mongoose - TODO: follow-up: reset deprecated Mongoose promise to the general promise object
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/citychallenge');
const db = mongoose.connection;

db.on('error', (err)=> {
  console.log('There was an error with mongoDB ' + err)
});

//once only fires the event when it's first happening
db.once('open', ()=> {
  console.log('Connection to DB successfull');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logger / Morgan
app.use(logger('dev'));

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// API router
app.use('/api', apiRouter);

// ERROR HANDLERS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
