const express = require('express');
const comment = require('../controllers/comment');

const router = express.Router();


router.post('/:id/comment', comment.create_comment);

router.delete('/:id/:comment_id', comment.delete_comment);

router.put('/:comment_id', comment.update_comment);


module.exports = router;