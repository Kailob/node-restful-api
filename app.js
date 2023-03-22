const express = require('express'); //https://expressjs.com/en/api.html#expressnode 
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

// Logger middleware, for development.
app.use(morgan('dev'));

// Middleware making static folders public.
// All requests done to uploads/, will be permitted
// A second approach would be for us to create a route to handle these requests manually
app.use('/uploads', express.static('uploads'));

// Parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: false }));
// Parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

// CORS handler.
app.use((req, res, next) => {
    // Allow all origins
    res.header('Access-Control-Allow-Origin', '*');
    // Example of a restriction would be:
    // res.header('Access-Control.Allow-Origin', 'https://my-website.com');
    // But tools like postman will still be able to access to the API

    // Define allowed header
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // Supported request method options
    if (req.method === 'OPTIONS') {
        req.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next(); //To allow other routes to execute
});


mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

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