
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// Regular login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        
        // Create and assign token
        const token = jwt.sign({ 
            _id: user._id,
            isAdmin: user.isAdmin || false 
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false // Default to regular user
        });
        
        await user.save();
        
        // Create and assign token
        const token = jwt.sign({ _id: user._id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: false
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/signin',
        session: false 
    }),
    (req, res) => {
        // Create JWT for the authenticated user
        const token = jwt.sign({ 
            _id: req.user._id,
            isAdmin: req.user.isAdmin || false 
        }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        // Redirect to frontend with token
        res.redirect(`${process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173'}/auth-callback?token=${token}`);
    }
);

module.exports = router;
