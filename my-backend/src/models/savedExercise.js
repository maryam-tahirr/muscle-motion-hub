
const mongoose = require('mongoose');

const savedExerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gifUrl: String,
  target: String,
  equipment: String,
  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate saves
savedExerciseSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

module.exports = mongoose.model('SavedExercise', savedExerciseSchema);
