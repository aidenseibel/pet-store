const dataModel = require('../models/dataModel');
const Listing = require('../utils/class_listing');
const User = require('../utils/class_user');

const sample_user = {
  username: "leeroy tiger",
  email: "leeroy@trinity.edu",
  physical_address: "1 Trinity Place",
  city: "San Antonio",
  state: "Texas",
  zip: "78212",
  current_orders: [1],
  previous_orders: [1],
  cart: [[0, 1], [1, 1]],
  is_vendor: true,
  vendor_products: [2],
  vendor_orders: [1, 2, 3],
}

const sample_products = [
  {
    id: 0,
    name: "Happy Mix",
    price: 5.99,
    image_url: "https://www.creativefabrica.com/wp-content/uploads/2023/04/06/Cute-Hamster-kawaii-clipart-Graphics-66428546-1.jpg",
    vendor_name: "Maria",
    vendor_location: "London, UK",
    amount: "2 pounds",
    ingredients: ["carrots", "potatoes", "wheat"],
    description: "A lovely happy mix for your hamster!"
  },

  {
    id: 1,
    name: "Rainy Day Mix",
    price: 15.99,
    image_url: "https://i.pinimg.com/474x/35/96/e0/3596e03b599bb2ade609ce0318bf4620.jpg",
    vendor_name: "Mr. Rain's Concoctions",
    vendor_location: "Washington, USA",
    amount: "5 kilograms",
    ingredients: ["water", "eggs", "celery", "caffeine"],
    description: "Is is a very rainy day? Let your hamster indulge in my rainy day mix for a wonderful, productive afternoon!"
  },
  {
    id: 2,
    name: "Prada Mix",
    price: 150.99,
    image_url: "https://as1.ftcdn.net/v2/jpg/04/65/04/54/1000_F_465045445_tAqxYnT9cttrJTOz4ZZcbeKuyUUVmkvs.jpg",
    vendor_name: "Prada Inc.",
    vendor_location: "Paris, France",
    amount: "2 kilograms",
    ingredients: ["Red 40", "Prada Homme", "Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Curabitur dapibus", "orci ornare felis sodales"],
    description: "Morbi et maximus nisl, a euismod augue. Integer hendrerit nisl tempor leo interdum, non maximus mauris accumsan. Proin neque neque, imperdiet eget eros at, feugiat suscipit lectus. Mauris eleifend libero in velit interdum, sit amet semper elit luctus. Ut a elit nibh. Maecenas bibendum aliquam ligula vel ultricies. Ut blandit ex nisl, at sagittis neque viverra sed. In in arcu mollis, viverra sem id, molestie eros. Donec mauris metus, maximus sollicitudin lorem eu, rutrum venenatis mauris. Maecenas vel tincidunt neque, et imperdiet urna. Aenean at dolor quis quam euismod sodales.    "
  }

]

const sample_cart = {
  products: [0, 1, 2], // ids
  quantities: [1, 2, 3] // by index
}

const mainController = {
  getOnboarding: (req, res) => {
    res.render('onboarding');
  },
  getProfile: (req, res) => {
    const d = 'secondusertest'
    const profile = dataModel.getProfile(d);
    res.render('user/user_profile', { profile });
  },
  getListings: (req, res) => {
    var all_listings = [];
    dataModel.getAllListings(function(all_listings) {
   	 res.render('listings', { all_listings, profile });
    });
    const profile = dataModel.getProfile();
  },
  getUserProductView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('user/user_product_view', { product });
  },
  getUserCart: (req, res) => {
    var cart = [];
    dataModel.getCart('test', function(cart){
      res.render('user/user_cart', { cart });
    });
  },
  getUserCheckout: (req, res) => {
    const cart = dataModel.getCart();
    res.render('user/user_checkout', { cart });
  },
  getVendorDashboard: (req, res) => {
    const profile = dataModel.getProfile();
    const orders = dataModel.getOrders();
    res.render('vendor/vendor_dashboard', { profile, orders });
  },
  getVendorProductView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('vendor/vendor_product_view', { product });
  },
  getNotAVendorView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('vendor/vendor_product_view', { product });
  },
  getVendorListings: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('vendor/vendor_product_view', { product });
  },
  postOnboarding: (req, res) => {
    //handling the POST request made by the form on onboarding.js
    action = req.body.action;
    console.log(action);
	if(action == "createaccount"){
    		var newEmail = req.body.newEmail;
    		var newUser = req.body.newUsername;
    		var newPassword = req.body.newPassword;
    		dataModel.insertProfile(newEmail,newUser,newPassword, function(){
      			res.render('onboarding_accountcreated', { newUser });
    		});
	}
	if(action == "login"){
		var loginUser = new User;
		var queryUsername = req.body.queryUsername;
		var queryPassword = req.body.queryPassword;
		dataModel.matchProfile(queryUsername,queryPassword,function(status){
			console.log(status);
			if(status == "Success"){
      				res.render('onboarding_loggedin', { });
			}
			if(status != "Success"){
			    res.render('onboarding',{});
			}
    		});
		
	}
  },
  postCart: (req, res) => {
    console.log("postCart");
    var userID = req.body.userID;
    var itemID = req.body.itemId;
    var quantity = req.body.quantity;
    dataModel.addToCart(userID, itemID, quantity, function (err,result) {
      res.render('onboarding_accountcreated', { result });
    });
  },
};

module.exports = mainController;


//
// // mainController.js

// const express = require('express');
// const router = express.Router();

// // Add to cart route
// router.post('/add-to-cart', (req, res) => {
//   const { userId, itemId, quantity } = req.body;
//   dataModel.addToCart(userId, itemId, quantity, (err, result) => {
//     if (err) {
//       res.status(500).send('Error adding item to cart');
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });

// // Retrieve cart items route
// router.get('/cart-items/:userId', (req, res) => {
//   const userId = req.params.userId;
//   dataModel.getCartItems(userId, (err, result) => {
//     if (err) {
//       res.status(500).send('Error retrieving cart items');
//     } else {
//       res.json(result);
//     }
//   });
// });

// module.exports = router;
