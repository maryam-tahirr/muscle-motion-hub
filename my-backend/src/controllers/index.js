
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('./items');
const { createInitialAdminUser, getUserById } = require('./users');
const { getUserSavedExercises, saveExercise, removeSavedExercise } = require('./savedExercises');
const { getUserWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout, logCompletedWorkout, getWorkoutLogs } = require('./workouts');

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  createInitialAdminUser,
  getUserById,
  getUserSavedExercises,
  saveExercise,
  removeSavedExercise,
  getUserWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  logCompletedWorkout,
  getWorkoutLogs
};
