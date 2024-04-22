const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tcitbc2003",
  database: "hamsterstore_test",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = mysqlConnection;

///
// database.js

// const mysql = require('mysql');

// // Create connection pool
// const pool = mysql.createPool({
//   host: 'your_database_host',
//   user: 'your_database_user',
//   password: 'your_database_password',
//   database: 'your_database_name'
// });

// module.exports = pool;
