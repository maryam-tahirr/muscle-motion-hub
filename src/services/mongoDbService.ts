
import { toast } from "@/components/ui/sonner";

// Define the MongoDB API base URL
// This would be your actual MongoDB API endpoint
const API_BASE_URL = "https://your-mongodb-api-url.com/api";

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // You might add authentication headers here
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    toast.error(error instanceof Error ? error.message : 'An error occurred with the API request');
    throw error;
  }
}

// Workout related interfaces
export interface Workout {
  _id?: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  createdBy?: string;
  isPublic?: boolean;
  category?: string;
  restBetweenExercises?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutExercise {
  exercise: {
    id: string;
    name: string;
    gifUrl?: string;
    target?: string;
    equipment?: string;
  };
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

// Workout API endpoints
export const workoutApi = {
  // Get all preset workouts
  getPresetWorkouts: () => apiRequest<Workout[]>('/workouts/preset'),

  // Get user's saved workouts
  getUserWorkouts: (userId: string) => apiRequest<Workout[]>(`/workouts/user/${userId}`),

  // Get a single workout by ID
  getWorkoutById: (workoutId: string) => apiRequest<Workout>(`/workouts/${workoutId}`),

  // Save a new workout
  saveWorkout: (workout: Workout) => apiRequest<Workout>('/workouts', 'POST', workout),

  // Update an existing workout
  updateWorkout: (workoutId: string, workout: Workout) => 
    apiRequest<Workout>(`/workouts/${workoutId}`, 'PUT', workout),

  // Delete a workout
  deleteWorkout: (workoutId: string) => apiRequest<void>(`/workouts/${workoutId}`, 'DELETE'),

  // Start workout session (to track progress)
  startWorkoutSession: (workoutId: string) => 
    apiRequest<{sessionId: string}>(`/workout-sessions/start/${workoutId}`, 'POST'),
    
  // Complete workout session
  completeWorkoutSession: (sessionId: string, data: {
    completed: boolean,
    duration: number,
    exercises: {exerciseId: string, completed: boolean, performance?: string}[]
  }) => apiRequest<void>(`/workout-sessions/${sessionId}/complete`, 'POST', data),

  // Get user's workout history
  getWorkoutHistory: (userId: string) => 
    apiRequest<{date: string, workoutId: string, name: string, duration: number}[]>(`/workout-sessions/history/${userId}`)
};

// User saved workouts storage
export const savedWorkoutsStorage = {
  // Get workouts from local storage as a fallback when offline
  getLocalWorkouts: (): Workout[] => {
    try {
      const workouts = localStorage.getItem('savedWorkouts');
      return workouts ? JSON.parse(workouts) : [];
    } catch (error) {
      console.error('Error retrieving saved workouts from local storage:', error);
      return [];
    }
  },

  // Save a workout to local storage
  saveLocalWorkout: (workout: Workout) => {
    try {
      const workouts = savedWorkoutsStorage.getLocalWorkouts();
      const updatedWorkouts = [...workouts, workout];
      localStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkouts));
      return true;
    } catch (error) {
      console.error('Error saving workout to local storage:', error);
      return false;
    }
  },

  // Sync local workouts with server when back online
  syncWorkouts: async (userId: string): Promise<boolean> => {
    try {
      const localWorkouts = savedWorkoutsStorage.getLocalWorkouts();
      if (localWorkouts.length === 0) return true;

      // Get workouts that are not yet synced (no _id)
      const unsynced = localWorkouts.filter(workout => !workout._id);
      
      if (unsynced.length === 0) return true;

      // Save each workout to the server
      for (const workout of unsynced) {
        await workoutApi.saveWorkout({
          ...workout,
          createdBy: userId
        });
      }

      // Update local storage with only synced workouts
      const synced = localWorkouts.filter(workout => workout._id);
      localStorage.setItem('savedWorkouts', JSON.stringify(synced));
      
      return true;
    } catch (error) {
      console.error('Error syncing workouts:', error);
      return false;
    }
  }
};

// Exercise Session service (for tracking during workout)
export interface ExerciseSession {
  exerciseId: string;
  name: string;
  currentSet: number;
  totalSets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  isResting: boolean;
  completed: boolean;
}

export interface WorkoutSession {
  sessionId: string;
  workoutId: string;
  name: string;
  startTime: Date;
  exercises: ExerciseSession[];
  currentExerciseIndex: number;
  isCompleted: boolean;
  isPaused: boolean;
  totalTime: number;
  elapsedTime: number;
}

// Audio notification service
export const audioService = {
  playExerciseStart: () => {
    const audio = new Audio('/sounds/exercise-start.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  },
  
  playExerciseComplete: () => {
    const audio = new Audio('/sounds/exercise-complete.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  },
  
  playRestStart: () => {
    const audio = new Audio('/sounds/rest-start.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  },
  
  playRestComplete: () => {
    const audio = new Audio('/sounds/rest-complete.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  },
  
  playWorkoutComplete: () => {
    const audio = new Audio('/sounds/workout-complete.mp3');
    audio.play().catch(err => console.error('Error playing sound:', err));
  }
};
