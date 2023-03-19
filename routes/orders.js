const express = require('express');
const router = express.Router();
const { mongoose } = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/products');
const PORT = process.env.PORT || 8080;

/**
 * app.js defines starting point /orders.
 * Here we only handle what comes after /orders.
 */


// Gets ALL orders
router.get('/', (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:${PORT}/products/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// Creates new order
router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });

    Product
        .findById(order.product)
        .then(doc => {
            if (doc) {
                return order.save();
            } else {
                res.status(404).json({
                    message: "Product Not Found"
                });
            }
        })
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// GET the order identified by id
router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }
    // Let's Find the product
    Order
        .findById(id)
        .select('product quantity _id')
        .populate('product', 'name _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "Order Not Found"
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// PUT handles updates by replacing the entire product identified by id.
// PATCH only updates the fields that we give it
router.patch('/:id', (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling PATCH (Update) requests to /orders/${id}`
    })
});



module.exports = router;