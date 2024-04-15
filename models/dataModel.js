const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../utils/database");
const Listing = require("../utils/class_listing")
const User = require("../utils/class_user")

const dataModel = {
    getAllListings: (callback) => {
	  var listings = [];
	  	console.log("getting listings")
        var sql = mysql.format("SELECT * FROM listings");
	  	mysqlConnection.query(sql, (err, results, fields) => {
      	  		if (err) {
          	 		throw err
          		} else {
		 		console.log("got listing results: ");
          	 		console.log(results);

				for(let i = 0; i< results.length; i++){
				const r = results[i];
				var l = new Listing(
							r.id,
							r.name,
							r.price,
							r.vendor_id,
							r.image_url,
							r.amount,
							r.ingredients,
							r.description
							);

			  	listings.push(l);
		 		}
		 		console.log("converted results to object");
		 		console.log(listings)
				callback(listings);
          		}
		}
	  );
    },
    getProfile: (data,callback) => {

	  console.log("running getProfile");
	  console.log("data is: " + data);
	  console.log("using local const d instead of data")
	  const d = 'hamster'
	  var profile;
	  var sql = mysql.format("SELECT * FROM user WHERE username =?",[d]);

	  mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
          	 throw err
          	} else {
          	 console.log("results[0]: " + results[0].username);
		 const r = results[0];
		 profile = new User(
				r.id,
				r.username,
				r.email,
				r.password,
				r.physical_address,
				r.city,
				r.state,
				r.zip,
				r.is_vendor,
				);
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
	 var c = "Failed";
	 
	 var sql = mysql.format("INSERT INTO user(email,username, password) VALUES (?,?,?)",[e,u,p]);

	   mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
          	 throw err
          	} else {
          	 console.log("made insert query in datamodel.js without errors");
			 c = "Success";
          	}
	   });

      callback(c);
    },
   matchProfile: (u,p,callback) =>{
	var c = "Failed";
	var profile;
	var sql = mysql.format("SELECT * FROM user WHERE username =? AND password = ?",[u,p]);
	mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
          	} else {
		    if(results.length > 0){
			var c = "Success";
			console.log("Given: ");
			console.log(u);
			console.log(p);
			console.log("Found match: ");
			const r = results[0];
			console.log(results[0].username);
		 	profile = new User(
				r.id,
				r.username,
				r.email,
				r.password,
				r.physical_address,
				r.city,
				r.state,
				r.zip,
				r.is_vendor,
				);
		    } else {
			var c = "Failed";
			console.log("Did not find match");
		    }
          	}
    	});
      callback(c);
     }
  };
  
module.exports = dataModel;
