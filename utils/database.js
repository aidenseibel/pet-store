const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "h@m$t3r$t0r3",
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