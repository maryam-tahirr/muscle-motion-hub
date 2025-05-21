
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

// Types
export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

// Fetch all body parts
export const fetchAllBodyParts = async (): Promise<string[]> => {
  try {
    const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', {
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY || 'your-rapid-api-key',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching body parts:', error);
    return ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
  }
};

// Fetch exercises by body part
export const fetchExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY || 'your-rapid-api-key',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
    toast.error('Failed to load exercises. Using sample data instead.');
    // Return sample data as fallback
    return getSampleExercises(bodyPart);
  }
};

// Fetch exercise by ID
export const fetchExerciseById = async (id: string): Promise<Exercise | null> => {
  try {
    const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, {
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY || 'your-rapid-api-key',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise with ID ${id}:`, error);
    return null;
  }
};

// Fetch multiple exercises by IDs
export const fetchExercisesByIds = async (ids: string[]): Promise<Exercise[]> => {
  if (!ids.length) return [];
  
  try {
    // Fetch all exercises (inefficient but API doesn't support bulk fetch by IDs)
    const exercises: Exercise[] = [];
    
    for (const id of ids) {
      const exercise = await fetchExerciseById(id);
      if (exercise) exercises.push(exercise);
    }
    
    return exercises;
  } catch (error) {
    console.error('Error fetching exercises by IDs:', error);
    return [];
  }
};

// Sample exercise data as fallback
function getSampleExercises(bodyPart: string): Exercise[] {
  const samples: Record<string, Exercise[]> = {
    back: [
      {
        id: "0007",
        name: "Bent Over Row",
        gifUrl: "https://via.placeholder.com/400x300?text=Bent+Over+Row",
        target: "lats",
        bodyPart: "back",
        equipment: "barbell",
        secondaryMuscles: ["biceps", "rhomboids"],
        instructions: ["Stand with feet shoulder-width apart", "Bend at the waist keeping back straight", "Grab barbell with overhand grip", "Pull barbell to lower chest", "Lower and repeat"]
      },
      {
        id: "0008",
        name: "Pull-up",
        gifUrl: "https://via.placeholder.com/400x300?text=Pull+Up",
        target: "lats",
        bodyPart: "back",
        equipment: "body weight",
        secondaryMuscles: ["biceps", "middle back"],
        instructions: ["Grab the pull-up bar with hands shoulder-width apart", "Hang with arms fully extended", "Pull yourself up until chin is over the bar", "Lower yourself until arms are fully extended"]
      }
    ],
    chest: [
      {
        id: "0001",
        name: "Bench Press",
        gifUrl: "https://via.placeholder.com/400x300?text=Bench+Press",
        target: "pectorals",
        bodyPart: "chest",
        equipment: "barbell",
        secondaryMuscles: ["triceps", "front delts"],
        instructions: ["Lie on bench with feet on ground", "Grip barbell slightly wider than shoulder width", "Lower bar to mid-chest", "Press bar up to starting position", "Repeat"]
      },
      {
        id: "0002",
        name: "Push-up",
        gifUrl: "https://via.placeholder.com/400x300?text=Push+Up",
        target: "pectorals",
        bodyPart: "chest",
        equipment: "body weight",
        secondaryMuscles: ["triceps", "shoulders"],
        instructions: ["Place hands slightly wider than shoulders", "Keep body in straight line from head to heels", "Lower chest to ground", "Push back up to starting position"]
      }
    ],
    "upper legs": [
      {
        id: "0003",
        name: "Squat",
        gifUrl: "https://via.placeholder.com/400x300?text=Squat",
        target: "quadriceps",
        bodyPart: "upper legs",
        equipment: "barbell",
        secondaryMuscles: ["glutes", "hamstrings"],
        instructions: ["Stand with feet shoulder-width apart", "Place barbell on upper back", "Bend knees and hips to lower", "Return to standing position"]
      },
      {
        id: "0004",
        name: "Leg Press",
        gifUrl: "https://via.placeholder.com/400x300?text=Leg+Press",
        target: "quadriceps",
        bodyPart: "upper legs",
        equipment: "machine",
        secondaryMuscles: ["glutes", "hamstrings"],
        instructions: ["Sit on leg press machine", "Place feet on platform hip-width apart", "Release safety and lower platform", "Push through heels to starting position"]
      }
    ]
  };
  
  // Return sample data for the requested body part, or a default if not found
  return samples[bodyPart] || samples.chest;
}
