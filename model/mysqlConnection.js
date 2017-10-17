var mysql = require('mysql');

var dbConfig = {
   host: '127.0.0.1',
   user: 'root',
   password: 'root',
   database: 'umi_db'
};

var connection = mysql.createPool(dbConfig);
module.exports = connection;
