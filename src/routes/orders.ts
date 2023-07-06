import express, { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import OrderModel from '../models/orders';
import ProductModel from '../models/products';
// const checkAuth = require('../middleware/check-auth');
import checkAuth from '../auth/check-auth';
import { port } from '../config/env';


const router = express.Router();

// Gets ALL orders
router.get(
    '/',
    checkAuth,
    (req: Request, res: Response, next: NextFunction) => {
        OrderModel
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
                                url: `http://localhost:${port}/products/${doc._id}`
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
router.post(
    '/',
    checkAuth,
    (req: Request, res: Response, next: NextFunction) => {
        const order = new OrderModel({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        ProductModel
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
router.get(
    '/:id',
    checkAuth,
    (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        // Bad Request
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({
                message: `Invalid ID`
            })
        }
        // Let's Find the product
        OrderModel
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
router.patch(
    '/:id',
    checkAuth,
    (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        res.status(200).send({
            message: `Handling PATCH (Update) requests to /orders/${id}`
        })
    });



module.exports = router;