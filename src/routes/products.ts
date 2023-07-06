import express, { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from 'multer';
import mongoose from 'mongoose';
import ProductModel from '../models/products';
import checkAuth from '../auth/check-auth';
import { port } from '../config/env';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

const uploadFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const extension = file.originalname.split('.').pop();
    const mimetyp = file.mimetype;
    if (
        (extension === 'jpg' && mimetyp === 'image/jpg') ||
        (extension === 'jpeg' && mimetyp === 'image/jpeg') ||
        (extension === 'png' && mimetyp === 'image/png')) {
        callback(null, true); // Accept a file
    }
    else {
        // const err = new Error('Invalid file type');
        callback(null, false); // Reject a file
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: uploadFilter
});

// GET all products
router.get(
    '/',
    (req: Request, res: Response) => {
        ProductModel
            .find()
            .select('name price image _id')
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
                            // TODO: Fix image path
                            // image: doc.image ? doc.image.path : '',
                            request: {
                                type: 'GET/DELETE/PATCH',
                                // TODO: change url to .env variable
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

// GET the product identified by id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }
    // Let's Find the product
    ProductModel
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
                            url: `http://localhost:${port}/products/${doc._id}`
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

/**
 * POST Handle create operations
 * POST is not idempotent. If we call it N times, we will create N different resources.
 * Responses to this method are not cacheable, 
 *  unless the response includes appropriate Cache-Control or Expires header fields.
 * 303 response can be used to direct the user agent to retrieve cacheable resource.
 */
router.post(
    '/',
    checkAuth,
    upload.single('image'),
    (req: Request, res: Response, next: NextFunction) => {
        const product = new ProductModel({
            _id: new mongoose.Types.ObjectId(),
            ...req.body,
            image: req.file
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
                            url: `http://localhost:${port}/products/${doc._id}`
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

// PUT handles updates by replacing the entire product identified by id.
// PATCH only updates the fields that we give it
router.patch(
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

        ProductModel
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
router.delete(
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
        ProductModel
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