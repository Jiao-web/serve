var pool = require('./conn_db');

// 数据分析类
class Website {
  static all(cb) {
    const sql = `SELECT * FROM website_tbl`;

    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static add(name, url, cb) {
    const sql = `INSERT INTO website_tbl(name, home_url) VALUES (
        '${name}',
        '${url}')`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }
}

module.exports = Website;