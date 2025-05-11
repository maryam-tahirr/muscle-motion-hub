
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

// Define the Exercise interface
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

// Fetch all exercises (paginated)
export const fetchExercises = async (page = 1, limit = 10): Promise<Exercise[]> => {
  try {
    // This would be a real API call in a production app
    // For now, returning mock data
    return [
      {
        id: "0001",
        name: "barbell bench press",
        bodyPart: "chest",
        equipment: "barbell",
        gifUrl: "https://v2.exercisedb.io/image/QU4rCpbb5pPmQS",
        target: "pectorals",
        secondaryMuscles: ["triceps", "shoulders"],
        instructions: [
          "Lie on a flat bench with your feet flat on the floor.",
          "Grip the barbell slightly wider than shoulder-width.",
          "Lower the barbell to your mid-chest.",
          "Press the barbell back to the starting position."
        ]
      },
      {
        id: "0002",
        name: "pull-up",
        bodyPart: "back",
        equipment: "body weight",
        gifUrl: "https://v2.exercisedb.io/image/91C0f77aR63E9B",
        target: "lats",
        secondaryMuscles: ["biceps", "forearms"],
        instructions: [
          "Hang from a pull-up bar with palms facing away from you.",
          "Pull your body up until your chin is over the bar.",
          "Lower yourself back to the starting position."
        ]
      },
      // Add more exercises as needed
    ];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    toast.error('Failed to load exercises');
    return [];
  }
};

// Fetch all body parts
export const fetchAllBodyParts = async (): Promise<string[]> => {
  try {
    // This would be a real API call in a production app
    return ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"];
  } catch (error) {
    console.error('Error fetching body parts:', error);
    toast.error('Failed to load body parts');
    return [];
  }
};

// Fetch exercises by body part
export const fetchExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    // This would be a real API call in a production app
    return await fetchExercises(); // For demo, just return all exercises
  } catch (error) {
    console.error(`Error fetching exercises for ${bodyPart}:`, error);
    toast.error(`Failed to load exercises for ${bodyPart}`);
    return [];
  }
};

// Fetch exercises by their IDs
export const fetchExercisesByIds = async (ids: string[]): Promise<Exercise[]> => {
  try {
    // This would be a real API call in a production app
    // For now, we'll filter from mock data
    const allExercises = await fetchExercises(1, 100);
    return allExercises.filter(exercise => ids.includes(exercise.id));
  } catch (error) {
    console.error('Error fetching exercises by IDs:', error);
    toast.error('Failed to load saved exercises');
    return [];
  }
};
