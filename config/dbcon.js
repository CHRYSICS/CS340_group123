var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_eckersoc',
  password        : 'group#123',
  database        : 'cs340_eckersoc'
});

module.exports.pool = pool;
