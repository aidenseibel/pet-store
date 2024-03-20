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
    const all_listings = dataModel.getAllListings();
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
};

module.exports = mainController;