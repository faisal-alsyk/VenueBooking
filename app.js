const express = require('express'),
  dotenv = require('dotenv'),
  logger = require('morgan'),
  users = require('./app/users/routes'),
  admin = require('./app/admins/routes'),
  venues = require('./app/venues/routes'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bodyParser = require('body-parser'),
  mongoose = require('./configuration/database'), //database configuration
//   swaggerUi = require('swagger-ui-express'),
//   swaggerDocument = require('./swagger.json'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  User = require('./app/users/model');

dotenv.config();

const app = express();
// app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
var whitelist = ['http://localhost:8080', 'http://localhost:3000'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS ${origin}`));
    }
  }
}
if (process.env['NODE_ENV'] === 'production') {
  app.options('*', cors());
  app.use(cors());
}


// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(bodyParser.json());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try{
    let isMatch = false;
    let user = await User.findOne({ email: email });
    if (!user) {
      return done({ message: 'Incorrect email.' }, false);
    }
    isMatch = await user.comparePassword(password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done({ message: 'Incorrect Password.' }, false);
    }
  }
  catch(e){
    return done(e);
  }
  
  }));

app.use(passport.initialize());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//Public Route
app.use('/api/users', users);
app.use('api/admin', admin);
app.use('api/venues', venues);

app.use(function (err, req, res, next) {
  if(err.message){
    res.status(404).json({ status: "Error", message: err.message});
  }
  if (err.status === 404)
    res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({ message: "Something looks wrong :( !!!"});
});
app.listen(process.env.PORT || 4200, function () {
  console.log('Node server listening on port 4200');
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
