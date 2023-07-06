import express, { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import { jwt as jwtConfig } from '../config/env';
import UserModel from '../models/users';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const router = express.Router();
const SALT = bcrypt.genSaltSync(jwtConfig.SALT);
const expiresIn = jwtConfig.ACCESS_VALIDITY_SEC;


// CREATE user
router.post(
    '/register',
    (req: Request, res: Response, next: NextFunction) => {
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        UserModel
            .findOne({ email })
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(409).json({ message: "Email exists" });
                } else {
                    bcrypt.hash(
                        password,
                        SALT,
                        (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                });
                            } else {
                                const user = new UserModel({
                                    _id: new mongoose.Types.ObjectId(),
                                    first_name,
                                    last_name,
                                    email,
                                    password: hash
                                });

                                user
                                    .save()
                                    .then(doc => {
                                        console.error(doc);
                                        res.status(201).json({
                                            newUser: {
                                                _id: doc._id,
                                                email: doc.email,
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });
                            }
                        }
                    )
                }
            });
    });

// GET all users. Just for testing purposes
router.get(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
        UserModel
            .find()
            .select('email password _id')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            // ...doc,// TODO: why not working?
                            _id: doc._id,
                            email: doc.email,
                            password: doc.password
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

// DELETE the user identified by id
router.delete(
    '/:id',
    (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        // Bad Request
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({
                message: `Invalid ID`
            })
        }
        UserModel
            .deleteOne({
                _id: id
            })
            .exec()
            .then(result => {
                console.log("User delete result: ", result);
                res.status(200).json(result);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({
                    error: err
                });
            });
    });

// LOGIN user
router.post(
    '/login',
    (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        UserModel
            .findOne({ email })
            .select('email password _id')
            .exec()
            .then(doc => {

                // No user was found.
                if (!doc) {
                    // Returning 404 could be used for brute force attacks
                    // Instead we return 401
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }

                const match = bcrypt.compare(password, doc.password);

                bcrypt.compare(
                    password,
                    doc.password,
                    (err, result) => {
                        if (err) {
                            return res.status(401).json({
                                message: "Auth failed"
                            });
                        }
                        if (result) {
                            const token = jwt.sign(
                                {
                                    userId: doc._id,
                                    email: doc.email,
                                },
                                jwtConfig.KEY,
                                {
                                    expiresIn: expiresIn,
                                    // algorithm: 'RS256'
                                }
                            );
                            return res.status(200).json({
                                user: doc.email,
                                token: token,
                                expiresIn: expiresIn
                            });
                        }
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                );
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({
                    error: err
                });
            });
    });

module.exports = router;