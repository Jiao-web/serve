var pool = require('./conn_db');

class PushLog {
  static all(user_id, cb) {
    const sql = `SELECT * FROM push_log_view WHERE user_id=${user_id}`;

    pool.getConnection((err, connection) => {
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find(user_id, id, cb) {
    const sql = `SELECT * FROM push_log_view WHERE user_id=${user_id} and id=${id}`;
    pool.getConnection((err, connection) => {
      connection.query(sql, cb);
      connection.release();
    });
  }

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
        filter_str += ` and account_name='${account_name}'`;
      }
  
      if (website_name) {
        filter_str += ` and website_name='${website_name}'`
      }

      if (result) {
        filter_str += ` and result=${result}`
      }
  
      if (date_start && date_end) {
        filter_str += ` and finished_at>'${date_start}' and finished_at<'${date_end}'`;
      }
  
      if (sortKey && sortValue) {
        sorter_str = `order by ${sortKey} ${sortValue}`;
      } else {
        sorter_str = `order by finished_at DESC`;
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
      '${remark}'
    )`;
    console.log(sql);
    

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static groupByDay(user_id, cb) {
    const sql = `select date(a.click_date) as x,ifnull(b.count,0) as y from (
      SELECT date_sub(curdate(), interval 6 day) as click_date union all 
      SELECT date_sub(curdate(), interval 5 day) as click_date union all 
      SELECT date_sub(curdate(), interval 4 day) as click_date union all 
      SELECT date_sub(curdate(), interval 3 day) as click_date union all 
      SELECT date_sub(curdate(), interval 2 day) as click_date union all 
      SELECT date_sub(curdate(), interval 1 day) as click_date union all 
      SELECT curdate() as click_date ) a left join (
        select date(finished_at) as datetime, count(*) as count from push_log_view 
        where user_id=${user_id} group by datetime ) b on a.click_date = b.datetime`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static groupByState(user_id, cb) {
    const sql = `SELECT result, COUNT(*) as count FROM push_log_view WHERE DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(finished_at) and user_id=${user_id} GROUP BY result`;
  
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