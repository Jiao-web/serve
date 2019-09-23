var jwt = require('jwt-simple');
var User = require('../model/user');

var jwtTokenSecret = '%^&*iuet5437';

module.exports = (req, res, next) => {  
  var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['token'];
  //console.log(req);
  
  if (token) {
    try {
      var decoded = jwt.decode(token, jwtTokenSecret);
      if( decoded.exp <= Date.now()) {
        res.status(401).end({msg: '访问令牌已过期，请重新登录！'});
      }
      
      User.find_by_id(decoded.iss, (err, result) => {
        if (err) {
          return next(err);
        }
        
        if (result.length === 0) {
          console.log('该用户不存在，请联系管理员！');
          
          res.status(401).send({msg: '该用户不存在，请联系管理员！'});
        } else {
          const user = result[0];
          if (user.state === 0) {
            console.log('该账户目前不可用，请联系管理员！');
            res.status(403).send({msg: '该账户目前不可用，请联系管理员！'});
          } else {
            req.user = result[0];
            return next();
          }
        }
      });
    } catch (err) {
      return next(err);
    }
  } else {
    res.status(401).send({msg: "没有传token,请先登录"});
  }
}