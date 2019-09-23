var express = require('express');
var AccountRole = require('../model/account_role');
var jwtAuth = require('../middleware/myauth');

var router = express.Router();

router.post('/', jwtAuth, (req, res, next) => {
  const account_id = req.body.account_id;
  const role_id = req.body.role_id;
  AccountRole.add(account_id, role_id, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok', data: result});
  });
});

router.delete('/', jwtAuth, (req, res, next) => {
  const ar_id = req.query.id;

  AccountRole.delete(ar_id, (err, result) => {
    if (err) {
      return next(err);
    } else {
      res.send({msg: 'ok'});
    }
  });
});
module.exports = router;