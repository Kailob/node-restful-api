"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //https://expressjs.com/en/api.html#expressnode
const morgan_1 = __importDefault(require("morgan"));
const database_js_1 = __importDefault(require("./config/database.js"));
(0, database_js_1.default)();
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const app = (0, express_1.default)();
// Logger middleware, for development.
app.use((0, morgan_1.default)('dev'));
// Middleware making static folders public.
// All requests done to uploads/, will be permitted
// A second approach would be for us to create a route to handle these requests manually
app.use('/uploads', express_1.default.static('uploads'));
// Parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express_1.default.urlencoded({ extended: false }));
// Parses incoming requests with JSON payloads and is based on body-parser.
app.use(express_1.default.json());
// CORS handler.
app.use((req, res, next) => {
    // Allow all origins
    res.header('Access-Control-Allow-Origin', '*');
    // Example of a restriction would be:
    // res.header('Access-Control.Allow-Origin', 'https://my-website.com');
    // But tools like postman will still be able to access to the API
    // Define allowed header
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Allowed request methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next(); //To allow other routes to execute
});
// App Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);
// Request didn't match previous routes
app.use((req, res, next) => {
    const error = new Error('Route Not Found');
    res.status(404);
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
exports.default = app;
//# sourceMappingURL=app.js.map