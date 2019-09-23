var pool = require('./conn_db');

class AccountRole {
  static all(user_id, cb) {
    const sql = `SELECT * FROM account_role_view where user_id = ${user_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static add(account_id, role_id, cb) {
    const sql = `insert into account_role_tbl(account_id, role_id) values(
      ${account_id},
      ${role_id}
    )`;

    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(sql, cb);
      connection.release();
    });
  }

  static delete(ar_id, cb) {
    let sql = `delete from account_role_tbl where id=${ar_id}`;
    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static get_account_roles(user_id, account_id, cb) {
    const sql = `select account_role_view.account_id, account_role_view.account_name, role_tbl.id, role_tbl.name 
    FROM account_role_view right join role_tbl on 
    role_tbl.id=account_role_view.role_id 
    AND account_role_view.account_id = ${account_id} WHERE 
    role_tbl.user_id=${user_id}`;
    //const sql = `select role_id as id, role_name as name from account_role_view where account_id=${account_id} and user_id=${user_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        cb(err);
        return ;
      }
      connection.query(sql, cb);
      connection.release();
    });
  }

  static get_role_accounts(user_id, role_id, cb) {
    const sql = `select account_id as id, account_name as name from account_role_view where role_id=${role_id} and user_id=${user_id}`;

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
module.exports = AccountRole;