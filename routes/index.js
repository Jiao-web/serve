var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/community', (req, res, next) => {
  res.render('../public/assets/graph/graph.html');
});

module.exports = router;
