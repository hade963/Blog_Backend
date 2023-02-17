const Category = require('../models/category');
const passport = require('passport');
const Post = require('../models/post');



exports.create_category = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next)=> { 
    new Category({name: req.body.name})
    .save((err)=> {
      if(err) { 
        return next(err);
      }
      else { 
        res.status(201).json({
          message: 'category has been added successfully',
        });
        return;
      }
    });
  }
];

exports.get_categories = (req, res, next) => { 
  Category.find({}, (err, result) => { 
    if(err) { 
      return next(err);
    }
    else if(!result) { 
      res.status(404).json({
        message: 'no categories to show',
      });
      return;
    }
    else { 
      res.status(200).json({
        message: 'categories',
        categoies: [...result],
      });
      return;
    }
  });
};


exports.delete_category = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    Post.find({category: req.body.id}, (err, result)=> { 
      if(err) { 
        return next(err);
      }
        else if(!result) {
          Category.findByIdAndRemove(req.body.id, (err)=> { 

            if(err) { 
              return next(err);
            }

            else { 
              res.status(410).json({
                message: 'category has been deleted',
              });
              return;
            }
          });
        }

      else { 
        
        result.forEach(post => { 
          post.category.filter(cat => cat === req.body.id ? false : true);
          post.save((err)=> {
            if(err) { 
              return next(err);
            }
          });
        });
        Category.findByIdAndRemove(req.body.id, (err)=> { 
          if(err) { 
            return next(err);
          }
          else { 
            res.status(410).json({
              message: 'category has been deleted',
            });
            return;
          }
        });
      }
    });
  }
];
