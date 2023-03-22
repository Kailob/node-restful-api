const express = require('express');
const router = express.Router();
const { mongoose } = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const SALT = bcrypt.genSaltSync(process.env.AUTH_SALT_ROUNDS || 10);

router.post('/sign-up', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: bcrypt.hashSync(
            password,
            SALT,
            (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
            }
        )
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

    // Another way to go around it is to use bcrypt.hash and only save the user if there's no error
});



// GET all users. Just for testing purposes
router.get('/', (req, res, next) => {
    User
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
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    // Bad Request
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).send({
            message: `Invalid ID`
        })
    }
    User
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

module.exports = router;