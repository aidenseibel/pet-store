const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../utils/database");
const Listing = require("../utils/class_listing")
const User = require("../utils/class_user");
const Order = require("../utils/class_order");

const dataModel = {
	getAllListings: (callback) => {
		var listings = [];
		var sql = mysql.format("SELECT * FROM listings");
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				console.log("Failed to get listings")
				throw err
			} else {
				console.log("Fetched", results.length, "listings");

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
				callback(listings);
			}
		}
		);
	},

	getListings: (vendor_id, callback) => {
		var listings = [];
		var sql = mysql.format("SELECT * FROM listings WHERE vendor_id =?", [vendor_id]);
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				results.forEach(function(r) {
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
					listings.push(l)
				});
			}
			console.log(listings)
			callback(listings);
		}
	);},
		
	getProfile: (id, callback) => {
		console.log("running getProfile");
		console.log("id is: " + id);
		var profile;
		var sql = mysql.format("SELECT * FROM user WHERE iduserprofile =?", [id]);

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log(results)
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
	},
	getProduct: (product_id, callback) => {
		var listing;
		console.log("Fetched listing w/ product id", product_id, ":");
		var sql = mysql.format("SELECT * FROM listings WHERE id =?", [product_id]);
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {

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
	getOrders: (vendor_id, callback) => {
		var orders = [];
		var sql = mysql.format("SELECT * FROM orders WHERE vendor_id =?", [vendor_id]);
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				results.forEach(function(r) {
					var l = new Order(
						r.id,
						r.user_id,
						r.vendor_id,
						r.product_id,
						r.quantity,
						r.has_been_delivered,
					);
					orders.push(l)
				});
			}
			callback(orders);
		}
	);},

	getUserOrders: (user_id, callback) => {
		var orders = [];
		var sql = mysql.format("SELECT * FROM orders WHERE user_id =?", [user_id]);
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				results.forEach(function(r) {
					var l = new Order(
						r.id,
						r.user_id,
						r.vendor_id,
						r.product_id,
						r.quantity,
						r.has_been_delivered,
					);
					orders.push(l)
				});
			}
			callback(orders);
		}
	);},

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

	removeCart: (uid, callback) => {
		console.log("Removing cart items");
		var c = "Failed";
	
		var sql = mysql.format("DELETE FROM cart WHERE userid = ?", [uid]);
	
		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err;
			} else {
				console.log("Deleted cart items without errors");
				c = "Success";
			}
		});
	
		callback(c);
	},	
	
	insertOrder: (uid, vid, pid, q, hbd, callback) =>{
		var c = "Failed";

		var sql = mysql.format("INSERT INTO orders(user_id,vendor_id,product_id,quantity,has_been_delivered) VALUES (?,?,?,?,?)", [uid, vid, pid, q, hbd]);

		mysqlConnection.query(sql, (err, results, fields) => {
			if (err) {
				throw err
			} else {
				console.log("made insert query to orders without errors");
				c = "Success";

				dataModel.removeCart(uid, function(status) {
					if (status === "Success") {
						console.log("Cart cleared successfully");
					} else {
						console.error("Failed to clear cart");
					}
				});	
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
