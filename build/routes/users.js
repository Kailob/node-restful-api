"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const SALT = bcrypt_1.default.genSaltSync(env_1.jwt.SALT);
const expiresIn = env_1.jwt.ACCESS_VALIDITY_SEC;
// CREATE user
router.post('/register', (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    // Validate user input
    if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
    }
    users_1.default
        .findOne({ email })
        .exec()
        .then(doc => {
        if (doc) {
            res.status(409).json({ message: "Email exists" });
        }
        else {
            bcrypt_1.default.hash(password, SALT, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new users_1.default({
                        _id: new mongoose_1.default.Types.ObjectId(),
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
            });
        }
    });
});
// GET all users. Just for testing purposes
router.get('/', (req, res, next) => {
    users_1.default
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
// DELETE the user identified by id
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    // Bad Request
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        });
    }
    users_1.default
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
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    users_1.default
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
        const match = bcrypt_1.default.compare(password, doc.password);
        bcrypt_1.default.compare(password, doc.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                const token = jsonwebtoken_1.default.sign({
                    userId: doc._id,
                    email: doc.email,
                }, env_1.jwt.KEY, {
                    expiresIn: expiresIn,
                    // algorithm: 'RS256'
                });
                return res.status(200).json({
                    user: doc.email,
                    token: token,
                    expiresIn: expiresIn
                });
            }
            return res.status(401).json({
                message: "Auth failed"
            });
        });
    })
        .catch(err => {
        console.error(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports = router;
//# sourceMappingURL=users.js.map