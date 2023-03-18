const express = require('express');
const app = express();
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

// Parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

// Product Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);


module.exports = app;