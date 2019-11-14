var pool = require('./conn_db');

class PushNode {
  static add(name, ip, cb) {
    const sql = `insert into crawl_node_tbl (name, ip) values(
      '${name}',
      '${ip}',
    )`

    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static strike(node_id, cb) {
    const sql = `update crawl_node_tbl set heart_strike=CURRENT_TIMESTAMP where id=${node_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        return cb(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  // 统计半小时内的活跃节点
  static alive(time_interval, cb) {
    const sql = `select * from crawl_node_tbl where heart_strike > date_add(now(),interval ${time_interval} second)`;
  
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