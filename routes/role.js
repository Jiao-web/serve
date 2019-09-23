var express = require('express');
var Role = require('../model/role');
var jwtAuth = require('../middleware/myauth');
var AccountRole = require('../model/account_role');

var router = express.Router();

router.get('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const role_id = req.query.id;
  
  if (role_id) {
    Role.find(user_id, role_id, (err, result) => {
      if (err) return next(err);
      if (result.length === 0) {
        res.status(404).send({msg: '找不到对应的角色！'});
        return ;
      } else {
        const r = result[0];
        res.send(r);
      }
    });
  } else {
    Role.all(user_id, (err, result) => {
      if (err) next(err);
      res.send(result);
    });
  }
});

router.post('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const name = req.body.name;
  const description = req.body.description;

  if (name === null || description === null) {
    res.end({msg: '请输入角色名称和描述'}, 400);
    return ;
  }

  Role.add(user_id, name, description, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

router.delete('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const task_id = req.query.id;

  Role.delete(user_id, task_id, (err, result) => {
    if (err) {
      return next(err);
    } else {
      console.log(result);
      res.send({msg: 'ok'});
    }
  });
});

router.get('/page', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const filter = req.query;
  console.log(filter);  
  
  Role.page(user_id, filter, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

router.get('/accounts', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const role_id = req.query.id;

  AccountRole.get_role_accounts(user_id, role_id, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok', data: result});
  });
});

router.post('/update', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const role_id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;

  if (name === null || description === null) {
    res.end({msg: '请输入角色名称和描述'}, 400);
    return ;
  }

  Role.update(user_id, role_id, name, description, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});

  });
});
module.exports = router;