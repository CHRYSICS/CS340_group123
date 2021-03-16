var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'enter_username',
  password        : 'enter_password',
  database        : 'enter_database_name'
});

module.exports.pool = pool;
