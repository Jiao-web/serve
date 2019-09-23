var express = require('express');
var User = require('../model/user');
var jwt = require('jwt-simple');
var jwtAuth = require('../middleware/myauth');
var adminCheck = require('../middleware/adminCheck');
var moment = require('moment');
var userConfig = require('../model/config');
var router = express.Router();

var jwtTokenSecret = '%^&*iuet5437';

/* GET users listing. */
router.get('/', jwtAuth, function(req, res, next) {
  res.send({msg: 'ok', user: req.user});
});

router.delete('/', [jwtAuth, adminCheck], (req, res, next) => {
  const user_id = req.query.id;
  User.delete(user_id, (err, result) => {
    if (err) {
      return next(err);
    } else {
      console.log(result);
      res.send({msg: 'ok'});
    }
  });
});

router.post('/login', (req, res, next) => {
  const data = req.body;
  var name;
  var pwd;
  if (data.userName && data.password) {
    name = data.userName;
    pwd = data.password;
  } else {
    res.status(400).send({msg: '请输入用户名和密码！'});
    return ;
  }
  

  User.login(name, pwd, (err, result) => {
    if (err) {
      res.send({msg: err.message});
      return ;
    }

    const u = result[0];
    if (u.state === 0) {
      res.status(403).send({msg: '该账户目前不可用，请联系管理员！'});
      return ;
    }
    const expires = moment().add(7, 'days').valueOf();
    const token = jwt.encode({
      iss: u.id,
      exp: expires,
    }, jwtTokenSecret);
    console.log(u);    

    res.send({
      msg: 'ok',
      user: {
        token: token,
        name: u.name,
        email: u.email,
        id: u.id,
        time: +new Date(),
      },
    });
  });
});

router.post('/register', (req, res, next) => {
  const data = req.body;  

  User.add(data.name, data.password, data.email, (err, result) => {
    if (err) {
      return next(err);
    }
    res.send({msg: 'ok'});
  });
});

router.get('/config', jwtAuth, (req, res, next) => {
  const user_id = req.user.id;
  
  User.find_by_id(user_id, (err, result) => {
    if (err) {
      res.status(401).send({nsg: err.message});
      return ;
    };
    if (result.length === 0) {
      res.status(404).end({msg: '找不到相应用户'});
      return ;
    }
    const u = result[0];
    let cfg = userConfig[u.type];
    cfg.user.name = u.name;
    cfg.user.email = u.email;
    
    res.json(cfg);
  });
});


module.exports = router;