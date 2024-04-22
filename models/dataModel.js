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

				for (let i = 0; i < results.length; i++) {
					const r = results[i];
					var l = new Listing(
						r.id,
						r.name,
						r.price,
						r.vendor_id,
						r.vendor_username,
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
	getProfile: (id, callback) => {

		console.log("running getProfile");
		console.log("id is: " + id);
		var profile;
		var sql = mysql.format("SELECT * FROM user WHERE iduserprofile =?", [id]);

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("results[0]: " + results[0].username);
				const r = results[0];
				profile = new User(
					r.iduserprofile,
					r.username,
					r.email,
					r.password,
					r.physical_address,
					r.city,
					r.state,
					r.zip,
					r.is_vendor,
				);
				callback(profile);
			}
		});

		//return profile;
	},
	getProduct: (product_id, callback) => {
		var listing;
		console.log("getting listing. product id: ");
		console.log(product_id);
		var sql = mysql.format("SELECT * FROM listings WHERE id =?", [product_id]);
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("got listing results: ");
				console.log(results);

					const r = results[0];
					var l = new Listing(
						r.id,
						r.name,
						r.price,
						r.vendor_id,
						r.vendor_username,
						r.image_url,
						r.amount,
						r.ingredients,
						r.description
					);
					listing = l;
				}
				console.log("converted results to object");
				console.log(listing)
				callback(listing);
			}
		);
		
		return listing;
	},
	getCart: (uid, callback) => {
		const sql = mysql.format("SELECT * FROM cart WHERE userid = ?", [uid]);
		mysqlConnection.query(sql, (err, results) => {
			if (err) {
				throw err
			} else {
				callback(results);
			}
		});
		return 'cart';
	},
	getOrders: () => {
		return 'orders';
	},
	getSession: (callback) => {
		var sessionuser;
		const sql = mysql.format("SELECT * FROM session");
		mysqlConnection.query(sql, (err, results) => {
			if (err) {
				throw err
			} else {
				if(results[0] != null){
					console.log("current session:");
					console.log(results[0]);
					dataModel.getProfile(results[0].userid,function(sessionuser){
						callback(sessionuser);
					});
				} else { 
					console.log("no session found");
					callback(sessionuser);
				}	
			}
		});
	},
	createSession: (u, callback) => {
		console.log("creating session for ");
		console.log(u.id);
		var c = "Failed";

		var sql = mysql.format("INSERT INTO session(userid) VALUE (?)", [u.id]);

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("made insert query to session without errors");
				c = "Success";
			}
		});

	callback(c);
	},
	endSession:(callback) => {
		console.log("ending session");
		var sql = mysql.format("DELETE FROM session");

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("deleted all from session");
				callback("Success");
			}
		});
	},
	insertProfile: (e, u, p, callback) => {
		console.log("running createProfile");
		var c = "Failed";

		var sql = mysql.format("INSERT INTO user(email,username, password) VALUES (?,?,?)", [e, u, p]);

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
	insertCart: (uid, lid, q, callback) => {
		console.log("putting item in cart");
		var c = "Failed";

		var sql = mysql.format("INSERT INTO cart(userid,listing, quantity) VALUES (?,?,?)", [uid, lid, q]);

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("made insert query to cart without errors");
				c = "Success";
			}
		});

		callback(c);
	},
  matchProfile: (u,p,callback) =>{
	var c;
	var profile;
	var sql = mysql.format("SELECT * FROM user WHERE username =? AND password = ?",[u,p]);
	mysqlConnection.query(sql, (err, results, fields) => {
      	  	if (err) {
				throw err;
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
				r.iduserprofile,
				r.username,
				r.email,
				r.password,
				r.physical_address,
				r.city,
				r.state,
				r.zip,
				r.is_vendor,
				);
				callback(profile,c);
		    } else {
				var c = "Failed";
				console.log("Did not find match");
				callback(profile,c);
		    }
          	}
    	});
     }
};

module.exports = dataModel;
