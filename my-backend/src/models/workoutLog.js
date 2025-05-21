
const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  workoutName: {
    type: String,
    required: true
  },
  completedDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  exercisesCompleted: {
    type: Number,
    required: true
  },
  notes: String
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
