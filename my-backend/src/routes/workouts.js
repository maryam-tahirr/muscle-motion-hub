
const express = require('express');
const router = express.Router();
const { 
  getUserWorkouts, 
  getWorkout, 
  createWorkout, 
  updateWorkout, 
  deleteWorkout,
  logCompletedWorkout,
  getWorkoutLogs
} = require('../controllers/index');
const { authenticateToken } = require('../middlewares/index');

// All routes require authentication
router.use(authenticateToken);

// Get all user's workouts
router.get('/', getUserWorkouts);

// Get a specific workout
router.get('/:id', getWorkout);

// Create a workout
router.post('/', createWorkout);

// Update a workout
router.put('/:id', updateWorkout);

// Delete a workout
router.delete('/:id', deleteWorkout);

// Log a completed workout
router.post('/log', logCompletedWorkout);

// Get workout logs
router.get('/logs/history', getWorkoutLogs);

module.exports = router;
