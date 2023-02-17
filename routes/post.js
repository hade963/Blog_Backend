const express = require('express');
const post = require('../controllers/post');
const router =  express.Router();

router.get('/', post.get_posts);

router.get('/admin', post.admin_get_posts);

router.get('/admin/:id', post.admin_get_post);

router.post('/post', post.create_post);

router.get('/category', post.add_category);

router.post('/category', post.add_category);

router.put('/likes', post.update_post_likes);

router.get('/:id', post.get_post);

router.put('/:id', post.update_post);


router.delete('/:id', post.delete_post);
module.exports = router;