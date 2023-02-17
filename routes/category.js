const express = require('express');
const router = express.Router();

const category = require('../controllers/category');


router.get('/', category.get_categories);

router.post('/', category.create_category);

router.delete('/', category.delete_category);

module.exports = router;