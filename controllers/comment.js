const Comment = require('../models/comment');
const Post = require('../models/post');
const passport = require('passport');
const {body, validationResult} = require('express-validator');

exports.create_comment = [
  body('author')
  .escape(),
  body('content')
  .escape(),
  body('id')
  .escape(),
  (req, res, next) => {
  
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
      res.status(404).json({
        message: 'comment not found',
      });
      return;
    }
  const commentDetails = { 
    author: req.body.author,
    content: req.body.content,
    Date: new Date(),
  }
  Post.findById(req.body.id, (err, post)=> { 
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
      const comment = new Comment(commentDetails)
      comment.save((err) => { 
        if(err) { 
          return next(err);
        }
        
        post.comment = [...post.comment, comment];
        post.save((err)=> { 
          if(err) { 
            return next(err);
          }
          else {
            res.status(201).json({
              message: 'comment has been successfully added',
            });
            return;
          }
        });
      });
    }
  });
}]


exports.update_comment = [
  passport.authenticate('jwt', {session: false}),
  body('comment_id')
    .escape(),

  (req, res, next)=> {

    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
      res.status(404).json({
        message: 'comment not found',
      });
      return;
    }
    Comment.findById(req.body.comment_id, (err, comment)=> { 
      if(err) { 
        return next(err);
      }
      else if(!comment) { 
        res.status(404).json({
          message: 'comment not found',
        });
        return;
      }
      else { 
        comment.content = req.body.content || comment.content;
        comment.author = req.body.author || comment.author;
        comment.save((err)=> { 
          if(err) { 
            return next(err);
          }
          res.status(201).json({
            message: 'comment updated successfully',
          });
          return;
        });
      }
    });
  }
];

exports.delete_comment = [
  passport.authenticate('jwt', {session: false}),
  body('comment_id')
  .escape(),
  body('id')
  .escape(),
  (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
      res.status(404).json({
        message: 'comment not found',
      });
      return;
    }
    Post.findById(req.body.id, (err, post)=> { 
      if(err) {
        return next(err);
      }
      else if(post) { 
        res.status(404).json({
          message: 'NO Matched Comment',
        });
        return;
      }
      post.comment = post.comment.filter(co => co === req.body.id ? false : true);

      post.save((err)=> {
        if(err) { 
          return next(err);
        }
        else { 
          Comment.findByIdAndRemove(req.body.comment_id, (err)=> { 
            if(err) { 
              return next(err);
            }
            else { 
              res.status(410).json({
                message: 'comment has been deleted',
              });
              return;
            }
          });
        }
      });
    });
  }
];