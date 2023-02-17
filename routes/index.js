const express = require('express');

const router =  express.Router();

router.get('/', (req, res)=> { 
  res.status(200).json({message: 'hello world'});
});

router.get('/index', (req, res)=> { 
  res.redirect('/');
});

module.exports = router;