
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

export interface SavedExercise {
  _id: string;
  userId: string;
  exerciseId: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  savedAt: string;
}

// Get all saved exercises for the current user
export const fetchSavedExercises = async (): Promise<SavedExercise[]> => {
  try {
    const response = await axios.get('/api/exercises/saved');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching saved exercises:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch saved exercises');
    return [];
  }
};

// Save an exercise
export const saveExercise = async (exercise: {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  target?: string;
  equipment?: string;
}): Promise<SavedExercise | null> => {
  try {
    const response = await axios.post('/api/exercises/saved', exercise);
    toast.success('Exercise saved successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error saving exercise:', error);
    toast.error(error.response?.data?.message || 'Failed to save exercise');
    return null;
  }
};

// Remove a saved exercise
export const removeSavedExercise = async (exerciseId: string): Promise<boolean> => {
  try {
    await axios.delete(`/api/exercises/saved/${exerciseId}`);
    toast.success('Exercise removed from saved');
    return true;
  } catch (error: any) {
    console.error('Error removing saved exercise:', error);
    toast.error(error.response?.data?.message || 'Failed to remove exercise');
    return false;
  }
};
