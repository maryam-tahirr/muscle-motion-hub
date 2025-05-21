
const SavedExercise = require('../models/savedExercise');

// Get all saved exercises for a user
const getUserSavedExercises = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedExercises = await SavedExercise.find({ userId });
    
    res.json(savedExercises);
  } catch (error) {
    console.error('Error fetching saved exercises:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save an exercise
const saveExercise = async (req, res) => {
  try {
    const userId = req.user._id;
    const { exerciseId, name, gifUrl, target, equipment } = req.body;
    
    if (!exerciseId || !name) {
      return res.status(400).json({ message: 'Exercise ID and name are required' });
    }
    
    // Check if already saved
    const existingSave = await SavedExercise.findOne({ userId, exerciseId });
    if (existingSave) {
      return res.status(409).json({ message: 'Exercise already saved' });
    }
    
    const savedExercise = new SavedExercise({
      userId,
      exerciseId,
      name,
      gifUrl,
      target,
      equipment
    });
    
    await savedExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    console.error('Error saving exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a saved exercise
const removeSavedExercise = async (req, res) => {
  try {
    const userId = req.user._id;
    const { exerciseId } = req.params;
    
    const result = await SavedExercise.findOneAndDelete({ userId, exerciseId });
    
    if (!result) {
      return res.status(404).json({ message: 'Saved exercise not found' });
    }
    
    res.json({ message: 'Exercise removed from saved' });
  } catch (error) {
    console.error('Error removing saved exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserSavedExercises,
  saveExercise,
  removeSavedExercise
};
