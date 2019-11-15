var pool = require('./conn_db');

class PushNode {
  static add(name, task_name, ip, cb) {
    const sql = `insert into push_node_tbl (name, task_name, ip) values('${name}','${task_name}','${ip}')`;

    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static update(name, task_name, ip, cb) {
    const sql = `update push_node_tbl set heart_strike=now() where name='${name}' and task_name='${task_name}'`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static all(dead_line, cb) {
    const sql = `select id, ip, name, task_name, heart_strike, (heart_strike > '${dead_line}') as alive from push_node_tbl order by heart_strike DESC`;
    console.log(sql);
    
    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find_by_name(name, task_name, cb) {
    const sql = `select * from push_node_tbl where name='${name}' and task_name='${task_name}'`;
    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }
      connection.query(sql, cb);
      connection.release();
    });
  }
}

module.exports = PushNode;

