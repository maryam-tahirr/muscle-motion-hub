
const express = require('express');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

// Admin authentication middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
};

// Logging middleware
const logRequest = (req, res, next) => {
    console.log(`Request received at: ${req.originalUrl} [${new Date().toISOString()}]`);
    next();
};

// Exporting middleware functions
module.exports = {
    authenticateToken,
    isAdmin,
    logRequest
};
