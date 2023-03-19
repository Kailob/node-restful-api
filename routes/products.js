const express = require('express');
const router = express.Router();
const { mongoose } = require('mongoose');
const Product = require('../models/products');
const PORT = process.env.PORT || 8080;

/**
 * app.js defines starting point /products.
 * Here we only handle what comes after /products.
 */


// GET all products
router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        // ...doc,// TODO: why not working?
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: 'GET/DELETE/PATCH',
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

/**
 * POST Handle create operations
 * POST is not idempotent. If we call it N times, we will create N different resources.
 * Responses to this method are not cacheable, 
 *  unless the response includes appropriate Cache-Control or Expires header fields.
 * 303 response can be used to direct the user agent to retrieve cacheable resource.
 */
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });

    product
        .save()
        .then(doc => {
            res.status(201).json({
                newProduct: {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: 'GET/DELETE/PATCH',
                        url: `http://localhost:${PORT}/products/${doc._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// GET the product identified by id
router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }
    // Let's Find the product
    Product
        .findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: 'GET/DELETE/PATCH',
                            url: `http://localhost:${PORT}/products/${doc._id}`
                        }
                    }
                );
            } else {
                res.status(404).json({
                    message: "Product Not Found"
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

    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }

    Product
        .findByIdAndUpdate(
            { _id: id },
            { $set: { ...req.body } },
            { new: true, runValidators: true }
        )
        .select('name price _id')
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

// DELETE the product identified by id
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }
    Product
        .deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            console.log("Product delete result: ", result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;