const redis = require('redis');
const db = redis.createClient();

class Cache {
  static exist(name, cb) {
    db.exist(name, (err, doesExist) => {
      if (err) return cb(err);
      return cb(null, doesExist);
    })
  }
  static get(name, cb) {
    db.get(name, (err, value) => {
      if (err) {
        return cb(err);
      }
      return cb(null, value);
    });
  }

  static set(name, value) {
    db.set(name, value, err => {
      if (err) throw err;
    });
  }
}

module.exports = Cache;