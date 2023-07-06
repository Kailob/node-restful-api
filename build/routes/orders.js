"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const orders_1 = __importDefault(require("../models/orders"));
const products_1 = __importDefault(require("../models/products"));
// const checkAuth = require('../middleware/check-auth');
const check_auth_1 = __importDefault(require("../auth/check-auth"));
const env_1 = require("../config/env");
const router = express_1.default.Router();
// Gets ALL orders
router.get('/', check_auth_1.default, (req, res, next) => {
    orders_1.default
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
                        url: `http://localhost:${env_1.port}/products/${doc._id}`
                    }
                };
            })
        };
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
router.post('/', check_auth_1.default, (req, res, next) => {
    const order = new orders_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        ...req.body
    });
    products_1.default
        .findById(order.product)
        .then(doc => {
        if (doc) {
            return order.save();
        }
        else {
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
router.get('/:id', check_auth_1.default, (req, res, next) => {
    const { id } = req.params;
    // Bad Request
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        });
    }
    // Let's Find the product
    orders_1.default
        .findById(id)
        .select('product quantity _id')
        .populate('product', 'name _id')
        .exec()
        .then(doc => {
        if (doc) {
            res.status(200).json(doc);
        }
        else {
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
router.patch('/:id', check_auth_1.default, (req, res, next) => {
    const { id } = req.params;
    res.status(200).send({
        message: `Handling PATCH (Update) requests to /orders/${id}`
    });
});
module.exports = router;
//# sourceMappingURL=orders.js.map