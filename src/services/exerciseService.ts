
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

// Base API URL and options
const API_BASE_URL = 'https://exercisedb.p.rapidapi.com';
const API_OPTIONS = {
  headers: {
    'X-RapidAPI-Key': '75dc092df9msh20bd8756e7cfd9dp1fe7dcjsn786729797fb6',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

// Fetch all exercises (paginated)
export const fetchExercises = async (page = 1, limit = 10): Promise<Exercise[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises`, API_OPTIONS);
    const data = response.data || [];
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    toast.error('Failed to load exercises');
    
    // Return default exercises on error for better user experience
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
      }
    ];
  }
};

// Fetch all body parts
export const fetchAllBodyParts = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bodyPartList`, API_OPTIONS);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching body parts:', error);
    toast.error('Failed to load body parts');
    return ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"];
  }
};

// Fetch exercises by body part
export const fetchExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    if (!bodyPart) return await fetchExercises();
    
    const response = await axios.get(`${API_BASE_URL}/exercises/bodyPart/${bodyPart}`, API_OPTIONS);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching exercises for ${bodyPart}:`, error);
    toast.error(`Failed to load exercises for ${bodyPart}`);
    return [];
  }
};

// Fetch exercises by their IDs
export const fetchExercisesByIds = async (ids: string[]): Promise<Exercise[]> => {
  try {
    if (!ids.length) return [];
    
    // This API doesn't have a direct endpoint for fetching by IDs, so we'll fetch all and filter
    const allExercises = await fetchExercises(1, 300);
    return allExercises.filter(exercise => ids.includes(exercise.id));
  } catch (error) {
    console.error('Error fetching exercises by IDs:', error);
    toast.error('Failed to load saved exercises');
    return [];
  }
};

// Fetch exercises by muscle target
export const fetchExercisesByMuscle = async (muscle: string): Promise<Exercise[]> => {
  try {
    if (!muscle) return [];
    
    const response = await axios.get(`${API_BASE_URL}/exercises/target/${muscle}`, API_OPTIONS);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching exercises for muscle ${muscle}:`, error);
    toast.error(`Failed to load exercises for ${muscle}`);
    return [];
  }
};
