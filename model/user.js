var pool = require('./conn_db');
var bcrypt = require('bcryptjs');

class User {
  static hashPassword(pwd) {
    var salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(pwd, salt);
  }

  static checkPassword(pwd, hash) {
    return bcrypt.compareSync(pwd, hash);
  }

  static login(name, pwd, cb) {
    let sql = `select * from user_tbl where name='${name}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, (err, result) => {
        if (result.length === 0) {
          cb(Error('找不到该用户！'));
        } else {
          const u = result[0];
          if (this.checkPassword(pwd, u.password)) {
            cb(null, result);
          } else {
            cb(Error('密码不正确！'));
          }
        }
      });
      connection.release();
    });
  }

  static add(name, pwd, email, cb) {
    const hash_pwd = this.hashPassword(pwd);
    let sql = `insert into user_tbl(name, password, email)
    values('${name}', '${hash_pwd}', '${email}')`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.message.indexOf('Duplicate') > 0) {
          cb(Error('该用户已存在！'));
        } else {
          cb(err);        
        }
      } else {
        connection.query(sql, cb);
      }
      connection.release();
    });
  }

  static delete(id, cb) {
    let sql = `delete from user_tbl where id=${id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static all(cb) {
    let sql = `select * from user_tbl`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find_by_id(id, cb) {
    let sql = `select id, name, email, state, type, created_at from user_tbl where id=${id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find_by_name(name, cb) {
    let sql = `select id, name, email, state, type, created_at from user_tbl where name=${name}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }
}

module.exports = User;