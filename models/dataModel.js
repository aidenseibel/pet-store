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
	getProfile: (data, callback) => {

		console.log("running getProfile");
		console.log("data is: " + data);
		console.log("using local const d instead of data")
		const d = 'hamster'
		var profile;
		var sql = mysql.format("SELECT * FROM user WHERE username =?", [d]);

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
				//profile = results;
			}
		});

		return profile;
	},
	getProduct: (product_id) => {
		return 'product id = ' + product_id;
	},
	getCart: (userId, callback) => {

		const sql = mysql.format("SELECT * FROM cart WHERE user = ?", [userId]);
		mysqlConnection.query(sql, (err, results) => {
			if (err) {
				throw err
			} else {
				console.log("results of cart:");
				console.log(results);
				callback(results);
			}
		});

		return 'cart';
	},
	getOrders: () => {
		return 'orders';
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
	insertCart: (u, l, q, callback) => {
		console.log("putting item in cart");
		var c = "Failed";

		var sql = mysql.format("INSERT INTO cart(user,listing, quantity) VALUES (?,?,?)", [u, l, q]);

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
};

module.exports = dataModel;
//module.exports = Router;


///

// dataModel.js

//const mysqlConnection = require('./database');

// function addToCart(userId, itemId, quantity, callback) {
// 	const sql = 'INSERT INTO cart_items (user_id, item_id, quantity) VALUES (?, ?, ?)';
// 	mysqlConnection.query(sql, [userId, itemId, quantity], (err, result) => {
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, result);
// 		}
// 	});
// }

// function getCartItems(userId, callback) {
// 	const sql = 'SELECT * FROM cart_items WHERE user_id = ?';
// 	mysqlConnection.query(sql, [userId], (err, result) => {
// 		if (err) {
// 			callback(err, null);
// 		} else {
// 			callback(null, result);
// 		}
// 	});
// }

//module.exports = { addToCart, getCartItems };
