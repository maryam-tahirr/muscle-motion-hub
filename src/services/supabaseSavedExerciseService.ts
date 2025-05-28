
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface SavedExercise {
  id: string;
  user_id?: string;
  exerciseId: string;
  name: string;
  gifUrl?: string;
  target?: string;
  equipment?: string;
  created_at: string;
}

class SupabaseSavedExerciseService {
  // Get all saved exercises for the current user
  async getSavedExercises(): Promise<SavedExercise[]> {
    try {
      const { data, error } = await supabase
        .from('saved_exercises')
        .select('*')
        .order('created_at', { ascending: false });

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
    exerciseId: string;
    name: string;
    gifUrl?: string;
    target?: string;
    equipment?: string;
  }): Promise<SavedExercise | null> {
    try {
      const { data, error } = await supabase
        .from('saved_exercises')
        .insert({
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
        .eq('exerciseId', exerciseId);

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
        .eq('exerciseId', exerciseId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if exercise is saved:', error);
      return false;
    }
  }
}

export const supabaseSavedExerciseService = new SupabaseSavedExerciseService();
export default supabaseSavedExerciseService;
