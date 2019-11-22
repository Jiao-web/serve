var express = require('express');
var PushNode = require('../model/push_node');
var router = express.Router();

function time_strike(name, task_name, ip, cb) {
  PushNode.find_by_name(name, task_name, (err, res) => {
    if (err) return cb(err);
    if (res.length > 0) {
      PushNode.update(name, task_name, ip, (err) => {
        if (err) return cb(err);
        cb(null, res);
      });
    } else {
      PushNode.add(name, task_name, ip, (err, res) => {
        if (err) return cb(err);
        PushNode.find_by_name(name, task_name, (err, res) => {
          if (err) return cb(err);
          cb(null, res);
        });
      });
    }
  });
}

function alive(dead_line, cb) {
  PushNode.all(dead_line, (err, res) => {
    if (err){ 
      return cb(err);
    } else {
      cb(null, res);     
    }    
  });
}

router.post('/', function(req, res, next) {
  const name = req.body.name;
  const task_name = req.body.task_name;
  const ip = req.body.ip;
  
  time_strike(name, task_name, ip, (err, result) => {
    if (err) {
      return next(err);
    } else {
      res.send({msg: 'ok', node: result[0]});
    }
  });
});

router.get('/', (req, res, next) => {  
  const now = new Date();
  const dl = new Date(now.setTime(now.getTime()+8*60*60*1000-60*60*1000));
  
  alive(dl.toISOString(), (err, result) => {
    if (err) {
      console.log(err);
      
      return next(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;