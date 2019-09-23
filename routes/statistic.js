var express = require('express');
var Statistic = require('../model/statistic');
var jwtAuth = require('../middleware/myauth');
var router = express.Router();

/* GET users listing. */
router.get('/', [jwtAuth], function(req, res, next) {
  const user_id = req.user.id;

  Statistic.data(user_id, (err, result) => {
    res.send(result);
  });
});


module.exports = router;