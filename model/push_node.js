var pool = require('./conn_db');

class PushNode {
  static add(name, ip, cb) {
    const sql = `insert into push_node_tbl (name, ip) values('${name}','${ip}')`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static update(name, ip, cb) {
    const sql = `update push_node_tbl set heart_strike=now() where name='${name}'`;
    console.log(sql);
    
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static all(dead_line, cb) {
    const sql = `select id, ip, name, heart_strike, (heart_strike > '${dead_line}') as alive from push_node_tbl order by heart_strile DESC`;
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find_by_name(name, cb) {
    const sql = `select * from push_node_tbl where name='${name}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }
}

module.exports = PushNode;

