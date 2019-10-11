var express = require('express');
var Pushlog = require('../model/push_log');
var jwtAuth = require('../middleware/myauth');
var router = express.Router();

/* GET users listing. */
router.get('/', jwtAuth, function(req, res, next) {
  const user_id = req.user.id;
  const log_id = req.query.id;
  
  if (log_id) {
    Pushlog.find(user_id, log_id, (err, result) => {
      if (err) return next(err);
      if (result.length === 0) {
        res.status(404).send({msg: '找不到对应的日志信息！'});
        return ;
      } else {
        const r = result[0];
        res.send(r);
      }
    });
  } else {
    Pushlog.all(user_id, (err, result) => {
      if (err) next(err);
      res.send(result);
    });
  }
});

router.post('/', (req, res, next) => {
  Pushlog.add(req.body, (err) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

router.get('/page', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const filter = req.query;
  console.log(filter);  
  
  Pushlog.page(user_id, filter, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

router.get('/dayGroup', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  
  Pushlog.groupByDay(user_id, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

router.get('/stateGroup', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  
  Pushlog.groupByState(user_id, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

module.exports = router;