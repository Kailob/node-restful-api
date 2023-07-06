
import express, { Application, Request, Response, NextFunction } from 'express'; //https://expressjs.com/en/api.html#expressnode
import morgan from 'morgan';
import connect from "./config/database.js";

connect();

const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const app = express();



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
app.use((req: Request, res: Response, next: NextFunction) => {
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

    // Allowed request methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next(); //To allow other routes to execute
});

// App Routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

// Request didn't match previous routes
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Route Not Found');
    res.status(404);
    next(error);
});

// Captures any error thrown by the app
app.use((error: Error | any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || 'Generic Error'
        }
    });
});

export default app;