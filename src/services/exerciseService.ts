
import { toast } from "@/components/ui/sonner";

// This would be stored securely in production
const API_KEY = "YOUR_EXERCISEDB_API_KEY"; 
const API_HOST = "exercisedb.p.rapidapi.com";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export async function fetchExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    toast.error("Failed to load exercises. Please try again later.");
    return [];
  }
}

export async function fetchExercisesByMuscle(muscle: string): Promise<Exercise[]> {
  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/target/${muscle}`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    toast.error("Failed to load exercises. Please try again later.");
    return [];
  }
}

export async function fetchExerciseById(id: string): Promise<Exercise | null> {
  try {
    const response = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercise details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    toast.error("Failed to load exercise details. Please try again later.");
    return null;
  }
}

export async function fetchAllBodyParts(): Promise<string[]> {
  try {
    const response = await fetch(
      "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch body parts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching body parts:", error);
    toast.error("Failed to load body parts. Please try again later.");
    return [];
  }
}

export { type Exercise };
