const express = require('express');
const router = express.Router();
const user = require('../controllers/user');




router.post('/dashboard', user.dashboard_login_post);


router.post('/token', user.get_token);

router.post('/id', user.get_user);

module.exports = router;