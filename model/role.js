var pool = require('./conn_db');

// 数据分析类
class Role {
  static all(user_id, cb) {
    const sql = `SELECT * FROM role_tbl where user_id = ${user_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static add(user_id, name, description, cb) {
    const sql = `INSERT INTO role_tbl(user_id, name, description) VALUES (
        ${user_id},
        '${name}',
        '${description}')`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static delete(user_id, role_id, cb) {
    let sql = `delete from role_tbl where id=${role_id} and user_id=${user_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static update(user_id, role_id, name, description, cb) {
    let sql = `update role_tbl set name='${name}', 
    description='${description}' where user_id=${user_id} and id=${role_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find(user_id, role_id, cb) {
    let sql = `select * from role_tbl where user_id=${user_id} and id=${role_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      console.log(sql);
      
      connection.query(sql, cb);
      connection.release();
    });
  }

  static page(user_id, filter, cb) {
    const pi = filter.pi;
    const ps = filter.ps;
    const sortKey = filter.sortKey;
    const sortValue = filter.sortValue;

    const start = (pi-1)*ps;
    let filter_str = `where user_id=${user_id}`;
    let sorter_str = ''; 

    if (sortKey && sortValue) {
      sorter_str = `order by ${sortKey} ${sortValue}`;
    }

    const sql1 = `select count(*) as total from role_tbl ${filter_str};`;
    const sql2 = `SELECT * FROM role_tbl ${filter_str} ${sorter_str} limit ${start}, ${ps};`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        log(err.message);
        return cb(err);
      }
      connection.query(sql1, (err, data) => {
        if (err) return cb(err);
        const total = data[0].total;
        pool.getConnection((err, conn) => {
          if (err) return cb(err);
          conn.query(sql2, (err, result) => {
            if (err) return cb(err);
            cb(null, {total, list: result});
          });
          conn.release();
        });
      });
      connection.release();
    })
  }
}

module.exports = Role;