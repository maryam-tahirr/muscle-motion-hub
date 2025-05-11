
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const { authenticateToken } = require('../middlewares/index');
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getUserById
} = require('../controllers/index');

// Auth routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// User routes
router.get('/users/:id', authenticateToken, getUserById);

// Protected item routes
router.get('/items', getAllItems);
router.get('/items/:id', getItemById);
router.post('/items', authenticateToken, createItem);
router.put('/items/:id', authenticateToken, updateItem);
router.delete('/items/:id', authenticateToken, deleteItem);

module.exports = router;
