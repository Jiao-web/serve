var express = require('express');
var Website = require('../model/website');
var jwtAuth = require('../middleware/myauth');

var router = express.Router();

router.get('/', jwtAuth, (req, res, next) => {
  Website.all((err, result) => {
    if (err) return next(err);
    res.status(200).send(result);
  });
});

router.post('/', jwtAuth, (req, res, next) => {
  const name = req.body.name;
  const url = req.body.url;
  if (name === null || url === null) {
    res.status(401).end({msg: '请输入网站名称和链接地址'});
    return ;
  }

  Website.add(name, url, (err, result) => {
    if (err) return next(err);
    res.send({msg: 'ok'});

  });
});

module.exports = router;