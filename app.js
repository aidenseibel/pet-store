const express = require('express');
const mysql = require("mysql");
const dbRoutes = require("./models/dataModel"); 
const bodyParser = require('body-parser')

const app = express(); // init express
const port = 3000; // use port 3000

app.use(express.static('public')); // import folder public (contains styles and images)
app.use(express.json()); // import json
//app.use(dbRoutes);

app.use( bodyParser.json() );       // to support JSON-encoded html bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded html bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded html bodies
app.use(express.urlencoded()); // to support URL-encoded html bodies

const mainController = require('./controllers/mainController'); // init mainController, our view controller

app.set('view engine', 'ejs');
app.set('views', './views');

// Get Routes
app.get('/', mainController.getListings);
app.get('/onboarding', mainController.getOnboarding);
app.get('/profile', mainController.getProfile);
app.get('/listings', mainController.getListings);
app.get('/user_product_view', mainController.getUserProductView);
app.get('/user_product_view?listing=:listingid', mainController.getUserProductView);
app.get('/user_cart', mainController.getUserCart);
app.get('/user_checkout', mainController.getUserCheckout);
app.get('/not_a_vendor_view', mainController.getNotAVendorView);
app.get('/vendor_dashboard', mainController.getVendorDashboard);
app.get('/vendor_product_view', mainController.getVendorProductView);
app.get('/vendor_listings', mainController.getVendorListings);
app.get('/logout', mainController.getLogout);

// Post Routes
app.post('/onboarding', mainController.postOnboarding);
app.post('/user_product_view', mainController.postCart);
app.post('/user_checkout', mainController.postOrder);
app.post('/user_cart', mainController.removeCart);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});