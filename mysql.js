var mysql = require('mysql');
var Credentials = require('./credentials');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: Credentials.mysqlHost,
  user: Credentials.mysqlUser,
  password: Credentials.mysqlPswd,
  database: Credentials.mysqlDatabase
});

module.exports.pool = pool;
