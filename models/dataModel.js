const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../utils/database");

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

				for(let i = 0; i < results.length; i++){
					const l = new Array(
							results[i].idlistings,
							results[i].ownerusername,
							results[i].listingname,
							results[i].listingprice,
							results[i].listingimageurl
						);
					listings.push(l);
				}
				console.log("converted results to array");
				console.log(listings)
				callback(listings);
			}
		});
		//console.log("listings to return: ");
		//console.log(listings);
		//return listings;
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