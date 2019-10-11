var pool = require('./conn_db');

// 数据分析类
class Task {
  static all(user_id, cb) {
    const sql = `SELECT * FROM task_tbl WHERE user_id=${user_id}`;

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
    const website_name = filter.website_name;
    const role_name = filter.role_name;
    const state = filter.state;
    const date_start = filter.date_start;
    const date_end = filter.date_end;

    const start = (pi-1)*ps;
    let filter_str = `where state != 2 and user_id=${user_id}`;
    let sorter_str = '';

    try {
      if (role_name) {
        filter_str += ` and role_name='${role_name}'`;
      }
  
      if (website_name) {
        filter_str += ` and website_name='${website_name}'`
      }

      if (state) {
        filter_str += ` and result=${state}`
      }
  
      if (date_start && date_end) {
        filter_str += ` and created_at>'${date_start}' and created_at<'${date_end}'`;
      }
  
      if (sortKey && sortValue) {
        sorter_str = `order by ${sortKey} ${sortValue}`;
      } else {
        sorter_str = `order by created_at DESC`;
      }
    } catch (error) {
      console.log(error.message);  
      cb(error);    
    }

    const sql1 = `select count(*) as total from task_view ${filter_str};`;
    const sql2 = `SELECT * FROM task_view ${filter_str} ${sorter_str} limit ${start}, ${ps};`;
    
    console.log(sql2);
    
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

  static find(user_id, id, cb) {
    const sql = `SELECT * FROM task_tbl WHERE user_id=${user_id} and id=${id}`;
    pool.getConnection((err, connection) => {
      connection.query(sql, cb);
      connection.release();
    });
  }

  static add(user_id, data, cb) {
    console.log(data);
    const website_id = data['website_id'];
    const url = data['url'];
    const title = data['title'];
    const role_id = data['role_id'];
    const comments = data.comment;
    let additional_param1 = '';
    let additional_param2 = '';
    if (data.additional_param1) {
      additional_param1 = data.additional_param1;
    }
    if (data.additional_param2) {
      additional_param2 = data.additional_param2;
    }
    
    let sql = `INSERT INTO task_tbl(user_id, website_id, role_id, url, title, comment, additional_param1, additional_param2) VALUES `;
    
    comments.forEach((element, index) => {
      let value_str = `(
        ${user_id},
        ${website_id},
        ${role_id},
        '${url}',
        '${title}',
        '${element}',
        '${additional_param1}',
        '${additional_param2}'
      )`;
      console.log(value_str);
      
      if (index != 0) value_str = ','+value_str;
      sql += value_str;
    });
    console.log(sql);
    
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static delete(user_id, task_id, cb) {
    let sql = `delete from task_tbl where id=${task_id} and user_id=${user_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static changeTaskState(user_id, task_id, old_state, new_state, cb) {
    let sql = `update task_tbl set state=${new_state} where id=${task_id} and user_id=${user_id} and state=${old_state}`;
    console.log(sql);
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static getAccount(user_id, role_id, website_id, cb) {
    const sql = `SELECT account_id as id, account_name as name, account_pwd as password FROM account_role_view where user_id=${user_id} and role_id=${role_id} and website_id = ${website_id} ORDER BY RAND() LIMIT 1`;
    console.log(sql);
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
    });
  }

  // 随机获取一条任务
  static fetchTaskRand(website_id, cb) {
    const sql = `SELECT * FROM task_view where website_id=${website_id} and state = 1 ORDER BY RAND() LIMIT 1`;
    console.log(sql);
    
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, (err, result) => {
        if (err) {
          cb(err);
          return ;
        }
        if (result.length === 0) {
          return cb(null, {msg: 'no task'});
        } else {
          const curTask = result[0];
          Task.getAccount(curTask.user_id,
            curTask.role_id,
            curTask.website_id,
            (err, res2) => {
              if (err) return cb(err);
              if (res2.length === 0) {
                return cb(null, {msg: 'no account', task: curTask});
              } else {
                Task.changeTaskState(curTask.user_id, curTask.id, 1, 2, (err, res) => {
                  if (err) {
                    return cb(err);
                  }
                  return cb(null, {msg: 'ok',task: curTask,account: res2[0]});
                });
              }
            });
        }
      });
      connection.release();
    });
  }
}

module.exports = Task;