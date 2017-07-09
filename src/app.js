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
      session = require('express-session'),
      FacebookStrategy = require('passport-facebook');

// Mongo session store
const MongoStore = require('connect-mongo')(session);

// Pass configuration method to Passport
require('./config/passport')(passport);

//passport.serializeUser(function (user, done) {
//  // user -> Mongoose model, done is a callback (err,
//  done(null, user._id);
//});
//
//// userId is data stored in the session - done either passes error or the user object
//passport.deserializeUser(function (userId, done) {
//  User.findById(userId, function (err, user) {
//    done(err, user)
//  })
//});

//function generateOrFindUser(accessToken, refreshToken, profile, done) {
//  if(profile.emails[0]) {
//    User.findOneAndUpdate({
//      email: profile.emails[0].value
//    }, {
//      name: profile.displayName || profile.username,
//      email: profile.emails[0].value,
//      photo: profile.photos[0].value
//    }, {
//      upsert: true
//    },
//        done);
//  } else {
//    var noEmailError = new Error('Your email privacy settings prevent you from signing in. Please change privacy settings in your Facebook profile.');
//    done(noEmailError, null);
//  }
//}

const index = require('./routes/index');
const apiRouter = require('./api/router-api');
const authRouter = require('./routes/auth');

const mockData = require('./mock/data.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jade');

// Mongoose - TODO: follow-up: reset deprecated Mongoose promise to the general promise object
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/citychallenge');
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

// Facebook authentication strategy

//passport.use(new FacebookStrategy({
//  clientID: process.env.FACEBOOK_APP_ID,
//  clientSecret: process.env.FACEBOOK_APP_SECRET,
//  callbackURL: "http://localhost:3000/auth/facebook/return",
//  profileFields: ['id', 'displayName', 'photos', 'email']
//}), generateOrFindUser);


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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// logger / Morgan
app.use(logger('dev'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// ROUTERS

app.use('/', index);

// API router
app.use('/api', apiRouter);

// AUTH router
app.use('/auth', authRouter);

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
  res.locals.text = err.text;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
