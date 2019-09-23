var mysql      = require('mysql');

var pool = mysql.createPool({
  host     : 'www.qiezigan.com',
  user     : 'mailtest',
  password : '2001*&^color',
  database : 'ai_push'
});

module.exports = pool;