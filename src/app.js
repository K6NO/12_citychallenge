'use strict';
const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      seeder = require('mongoose-seeder'),
      passport = require('passport'),
      session = require('express-session');


// Mongo session store
const MongoStore = require('connect-mongo')(session);

// Pass configuration method to Passport
require('./config/passport')(passport);

const apiRouter = require('./api/router-api');
const authRouter = require('./routes/auth');

const mockData = require('./mock/data.json');

var app = express();



//mongodb://<dbuser>:<dbpassword>@ds159998.mlab.com:59998/heroku_44hwwvdq
// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citychallenge');
const db = mongoose.connection;

// body-parser and cookie-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Session config for Mongo and Passport

let sessionOptions = {
  secret: 'This is the secret pass phrase',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore ({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

// Initialize passport
app.use(passport.initialize());

// Restores password session (if the user was previously signed in they still will be when returning)
app.use(passport.session());

db.on('error', (err)=> {
  console.log('There was an error with mongoDB ' + err)
});

//Load dummy data when DB opens
db.once('open', ()=> {
  seeder.seed(mockData)
      .then(function (dbData) {
    console.log('DUMMY DATA LOADED... YAY');
  })
      .catch(function (err) {
        console.log('Error when loading dummy data: ' + err);
      });
  console.log('Connection to DB successfull');
});

// logger / Morgan
app.use(logger('dev'));

// static files
app.use('/', express.static('dist'));

// Vendor scripts (angular)
app.get('/vendor/angular.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules', 'angular', 'angular.js'));
});
app.get('/vendor/angular-route.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules', 'angular-route', 'angular-route.js'));
});
app.get('/vendor/angular-resource.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules', 'angular-resource', 'angular-resource.js'));
});
app.get('/vendor/angular-ui-router.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules', '@uirouter', 'angularjs', 'release', 'ui-router-angularjs.min.js'));
});
app.get('/vendor/angular-ui-bootstrap.js', function(req, res) {
  res.sendFile(path.join(__dirname, '../node_modules', 'angular-ui-bootstrap', 'dist', 'ui-bootstrap.js'));
});

// API router
app.use('/api', apiRouter);

// AUTH router
app.use('/auth', authRouter);

// ERROR HANDLERS

app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.text = err.text;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
