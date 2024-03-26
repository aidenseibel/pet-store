const dataModel = require('../models/dataModel');

const mainController = {
  getOnboarding: (req, res) => {
    res.render('onboarding');
  },


  getProfile: (req, res) => {
    const d = 'secondusertest'
    const profile = dataModel.getProfile(d);
    
    // checks to see if a user is logged in, redirects to onboarding if not
    // if(profile == ""){
      res.render('user/user_profile', { profile });
    // }else{
    //   res.render('onboarding');
    // }
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
    const profile = dataModel.getProfile();
    const cart = dataModel.getCart(profile);
    res.render('user/user_cart', { cart });
  },


  getUserCheckout: (req, res) => {
    const profile = dataModel.getProfile();
    const cart = dataModel.getCart();
    res.render('user/user_checkout', { profile, cart });
  },


  getVendorDashboard: (req, res) => {
    const profile = dataModel.getProfile();
    const orders = dataModel.getOrders();

    // lil logic check to make sure you're a vendor
    // if(profile.isVendor){
      res.render('vendor/vendor_dashboard', { profile, orders });
    // }
    // else{
    //   res.render('vendor/not_vendor', { profile, orders });
    // }
  },

  
  getVendorProductView: (req, res) => {
    const product_id = req.body.product_id;
    const product = dataModel.getProduct(product_id);
    res.render('vendor/vendor_product_view', { product });
  },
};

module.exports = mainController;