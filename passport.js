const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const process = require('process');

require('dotenv').config();

const User = require('./models/user');


  passport.use(new jwtStrategy({
    secretOrKey: process.env.JWT_SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  }, (payload, done)=> {
    User.findOne({email: payload.email, name: payload.name, _id: payload._id}, (err, user)=> { 
      if(err) { 
        return done(err);
      }
      else if(!user) { 
        return done(null, false);
      }
      return done(null, user);
    })
  }));