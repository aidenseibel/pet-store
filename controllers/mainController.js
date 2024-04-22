//IMPORTS======================================================
const dataModel = require('../models/dataModel');
const Listing = require('../utils/class_listing');
const User = require('../utils/class_user');
const async = require('async');

//==============================================================
//                   MAINCONTROLLER
//==============================================================
//MAINCONTROLLER: A list of get and post functions. Called by app.js. Example: app.js: (/home, mainController.getHome);
//   use get functions to display views or redirect. you may use GET data from url. (/home?userid=1)
//   use post functions to send data to the database. sends hidden POST request data to database.
const mainController = {
  getOnboarding: (req, res) => {
    //Display the 'onboarding' view
    res.render('onboarding');
  },
  getProfile: (req, res) => {
    dataModel.getSession(function(profile){
      if(profile){
        dataModel.getUserOrders(profile.id, function(orders){
          current_orders = [];
          previous_orders = [];
          async.each(orders, function(order, callback) {
              // Retrieve product details for each item ID
              dataModel.getProduct(order.product_id, function(product) {
                if(!order.has_been_delivered){
                  current_orders.push([order, product]);
                }else{
                  previous_orders.push([order, product]);
                }
                callback(); // Move to the next item
              });
          }, function(err) {
              if (err) {
                  // Handle error if any
                  console.error('Error retrieving cart items:', err);
                  res.status(500).send('Internal Server Error');
              } else {
                  // Render the user cart with complete product information
                  res.render('user/user_profile', { profile, current_orders, previous_orders });
              }
          });
      });

      } else {
        res.redirect('/onboarding');
      }
    });
  },
  getListings: (req, res) => {
    var all_listings = [];
    dataModel.getAllListings(function(all_listings) {
   	 res.render('listings', { all_listings});
    });
  },
  getUserProductView: (req, res) => {
    const product_id = req.query.listingid;
    var product;
    dataModel.getProduct(product_id, function(product){
      dataModel.getProfile(product.vendor_id, function(vendor){
        res.render('user/user_product_view', { product, vendor });
      });
    });   
  },
  getUserCart: (req, res) => {
    var cart = [];
    var session;
    dataModel.getSession(function(session){
      if(session){
        dataModel.getCart(session.id, function(cart){
          var cart_items = [];
          // Loop through each item ID in the cart
          async.each(cart, function(item, callback) {
              // Retrieve product details for each item ID
              dataModel.getProduct(item.listing, function(product) {
                  // Add the product to the cart_items array
                  cart_items.push(product);
                  callback(); // Move to the next item
              });
          }, function(err) {
              if (err) {
                  // Handle error if any
                  console.error('Error retrieving cart items:', err);
                  res.status(500).send('Internal Server Error');
              } else {
                  var subtotal = getSubtotal(cart_items);
                  var tax = Math.round(10 ** 2 * (subtotal * 0.0825)) / 10 ** 2
                  var shipping = 9.99
                  var total = Math.round(10 ** 2 * (subtotal + tax + shipping)) / 10 ** 2

                  // Render the user cart with complete product information
                  res.render('user/user_cart', { cart_items, subtotal, tax, shipping, total});
              }
          });
        });
      }else{
        res.redirect('onboarding');
      }
    });
  },
  getUserCheckout: (req, res) => {
    var cart = [];
    dataModel.getSession(function(session){
      if(session){
        dataModel.getCart(session.id,function(cart){
          var cart_items = [];
          async.each(cart, function(item, callback) {
            // Retrieve product details for each item ID
            dataModel.getProduct(item.listing, function(product) {
                // Add the product to the cart_items array
                cart_items.push([product, item.quantity]);
                callback(); // Move to the next item
            });
        }, function(err) {
            if (err) {
                // Handle error if any
                console.error('Error retrieving cart items:', err);
                res.status(500).send('Internal Server Error');
            } else {
                var subtotal = getSubtotal(cart_items);
                var tax = Math.round(10 ** 2 * (subtotal * 0.0825)) / 10 ** 2
                var shipping = 9.99
                var total = Math.round(10 ** 2 * (subtotal + tax + shipping)) / 10 ** 2
                var deliveryDate = getDateAWeekFromNow();
                var profile = session;
                console.log(profile);
                // Render the user cart with complete product information
                if(cart_items.length != 0){
                  res.render('user/user_checkout', { cart_items, subtotal, tax, shipping, total, deliveryDate, profile});
                }
            }
          });
        });
      }else{
        res.redirect('/onboarding');
      }
    });
  },
  getVendorDashboard: (req, res) => {
    dataModel.getSession(function(profile){  
      if(profile){
        if(profile.is_vendor){
          const orders = [];
          dataModel.getOrders(profile.id, function(orders){
            all_orders = [];
            openOrders = [];
            total_earnings = 0;
            async.each(orders, function(order, callback) {
                // Retrieve product details for each item ID
                dataModel.getProduct(order.product_id, function(product) {
                    total_earnings += product.price * order.quantity;
                    // Retrieve user details for the order
                    dataModel.getProfile(order.user_id, function(user) {
                        all_orders.push([order, product, user]);
                        if(!order.has_been_delivered){
                            openOrders.push([order, product, user]);
                        }
                        callback(); // Move to the next item
                    });
                });
            }, function(err) {
                if (err) {
                    // Handle error if any
                    console.error('Error retrieving cart items:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    total_earnings = Math.round(10 ** 2 * (total_earnings)) / 10 ** 2
                    // Render the user cart with complete product information
                    res.render('vendor/vendor_dashboard', { profile, all_orders, openOrders, total_earnings });
                }
            });
        });
                }else{
          res.render('vendor/not_a_vendor_view', {});
        }
      } else {
        res.redirect('onboarding');
      }
    });
  },
  getVendorProductView: (req, res) => {
    const product_id = req.query.listingid;
    var product;
    dataModel.getProduct(product_id, function(product){
      dataModel.getProfile(product.vendor_id, function(vendor){
        res.render('vendor/vendor_product_view', { product, vendor });
      });
    });   
  },
  getNotAVendorView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('vendor/vendor_product_view', { product });
  },
  getVendorListings: (req, res) => {
    var profile;
    dataModel.getSession(function(profile){  
      if(profile){
        if(profile.is_vendor){
          dataModel.getProfile(profile.id, function(profile){
            const listings = [];
            dataModel.getListings(profile.id, function(listings){
              res.render('vendor/vendor_listings', { profile, listings });
            })
          });
        }else{
          res.render('vendor/not_a_vendor_view', {});
        }
      } else {
        res.redirect('onboarding');
      }
    });
  },
  getLogout:(req,res) => {
    dataModel.getSession(function(session){
      if(session){
        var status;
        dataModel.endSession(function(status){
          res.redirect('/onboarding');
        });
      }else{
        res.redirect('/onboarding');
      }
    });
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
      var session;
      dataModel.getSession(function(session){
        if(session){
          res.redirect('/onboarding');
        } else {
          var loginUser = new User;
          var status;
          var queryUsername = req.body.queryUsername;
          var queryPassword = req.body.queryPassword;
          dataModel.matchProfile(queryUsername,queryPassword,function(loginUser,status){
            console.log(status);
            console.log(loginUser);
            if(status == "Success"){
              var sessionstatus;
              dataModel.createSession(loginUser,function(sessionstatus){
                var profile = loginUser;
                console.log("profile: ", profile)
                res.render('user/user_profile', { profile });
              });
            }
            if(status != "Success"){
              res.render('onboarding',{});
            }
          });
        }
      });
	  }
  },
  postCart: (req, res) => {
    var session;
    dataModel.getSession(function(session){
      console.log("postcart session: ");
      console.log(session);
      if(session){
        console.log("postCart");
        var userID = session.id;
        var itemID = req.body.itemId;
        var quantity = req.body.quantity;
        dataModel.insertCart(userID, itemID, quantity, function (err,result) {
          res.redirect('/user_cart');
        });
      } else {
        res.redirect('/onboarding');
      }
    })
  },

  postOrder: (req, res) => {
    var session;
    dataModel.getSession(function(session){
      if(session){
        console.log("post order: ", req.body);

        var uid = req.body.profile;

        dataModel.getCart(uid, function(cart){
          cart.forEach(function(item) {
            var pid = item.cartitemid;
            var q = 1;
            var hbd = 0;
            dataModel.getProduct(pid, function(listing){
              var vid = listing.vendor_id;
              // Insert order for the current item
              dataModel.insertOrder(uid, vid, pid, q, hbd, function (err,result) {
                if (err) {
                  console.error("Error inserting order:", err);
                }
              });
            })
          });  
          res.redirect('profile');
        })
      } else {
        res.redirect('/onboarding');
      }
    })
  }
};


function getSubtotal(cartItems) {
  let subtotal = 0;
  cartItems.forEach(item => {
      subtotal += item.price; // Assuming each item has a 'price' property
  });
  return subtotal;
}

function getDateAWeekFromNow() {
  let currentDate = new Date();
  let oneWeekLater = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));

  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  // Extract month and day from the one week later date
  let monthIndex = oneWeekLater.getMonth();
  let monthName = months[monthIndex];
  let day = oneWeekLater.getDate();

  // Return the date string in the format "MMMM DDth"
  return `${monthName} ${day}`;
}

module.exports = mainController;


//EXAMPLE DATA FOR DEBUGGING===================================
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