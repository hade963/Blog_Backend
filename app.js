const express =  require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const passport = require('passport');
const cros = require('cors');
require('.env').config();

// mongo db istablish connnection
mongoose.connect(process.env.db_connection);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'failed to make connection with mongodb'))

const app = express();

// use bodyparser to decode request information
app.use(cros());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require('./passport');

//import routers
const index = require('./routes/index');
const post = require('./routes/post');
const user = require('./routes/user');
const category = require('./routes/category');
const comment = require('./routes/comment');
//use routers
app.use('/', index);
app.use('/posts', post);
app.use('/user', user);
app.use('/category', category);
app.use('/comments', comment);


app.listen(8000, console.log('server is running on http://localhost:3000'));