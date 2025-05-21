
import axios from 'axios';
import { toast } from '@/components/ui/sonner';
import { Exercise } from './exerciseService';

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  gifUrl?: string;
  target?: string;
  equipment?: string;
}

export interface Workout {
  _id?: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  category?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutLog {
  _id: string;
  workoutId: string;
  workoutName: string;
  completedDate: string;
  duration: number;
  exercisesCompleted: number;
  notes?: string;
}

// Get all workouts for the current user
export const fetchUserWorkouts = async (): Promise<Workout[]> => {
  try {
    const response = await axios.get('/api/workouts');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch workouts');
    return [];
  }
};

// Get a specific workout
export const fetchWorkout = async (id: string): Promise<Workout | null> => {
  try {
    const response = await axios.get(`/api/workouts/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching workout:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch workout details');
    return null;
  }
};

// Create a new workout
export const createWorkout = async (workout: Workout): Promise<Workout | null> => {
  try {
    const response = await axios.post('/api/workouts', workout);
    toast.success('Workout created successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error creating workout:', error);
    toast.error(error.response?.data?.message || 'Failed to create workout');
    return null;
  }
};

// Update an existing workout
export const updateWorkout = async (id: string, workout: Workout): Promise<Workout | null> => {
  try {
    const response = await axios.put(`/api/workouts/${id}`, workout);
    toast.success('Workout updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error updating workout:', error);
    toast.error(error.response?.data?.message || 'Failed to update workout');
    return null;
  }
};

// Delete a workout
export const deleteWorkout = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`/api/workouts/${id}`);
    toast.success('Workout deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting workout:', error);
    toast.error(error.response?.data?.message || 'Failed to delete workout');
    return false;
  }
};

// Log a completed workout
export const logCompletedWorkout = async (
  workoutId: string,
  duration: number,
  exercisesCompleted: number,
  notes?: string
): Promise<WorkoutLog | null> => {
  try {
    const response = await axios.post('/api/workouts/log', {
      workoutId,
      duration,
      exercisesCompleted,
      notes
    });
    toast.success('Workout logged successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error logging workout:', error);
    toast.error(error.response?.data?.message || 'Failed to log workout');
    return null;
  }
};

// Get workout logs for the current user
export const fetchWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  try {
    const response = await axios.get('/api/workouts/logs/history');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching workout logs:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch workout history');
    return [];
  }
};

// Helper to convert an exercise to a workout exercise
export const exerciseToWorkoutExercise = (
  exercise: Exercise, 
  sets: number = 3, 
  reps: number = 10
): WorkoutExercise => {
  return {
    exerciseId: exercise.id,
    name: exercise.name,
    sets,
    reps,
    gifUrl: exercise.gifUrl,
    target: exercise.target,
    equipment: exercise.equipment
  };
};
