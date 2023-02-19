const Post = require('./models/post');
const User = require('./models/user');
const async = require('async');
const Category = require('./models/category');
const Comment = require('./models/comment');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const process = require('process');
require('dotenv').config();


mongoose.connect('mongodb://127.0.0.1/blogdb');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connnection erorr'));

let myuser;

const categorys = [];

const comments = [];



const CreateUser = (name, email, password, cb) => { 
  const userDetails = {
    name: name,
    email: email,
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if(err) { 
      console.log(err);
      cb(err);
    }
    else { 
      userDetails.password = hash;


      const user = new User(userDetails);
      user.save((err) => { 
        if(err) {
          console.log(err);
          cb(err);
        }
        else { 
          myuser = user;
          cb(null, user);
        }
      })
    }
  });
}


const CreateComment = (author, content, cb) => {
  const commentDetails = { 
    author, 
    content,
    Date: new Date(),
  }

  const comment = new Comment(commentDetails);
  comment.save((err) => { 
    if(err) {
      cb(err, null);
    }
    else { 
      comments.push(comment);
      cb(null, comment);
    }
  })
}

const CreateCategory = (name, cb) => {
  const category = new Category({name});
  category.save(err => { 
    if(err) { 
      return cb(err, null);
    }

    else { 
      categorys.push(category);
      cb(null, category);
    }
  })
}


const createPost = (title, content, author, like, isPublished, comment, category, cb) => {
  const postDetails = { 
    title: title,
    content: content,
    author: author,
    Date: new Date(),
    like: like,
    isPublished,
    comment: comment,
    category: category,
  };

  const post = new Post(postDetails);
  post.save(err => { 
    if(err) { 
      cb(err, null);
    }
    else { 
    console.log("post created");
    cb(null, post);
    }
  })
};

function createCategories(cb) { 
  async.parallel([
    function(callback) { 
      CreateCategory('programming', callback);
    },
    function(callback) { 
      CreateCategory('health', callback);
    },
    function(callback) { 
      CreateCategory('care', callback);
    },
    function(callback) { 
      CreateCategory('sport', callback);
    },
    function(callback) { 
      CreateCategory('ecommeric', callback);
    },
    function(callback) { 
      CreateUser('hade allila', 'darkusfr332@gmail.com', 'darkhade9631', callback);
    }
  ], cb);
}

function CreateComments(cb) {
  async.parallel([
    function(callback) { 
      CreateComment("ljlj", 'this content is for test', callback);
    },
    function(callback) { 
      CreateComment("daljf", 'this content is for test 2', callback);
    },
    function(callback) { 
      CreateComment("d;q;k", 'this content is for test 3', callback);
    },
    function(callback) { 
      CreateComment(";k141", 'this content is for test 4', callback);
    },
    function(callback) { 
      CreateComment(";kda1 4dlajf", 'this content is for test 5', callback);
    },
  ], cb);
}

function CreatePosts(cb) {
  async.parallel([
    function(callback) { 
      createPost('test post 1', 'this post is for test to make sure every thing is working', myuser, 10, true, [...comments], categorys[0], callback);
    },
    function(callback) { 
      createPost('test post 1', 'this post is for test to make sure every thing is working', myuser, 5, true, [comments[3], comments[2]], [categorys[1]], callback);
    },
    function(callback) { 
      createPost('test post 1', 'this post is for test to make sure every thing is working', myuser, 1, true, [comments[0], comments[1]], [categorys[0]], callback);
    },
    function(callback) { 
      createPost('test post 1', 'this post is for test to make sure every thing is working', myuser, 200, true, [comments[0], comments[1]], [categorys[0]], callback);
    },
    function(callback) { 
      createPost('test post 1', 'this post is for test to make sure every thing is working', myuser, 13, true, [comments[4], comments[3]], [categorys[3]], callback);
    }
  ], cb);
}


async.series([
  createCategories,
  CreateComments,
  CreatePosts,
], (err, results)=> { 
  if(err) { 
    console.log(err);
  }
  else { 
    console.log(comments, categorys);
    mongoose.connection.close();
  }
});
/*
Post 
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  Date: {type: Date,},
  like: {type: Number, default: 0},
  isPublished: {type: Boolean, default: false},
  comment: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  category: [{type: Schema.Types.ObjectId, ref: 'Category'}],



  User
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},

  comment
  author: {type: String, required: true},
  Date: {type: Date},
  content: {type: String, required: true},

  Category
  name
});

*/