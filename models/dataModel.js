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
	  var profile;
	  
	  var sql = mysql.format("SELECT * FROM userprofile WHERE username =?",[data]);

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
  };
  
module.exports = dataModel;
//module.exports = Router;