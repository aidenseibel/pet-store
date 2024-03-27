const dataModel = require('../models/dataModel');

const mainController = {
  getOnboarding: (req, res) => {
    res.render('onboarding');
  },
  getProfile: (req, res) => {
    const d = 'secondusertest'
    const profile = dataModel.getProfile(d);
    res.render('profile', { profile });
  },
  getListings: (req, res) => {
    var all_listings = [];

    dataModel.getAllListings(function(all_listings) {

    console.log("all_listings:");
    console.log(all_listings);

    });

    const profile = dataModel.getProfile();
    res.render('listings', { all_listings, profile });
  },
  getUserProductView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('user/user_product_view', { product });
  },
  getUserCart: (req, res) => {
    const cart = dataModel.getCart();
    res.render('user/user_cart', { cart });
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
  postOnboarding:(req,res) => {
    //handling the POST request made by the form on onboarding.js
    var newEmail = req.body.newEmail
    var newUser = req.body.newUsername
    var newPassword = req.body.newPassword
    dataModel.insertProfile(newEmail,newUser,newPassword);
  },
};

module.exports = mainController;