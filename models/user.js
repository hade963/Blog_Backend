const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');
require('dotenv').config();
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
});

module.exports = mongoose.model('User', UserSchema);