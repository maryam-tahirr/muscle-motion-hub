
const Workout = require('../models/workout');
const WorkoutLog = require('../models/workoutLog');

// Get all workouts for a user
const getUserWorkouts = async (req, res) => {
  try {
    const userId = req.user._id;
    const workouts = await Workout.find({ userId });
    
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific workout
const getWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;
    
    const workout = await Workout.findOne({ _id: workoutId, userId });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new workout
const createWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, description, exercises, category, isPublic } = req.body;
    
    if (!name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: 'Name and at least one exercise are required' });
    }
    
    const workout = new Workout({
      userId,
      name,
      description,
      exercises,
      category: category || 'custom',
      isPublic: isPublic || false
    });
    
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a workout
const updateWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;
    const { name, description, exercises, category, isPublic } = req.body;
    
    const workout = await Workout.findOne({ _id: workoutId, userId });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    if (name) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (exercises && Array.isArray(exercises) && exercises.length > 0) workout.exercises = exercises;
    if (category) workout.category = category;
    if (isPublic !== undefined) workout.isPublic = isPublic;
    workout.updatedAt = Date.now();
    
    await workout.save();
    res.json(workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a workout
const deleteWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const workoutId = req.params.id;
    
    const result = await Workout.findOneAndDelete({ _id: workoutId, userId });
    
    if (!result) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log a completed workout
const logCompletedWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { workoutId, duration, exercisesCompleted, notes } = req.body;
    
    // Verify the workout belongs to the user
    const workout = await Workout.findOne({ _id: workoutId, userId });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    const workoutLog = new WorkoutLog({
      userId,
      workoutId,
      workoutName: workout.name,
      duration,
      exercisesCompleted,
      notes
    });
    
    await workoutLog.save();
    res.status(201).json(workoutLog);
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get workout logs for a user
const getWorkoutLogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const logs = await WorkoutLog.find({ userId }).sort({ completedDate: -1 });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching workout logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  logCompletedWorkout,
  getWorkoutLogs
};
