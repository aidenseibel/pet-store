const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../utils/database");

const dataModel = {
    getAllListings: () => {
      return 'all listings';
    },
    getProfile: (data,callback) => {

	  console.log("running getProfile");
	  console.log("data is: " + data);
	  console.log("using local const d instead of data")
	  const d = 'hamster'
	  var profile;
	  
	  var sql = mysql.format("SELECT * FROM userprofile WHERE username =?",[d]);

	  mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
          	 throw err
          	} else {
          	 console.log("results[0]: " + results[0].username);
	  	 profile = results;
          	}
	});

      return profile;
    },
    getProduct: (product_id) => {
      return 'product id = ' + product_id ;
    },
    getCart: () => {
      return 'cart';
    },
    getOrders: () => {
      return 'orders';
    },
    insertProfile: (e,u,p,callback) => {
	 console.log("running createProfile");
	 
	 var sql = mysql.format("INSERT INTO userprofile(email,username, password) VALUES (?,?,?)",[e,u,p]);

	   mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
          	 throw err
          	} else {
          	 console.log("made insert query in datamodel.js without errors");
          	}
	   });

      return true;
    },
  };
  
module.exports = dataModel;
//module.exports = Router;