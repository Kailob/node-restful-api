const express = require('express');
const router = express.Router();
const { mongoose } = require('mongoose');
const Product = require('../models/products');

/**
 * app.js defines starting point /products.
 * Here we only handle what comes after /products.
 */


// GET all products
router.get('/', (req, res, next) => {
    //.exec turn save into a promise.
    Product
        .find()
        .exec()
        .then(docs => {
            console.log("From Database: ", docs);
            if (docs.length > 0) {
                res.status(200).json(docs);
            } else {
                res.status(404).json({
                    message: "No Products Found"
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

/**
 * POST Handle create operations
 * POST is not idempotent. If we call it N times, we will create N different resources.
 * Responses to this method are not cacheable, 
 *  unless the response includes appropriate Cache-Control or Expires header fields.
 * 303 response can be used to direct the user agent to retrieve cacheable resource.
 */
router.post('/', (req, res, next) => {
    const { name, price } = req.body;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price
    });

    product
        .save()
        .then(doc => {
            console.log(doc);
            res.status(201).json({
                message: 'Product Created',
                createdProduct: doc
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
        .exec()
        .then(doc => {
            console.log("From Database: ", doc);
            if (doc) {
                res.status(200).json(doc);
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

// /**
//  * PUT handles updates by replacing the entire product identified by id.
//  * PUT method is idempotent - can be invoked many times without different outcomes.
//  * Should not cache its response.
//  */
// router.put('/:id', (req, res, next) => {
//     const { id } = req.params;

//     // Bad Request
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         res.status(400).send({
//             message: `Invalid ID`
//         })
//     }

//     const product = new Product({
//         _id: id,
//         ...req.body
//     });

//     product.validate()

//     Product
//         .findByIdAndUpdate(
//             { _id: id },
//             { $set: { ...req.body } },
//             { new: true, runValidators: true }
//         )
//         .exec()
//         .then(result => {
//             console.log("Product put result: ", result);
//             res.status(200).json(result);
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

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
        .exec()
        .then(result => {
            console.log("Product patch result: ", result);
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