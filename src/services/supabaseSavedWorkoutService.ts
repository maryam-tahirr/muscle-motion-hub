
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface SavedWorkout {
  id: string;
  user_id: string;
  name: string;
  items: any; // JSON data for workout items
  created_at: string;
}

class SupabaseSavedWorkoutService {
  // Get all saved workouts for the current user
  async getSavedWorkouts(): Promise<SavedWorkout[]> {
    try {
      const { data, error } = await supabase
        .from('saved_workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching saved workouts:', error);
      toast.error('Failed to fetch saved workouts');
      return [];
    }
  }

  // Save a workout
  async saveWorkout(name: string, items: any): Promise<SavedWorkout | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_workouts')
        .insert({
          user_id: user.id,
          name,
          items,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Workout saved successfully');
      return data;
    } catch (error: any) {
      console.error('Error saving workout:', error);
      toast.error(error.message || 'Failed to save workout');
      return null;
    }
  }

  // Delete a saved workout
  async deleteSavedWorkout(workoutId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_workouts')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;

      toast.success('Workout deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting saved workout:', error);
      toast.error('Failed to delete workout');
      return false;
    }
  }

  // Get a specific saved workout
  async getSavedWorkout(workoutId: string): Promise<SavedWorkout | null> {
    try {
      const { data, error } = await supabase
        .from('saved_workouts')
        .select('*')
        .eq('id', workoutId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching saved workout:', error);
      return null;
    }
  }
}

export const supabaseSavedWorkoutService = new SupabaseSavedWorkoutService();
export default supabaseSavedWorkoutService;
