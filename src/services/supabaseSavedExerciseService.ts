
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface SavedExercise {
  id: string;
  user_id: string;
  exercise_id: string;
  name: string;
  gif_url?: string;
  target?: string;
  equipment?: string;
  body_part?: string;
  saved_at: string;
}

class SupabaseSavedExerciseService {
  // Get all saved exercises for the current user
  async getSavedExercises(): Promise<SavedExercise[]> {
    try {
      const { data, error } = await supabase
        .from('saved_exercises')
        .select('*')
        .order('saved_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching saved exercises:', error);
      toast.error('Failed to fetch saved exercises');
      return [];
    }
  }

  // Save an exercise
  async saveExercise(exercise: {
    exercise_id: string;
    name: string;
    gif_url?: string;
    target?: string;
    equipment?: string;
    body_part?: string;
  }): Promise<SavedExercise | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('saved_exercises')
        .insert({
          user_id: user.id,
          ...exercise,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Exercise already saved');
          return null;
        }
        throw error;
      }

      toast.success('Exercise saved successfully');
      return data;
    } catch (error: any) {
      console.error('Error saving exercise:', error);
      toast.error(error.message || 'Failed to save exercise');
      return null;
    }
  }

  // Remove a saved exercise
  async removeSavedExercise(exerciseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_exercises')
        .delete()
        .eq('exercise_id', exerciseId);

      if (error) throw error;

      toast.success('Exercise removed from saved');
      return true;
    } catch (error: any) {
      console.error('Error removing saved exercise:', error);
      toast.error('Failed to remove exercise');
      return false;
    }
  }

  // Check if exercise is saved
  async isExerciseSaved(exerciseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_exercises')
        .select('id')
        .eq('exercise_id', exerciseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if exercise is saved:', error);
      return false;
    }
  }
}

export const supabaseSavedExerciseService = new SupabaseSavedExerciseService();
export default supabaseSavedExerciseService;
