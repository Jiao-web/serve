var express = require('express');
var Account = require('../model/account');
var AccountRole = require('../model/account_role');
var jwtAuth = require('../middleware/myauth');

var router = express.Router();

router.get('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  Account.all(user_id, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

// 
router.post('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const name = req.body.name;
  const website_id = req.body.website_id;
  const password = req.body.password;

  if (name === null || website_id === null || password === null) {
    res.end({msg: '请输入账号名称、密码和网站'}, 400);
    return ;
  }

  Account.add(user_id, website_id, name, password, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

router.delete('/', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const account_id = req.query.id;

  if (account_id === null) {
    res.end({msg: '请输入账号编号'}, 400);
    return ;
  }

  Account.delete(user_id, account_id, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

router.get('/page', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const filter = req.query;
  
  Account.page(user_id, filter, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

router.get('/roles', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const account_id = req.query.id;

  AccountRole.get_account_roles(user_id, account_id, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

router.post('/reset_password', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  const account_id = req.body.id;
  const password = req.body.password;

  if (account_id === null || password === null) {
    res.end({msg: '请确认密码已经输入'}, 400);
    return ;
  }

  Account.reset_password(user_id, account_id, password, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});
  });
});

module.exports = router;