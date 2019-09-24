var pool = require('./conn_db');

// 数据分析类
class Account {
  static all(user_id, cb) {
    const sql = `SELECT * FROM account_view where user_id = ${user_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static upload(user_id, accounts, cb) {
    let sql = `INSERT INTO account_tbl(user_id, website_id, name, password) VALUES `;
    
    accounts.forEach((element, index) => {
      let value_str = `(
        ${user_id},
        ${element.website},
        '${element.name}',
        '${element.password}'
      )`;
      
      if (index != 0) value_str = ','+value_str;
      sql += value_str;
    });
    
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

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

    const start = (pi-1)*ps;
    let filter_str = `where account_view.user_id=${user_id}`;
    let sorter_str = ''; 

    if (sortKey && sortValue) {
      sorter_str = `order by account_view.${sortKey} ${sortValue}`;
    }  
    if (website_name) {
      filter_str += ` and account_view.website_name = '${website_name}'`;
    }

    const sql1 = `select count(*) as total from account_view ${filter_str};`;
    const sql2 = `SELECT account_view.id, account_view.name, account_view.created_at, 
    account_view.website_name, account_view.state, COUNT(account_role_view.role_id) 
    as role_cnt FROM account_view LEFT JOIN account_role_view ON account_view.id=account_role_view.account_id
    ${filter_str} GROUP BY account_view.id ${sorter_str} limit ${start}, ${ps};`;
    
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

  static add(user_id, website_id, name, password, cb) {
    const sql = `INSERT INTO account_tbl(user_id, website_id, name, 
      password) VALUES (
        ${user_id},
        ${website_id},
        '${name}',
        '${password}')`;
    
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static delete(user_id, account_id, cb) {
    let sql = `delete from account_tbl where id=${account_id} and user_id=${user_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static reset_password(user_id, account_id, password, cb) {
    let sql = `update account_tbl set password='${password}' where 
    user_id=${user_id} and id=${account_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find(user_id, account_id, cb) {
    let sql = `select * from account_tbl where user_id=${user_id} and id=${account_id}`;
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

module.exports = Account;