const express = require('express');
const router = express.Router();

/**
 * app.js defines starting point /products.
 * Here we only handle what comes after /products.
 */


// GET all products
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
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

    const product = {
        name,
        price
    }

    res.status(201).json({
        message: 'Product Created',
        createdProduct: product
    });
});

// GET the product identified by id
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling GET requests to /products/${id}`
    })
});

/**
 * PUT handles updates by replacing the entire product identified by id.
 * PUT method is idempotent - can be invoked many times without different outcomes.
 * Should not cache its response.
 */
router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling PUT (Update) requests to /products/${id}`
    })
});

// PATCH only updates the fields that we git it
router.patch('/:id', (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling PATCH (Update) requests to /products/${id}`
    })
});

// DELETE the product identified by id
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling DELETE requests to /products/${id}`
    })
});


module.exports = router;