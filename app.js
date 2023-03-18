const express = require('express');
const app = express();

/**
 * .use() acts as middleware.
 * This means that all request will pass throw here.
 * Basic usage:
 */
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works'
    });
});

// Parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())

module.exports = app;