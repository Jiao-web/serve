var express = require('express');
var Task = require('../model/task');
var jwtAuth = require('../middleware/myauth');
var router = express.Router();

/* GET users listing. */
router.get('/', [jwtAuth], function(req, res, next) {
  const user_id = req.user.id;
  const task_id = req.query.id;
  
  if (task_id) {
    Task.find(user_id, task_id, (err, result) => {
      if (err) return next(err);
      if (result.length === 0) {
        res.status(404).send({msg: '找不到对应的账号！'});
        return ;
      } else {
        const r = result[0];
        res.send(r);
      }
    });
  } else {
    Task.all(user_id, (err, result) => {
      if (err) next(err);
      res.send(result);
    });
  }
});

router.post('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;

  if (req.body.website_id === null ||
    req.body.role_id === null ||
    req.body.url === null ||
    req.body.title === null ||
    req.body.comment === null) {        // 评论列表   
      res.status(406).send({msg: '参数错误'});
      return ;
    }

  Task.add(user_id, req.body, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

router.delete('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const task_id = req.query.id;

  Task.delete(user_id, task_id, (err, result) => {
    if (err) {
      return next(err);
    }
    console.log(result);
    res.send({msg:'ok'});    
  });
});

router.get('/page', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const filter = req.query;
  console.log(filter);  
  
  Task.page(user_id, filter, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

router.get('/start', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const task_id = req.query.id;

  Task.start(user_id, task_id, (err, result) => {
    if (err) {
      return next(err);
    }
    console.log(result);
    res.send({msg:'ok'});
    
  });
});

router.get('/pause', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const task_id = req.query.id;

  Task.pause(user_id, task_id, (err, result) => {
    if (err) {
      return next(err);
    }
    console.log(result);
    res.send({msg:'ok'});
    
  });
});

module.exports = router;