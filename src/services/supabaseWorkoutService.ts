
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest?: number;
  gifUrl?: string;
  target?: string;
  equipment?: string;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_id?: string;
  workout_name: string;
  duration?: number;
  exercises_completed: number;
  total_exercises: number;
  notes?: string;
  completed_at: string;
}

// Helper function to safely convert Json to WorkoutExercise[]
function parseExercises(exercisesJson: any): WorkoutExercise[] {
  if (!exercisesJson || !Array.isArray(exercisesJson)) {
    return [];
  }
  
  return exercisesJson.map((exercise: any) => ({
    id: exercise.id || '',
    name: exercise.name || '',
    sets: Number(exercise.sets) || 0,
    reps: Number(exercise.reps) || 0,
    weight: exercise.weight ? Number(exercise.weight) : undefined,
    duration: exercise.duration ? Number(exercise.duration) : undefined,
    rest: exercise.rest ? Number(exercise.rest) : undefined,
    gifUrl: exercise.gifUrl || exercise.gif_url,
    target: exercise.target,
    equipment: exercise.equipment,
  }));
}

// Helper function to convert WorkoutExercise[] to JSON format for Supabase
function serializeExercises(exercises: WorkoutExercise[]): any[] {
  return exercises.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    duration: exercise.duration,
    rest: exercise.rest,
    gifUrl: exercise.gifUrl,
    target: exercise.target,
    equipment: exercise.equipment,
  }));
}

class SupabaseWorkoutService {
  // Get all workouts for the current user
  async getWorkouts(): Promise<Workout[]> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(workout => ({
        ...workout,
        exercises: parseExercises(workout.exercises)
      }));
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to fetch workouts');
      return [];
    }
  }

  // Get a single workout by ID
  async getWorkout(id: string): Promise<Workout | null> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        exercises: parseExercises(data.exercises)
      };
    } catch (error: any) {
      console.error('Error fetching workout:', error);
      toast.error('Failed to fetch workout');
      return null;
    }
  }

  // Create a new workout
  async createWorkout(workout: Omit<Workout, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Workout | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          name: workout.name,
          description: workout.description,
          exercises: serializeExercises(workout.exercises),
          duration: workout.duration,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Workout created successfully');
      return {
        ...data,
        exercises: parseExercises(data.exercises)
      };
    } catch (error: any) {
      console.error('Error creating workout:', error);
      toast.error(error.message || 'Failed to create workout');
      return null;
    }
  }

  // Update an existing workout
  async updateWorkout(id: string, updates: Partial<Omit<Workout, 'id' | 'user_id' | 'created_at'>>): Promise<Workout | null> {
    try {
      const updateData: any = { ...updates };
      
      // Convert exercises to JSON format if provided
      if (updates.exercises) {
        updateData.exercises = serializeExercises(updates.exercises);
      }

      const { data, error } = await supabase
        .from('workouts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Workout updated successfully');
      return {
        ...data,
        exercises: parseExercises(data.exercises)
      };
    } catch (error: any) {
      console.error('Error updating workout:', error);
      toast.error('Failed to update workout');
      return null;
    }
  }

  // Delete a workout
  async deleteWorkout(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Workout deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
      return false;
    }
  }

  // Log a completed workout
  async logWorkout(log: Omit<WorkoutLog, 'id' | 'user_id' | 'completed_at'>): Promise<WorkoutLog | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          ...log,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Workout logged successfully');
      return data;
    } catch (error: any) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout');
      return null;
    }
  }

  // Get workout history for the current user
  async getWorkoutHistory(): Promise<WorkoutLog[]> {
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching workout history:', error);
      toast.error('Failed to fetch workout history');
      return [];
    }
  }
}

export const supabaseWorkoutService = new SupabaseWorkoutService();
export default supabaseWorkoutService;
