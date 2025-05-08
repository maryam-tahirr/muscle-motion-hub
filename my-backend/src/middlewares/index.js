const express = require('express');

const router = express.Router();

// Example middleware function
const exampleMiddleware = (req, res, next) => {
    console.log('Request received at:', req.originalUrl);
    next();
};

// Exporting middleware functions
module.exports = {
    exampleMiddleware,
};