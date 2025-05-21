
const express = require('express');
const router = express.Router();
const { getUserSavedExercises, saveExercise, removeSavedExercise } = require('../controllers/index');
const { authenticateToken } = require('../middlewares/index');

// All routes require authentication
router.use(authenticateToken);

// Get user's saved exercises
router.get('/saved', getUserSavedExercises);

// Save an exercise
router.post('/saved', saveExercise);

// Remove a saved exercise
router.delete('/saved/:exerciseId', removeSavedExercise);

module.exports = router;
