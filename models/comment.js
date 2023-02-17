const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: {type: String, required: true},
  Date: {type: Date},
  content: {type: String, required: true},
});


module.exports = mongoose.model('Comment', CommentSchema);