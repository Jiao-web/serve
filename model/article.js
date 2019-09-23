var mysql      = require('mysql');

var pool = mysql.createPool({
  host     : '10.10.10.51',
  user     : 'team1',
  password : '2001colorful',
  database : 'content_generate'
});

class Article {
  static all(cb) {
    let sql = `SELECT * from eyny_tbl`;
    pool.getConnection(function(err, connection){
      if (err) return cb(err);
      connection.query(sql, cb);
      connection.release();
    });
  }

  static find(id, cb) {
    let sql = `SELECT * from eyny_tbl where id=${id}`;
    pool.getConnection(function(err, connection){
      if (err) return cb(err);
      connection.query(sql, cb);
      connection.release();
    });
  }

  static page(filter, cb) {
    const pi = filter.pi;
    const ps = filter.ps;
    const sortKey = filter.sortKey;
    const sortValue = filter.sortValue;
    const article_id = filter.index;
    const author_name = filter.author;
    const date_start = filter.date_start;
    const date_end = filter.date_end;

    const start = (pi-1)*ps;
    let filter_str = '';
    let sorter_str = '';

    try {
      if (article_id) {
        filter_str += ` id=${article_id}`;
      }
  
      if (author_name) {
        filter_str += ` author_name='${author_name}'`
      }
  
      if (date_start && date_end) {
        filter_str += ` created_at>'${date_start}' and created_at<'${date_end}'`;
      }
  
      if (filter_str) filter_str = 'where' + filter_str;
  
      if (sortKey && sortValue) {
        sorter_str = `order by ${sortKey} ${sortValue}`;
      }
    } catch (error) {
      console.log(error.message);  
      cb(error);    
    }

    const sql1 = `select count(*) as total from eyny_tbl ${filter_str};`;
    const sql2 = `SELECT * FROM eyny_tbl ${filter_str} ${sorter_str} limit ${start}, ${ps};`;
    
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

module.exports = Article;