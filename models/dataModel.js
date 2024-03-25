const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../utils/database");

const sample_profile = "";
const sample_cart = []
const sample_product = []
const sample_orders = []

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
        profile = "";
        // throw err
      } else {
        profile = "";
        // console.log("results[0]: " + results[0].username);
        // profile = results;
      }
    });

    return profile;
  },

  getProduct: (product_id) => {
    return sample_product;
    // return 'product id = ' + product_id ;
  },

  getCart: () => {
    return sample_cart;
    // return 'cart';
  },

  getOrders: () => {
    return sample_orders;
    // return 'orders';
  },
};
  
module.exports = dataModel;
//module.exports = Router;