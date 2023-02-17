const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({ 
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  Date: {type: Date,},
  like: {type: Number, default: 0},
  isPublished: {type: Boolean, default: false},
  comment: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
})

PostSchema.virtual('url').get(function() { 
  return "/" + this._id;
})

module.exports = mongoose.model('Post', PostSchema);