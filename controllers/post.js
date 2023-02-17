const Post = require('../models/post')
const Comment = require('../models/comment');
const Category = require('../models/category');
const util = require('../utality');
const passport = require('passport');
const post = require('../models/post');
const async = require('async');
const User = require('../models/user');

const {body, validationResult} = require('express-validator');

exports.get_posts = (req, res, next) => {
  Post.find({isPublished: true})
  .select({title: 1, content: 1, author: 1, Date: 1,comment: 1, category: 1, like: 1})
  .populate('comment')
  .populate('category')
  .populate('author')
  .exec((err, result)=> { 
    if(err)
      return next(err);
      else {
        res.status(200).json({
          posts: [
            ...result,
          ],
        });
        return;
      };
  });
};

exports.admin_get_posts = [
  passport.authenticate('jwt', {session: false}),

  (req, res, next) => {
  Post.find()
  .populate('category')
  .populate('author')
  .populate('comment')
  .exec((err, result)=> { 
    if(err)
      return next(err);
      else {
        res.status(200).json({
          posts: [
            ...result,
          ],
        });
        return;
      };
  });
}];


exports.get_post = [
  body("id")
  .escape(),
  (req, res, next) => { 
  Post.find({_id: req.params.id, isPublished: true})
  .populate('category')
  .populate('comment')
  .populate('author')
  .exec((err, result)=> {
    if(err) { 
      return next(err);
    }
    else if(!result) { 
      res.status(404).json({ 
        message: 'POST NOT FOUND',
      });
      return;
    }
    else { 
      res.status(200).json({
        post: result[0],
      });
      return;
    };
  });
}];

exports.admin_get_post = [
  passport.authenticate('jwt', {session: false}),
  body("id")
  .escape(),
  (req, res, next) => { 
  Post.find({_id: req.params.id})
  .populate('category')
  .populate('comment')
  .populate('author')
  .exec((err, result)=> {
    if(err) { 
      return next(err);
    }
    else if(!result) { 
      res.status(404).json({ 
        message: 'POST NOT FOUND',
      });
      return;
    }
    else { 
      res.status(200).json({
        post: result[0],
      });
      return;
    };
  });
}];
exports.update_post = [
  passport.authenticate('jwt', {session: false}),

  (req, res, next) => {

    Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      isPublished: req.body.published || false,
      Date: new Date,
      _id: req.params.id,
    },

    (err, result)=> { 
      if(err) { 
        return next(err);
      }
      res.status(201).json({
        message: 'updated successfully',
      });
      return;
    });
  }
];

exports.delete_post = [
  passport.authenticate('jwt', {session: false}),
  body('id')
  .escape()
  .isLength({min: 8}),
  (req, res, next)=> {
    const errors = validationResult(req);
    Post.findByIdAndRemove(req.body.id,(err)=> { 
      if(err) { 
        return next(err);
      }
      res.status(200).json({
        message: "deleted successfully",
      });
      return;
    });
  }
];

exports.create_post = [
  passport.authenticate('jwt', {session: false}),
  body('title')
  .isLength({min: 4})
  .escape(),
  body('content')
  .escape()
  .isLength({min: 8}),
  body('userid')
  .escape()
  .isLength({min: 2}),
  (req, res, next) => {
    async.series({
      author: function(callback) { 
        User.findById(req.body.userid, callback);
      },
  }, 
  (err, results)=> {

    if(err) { 
      return next(err);
    }
    const postdetails = {
      title: req.body.title,
      content: req.body.content,
      author: results.author,
      Date: new Date(),
      comment: [],
      category: [],
      isPublished: false,
    }
    const post = new Post(postdetails);
    post.save((err)=> { 
      if(err) { 
        return next(err);
      }
      else { 
        res.status(201).json({
          msg: 'post has been created ',
        })
      }
    })
  });
}
];

exports.add_category = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next)=> { 
    req.body.cates.forEach((cat) => { 
      Category.findById(cat, (err, result)=> { 
        if(err) { 
          return next(err);
        }
        else if(!result) { 
          res.status(404).json({
            message: 'category not found',
          });
          return;
        }
        else { 
          Post.findById(req.body.post_id, (err, post) => { 
            if(err) { 
              return next(err);
            }
            else if(!post) { 
              res.status(404).json({
                message: 'post not found',
              });
              return;
            }
            else { 
              post.category = [...post.category, result];
              post.save(err=> { 
                if(err) { 
                  return next(err);
                }
                res.status(410).json({
                  message: 'category has been added',
                })
              });
            }
          });
        }
      });
    });
  }
];

exports.update_post_likes = [
  body('id')
    .escape(),
  body('likes')
  .escape(),
  (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty) { 
      res.status(400).json({
        errors: errors,
      });
      return;
    }
    
  Post.findById(req.body.id, (err, result) => { 
    if(err) { 
      return next(err);
    }
    else {
      if(req.body.likes - result.like === 1) { 
        result.like = result.like + 1;
      }
      else if(req.body.likes - result.like === -1 ) {
        result.like = result.like - 1;
      }
      result.save(err => {
        if(err) { 
          return next(err);
        }
        else { 
          res.status(200).json({
            message: 'likes updated',
          })
          return;
        }
      })
    }
    })
}]


