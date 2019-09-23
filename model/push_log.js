var pool = require('./conn_db');

class PushLog {
  static page(user_id, filter, cb) {
    const pi = filter.pi;
    const ps = filter.ps;
    const sortKey = filter.sortKey;
    const sortValue = filter.sortValue;
    const account_name = filter.account_name;
    const website_name = filter.website_name;
    const result = filter.result;
    const date_start = filter.date_start;
    const date_end = filter.date_end;

    const start = (pi-1)*ps;
    let filter_str = `where user_id=${user_id}`;
    let sorter_str = '';

    try {
      if (account_name) {
        filter_str += ` account_name='${account_name}'`;
      }
  
      if (website_name) {
        filter_str += ` website_name='${website_name}'`
      }

      if (result) {
        filter_str += ` result=${result}`
      }
  
      if (date_start && date_end) {
        filter_str += ` finished_at>'${date_start}' and finished_at<'${date_end}'`;
      }
  
      if (sortKey && sortValue) {
        sorter_str = `order by ${sortKey} ${sortValue}`;
      }
    } catch (error) {
      console.log(error.message);  
      cb(error);    
    }

    const sql1 = `select count(*) as total from push_log_view ${filter_str};`;
    const sql2 = `SELECT * FROM push_log_view ${filter_str} ${sorter_str} limit ${start}, ${ps};`;
    
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
    });
  }

  static add(data, cb) {
    const push_node_id = data.push_node_id;
    const account_id = data.account_id;
    const task_id = data.task_id;
    const result = data.result;
    const remark = data.remark;

    const sql = `insert into push_log_tbl (push_node_id, account_id, task_id, result, remark) values(
      ${push_node_id},
      ${account_id},
      ${task_id},
      ${result},
      '${remark}',
    )`

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }
}

module.exports = PushLog;