const express = require('express');
const app = express();
const morgan = require('morgan');

const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

// Parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

// Logger middleware, for development.
app.use(morgan('dev'));

// App Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Request didn't match previous routes
app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

// Captures any error thrown by the app
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || 'Generic Error'
        }
    });
});

module.exports = app;