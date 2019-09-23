var express = require('express');
var jwtAuth = require('../middleware/myauth');
var Article = require('../model/article');

var router = express.Router();

// ?id=xxxx
router.get('/', jwtAuth, function(req, res, next) {
  const article_id = req.query.id;
  if (article_id) {
    Article.find(article_id, (error, results) => {
      if (error) throw error;
      res.send(results[0]);
    });
  } else {
    Article.all((error, results) => {
      if (error) throw error;
      res.send(results);
    });
  }
});

router.get('/page', jwtAuth, function(req, res, next) {
  const filter = req.query;
  
  Article.page(filter, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


module.exports = router;