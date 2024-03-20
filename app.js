const express = require('express');
const mysql = require("mysql");
const dbRoutes = require("./models/dataModel"); 

const app = express(); // init express
const port = 3000; // use port 3000

app.use(express.static('public')); // import folder public (contains styles and images)
app.use(express.json()); // import json
//app.use(dbRoutes);

const mainController = require('./controllers/mainController'); // init mainController, our view controller

app.set('view engine', 'ejs');
app.set('views', './views');

// Get Routes
app.get('/', mainController.getListings);
app.get('/onboarding', mainController.getOnboarding);
app.get('/profile', mainController.getProfile);
app.get('/listings', mainController.getListings);
app.get('/user_product_view', mainController.getUserProductView);
app.get('/user_cart', mainController.getUserCart);
app.get('/user_checkout', mainController.getUserCheckout);
app.get('/vendor_dashboard', mainController.getVendorDashboard);
app.get('/vendor_product_view', mainController.getVendorProductView);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});