const passport = require('passport');
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');

const { findByIdAndUpdate } = require('../models/user');
require('dotenv').config();


exports.dashboard_login_post = [
  passport.authenticate('jwt',{session: false}),

  (req, res)=> {
    res.status(200).json({
      message: 'welcome admin',
    });
    return;
  }]

exports.get_token = [
  body('email')
  .isEmail()
  .withMessage('this is not a correct email')
  .isLength({min: 2})
  .withMessage('E-mail is too short')
  .escape()
  .normalizeEmail(),
  body('password', 'password didnt match our qualifications')
  .isLength({min: 8})
  .matches(/\d/)
  .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) { 
      res.status(404).json({
        errors: errors,
      });
      return;
    }
    if(req.body.email && req.body.password) {
        User.findOne({email: req.body.email},(err, user)=> {
          if(err) {
            return next(err);
          }
          else if(!user) { 
            res.status(404).json({
              message: 'page not found',
            });
            return;
          } 
          else { 
            bcrypt.compare(req.body.password, user.password, (err, success) => {
              if(err) { 
                return next(err);
              }
              else if(success) { 
                const token = jwt.sign({name: user.name, email: user.email, _id: user._id}, process.env.JWT_SECRET_KEY,{expiresIn: 60*60*60});
                res.status(201).json({
                  token: token
                });
                return;
              }
              else {
                res.status(404).json({
                  message: 'page not found',
                })
                return;
              }
            });
          }
        });
      }
    }
];


exports.get_posts = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    Post.find()
    .exec((err, result)=> { 
      if(err)
        return next(err);
      else
        res.status(200).json({
          posts: result,
        });
        return;
    })
  }
];

exports.get_user = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => { 
    User.findOne({name: 'hade allila'}, (err, user) => { 
      if(err) { 
        return next(err);
      }
      else if(!user) { 
        return res.status(404).json({
          msg: 'user not found',
        });
        return;
      }
      else { 
        res.status(200).json({
          user_id: user._id,
        })
      }
    })
  }
]


