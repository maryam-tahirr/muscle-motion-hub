
import { toast } from "@/components/ui/sonner";

// This would be stored securely in production
const API_KEY = "f571d44fd8msh4e0a581f5ce2f94p1965dajsn1dbe2a9f4bc4"; 
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

// Mock data to use when API is not available or quota is exceeded
const mockExercises: Exercise[] = [
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
    name: "dumbbell bicep curl",
    bodyPart: "upper arms",
    equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/A2gPNmlGOtkBhq",
    target: "biceps",
    secondaryMuscles: ["forearms"],
    instructions: [
      "Stand with a dumbbell in each hand, arms extended by your sides.",
      "Keep your elbows close to your torso.",
      "Curl the weights up to shoulder level while contracting your biceps.",
      "Lower the weights back down with controlled movement."
    ]
  },
  {
    id: "0003",
    name: "bodyweight squat",
    bodyPart: "upper legs",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/x86mm-eSZsj73H",
    target: "quads",
    secondaryMuscles: ["glutes", "hamstrings", "calves"],
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Bend your knees and lower your hips as if sitting in a chair.",
      "Keep your chest up and back straight.",
      "Lower until thighs are parallel to the ground, then push back up."
    ]
  },
  {
    id: "0004",
    name: "pull-up",
    bodyPart: "back",
    equipment: "body weight",
    gifUrl: "https://v2.exercisedb.io/image/4MMpQ4USEnKPcy",
    target: "lats",
    secondaryMuscles: ["biceps", "shoulders"],
    instructions: [
      "Hang from a pull-up bar with hands slightly wider than shoulder-width.",
      "Pull your body up until your chin is over the bar.",
      "Lower yourself back to the starting position with control.",
      "Repeat for desired number of repetitions."
    ]
  },
  {
    id: "0005",
    name: "seated shoulder press",
    bodyPart: "shoulders",
    equipment: "dumbbell",
    gifUrl: "https://v2.exercisedb.io/image/i9-KSOyJbUB9yy",
    target: "delts",
    secondaryMuscles: ["triceps", "traps"],
    instructions: [
      "Sit on a bench with back support.",
      "Hold a dumbbell in each hand at shoulder height.",
      "Press the weights upward until your arms are extended.",
      "Lower the weights back to shoulder level with control."
    ]
  }
];

// Mock body parts for when API is unavailable
const mockBodyParts = [
  "back", "cardio", "chest", "lower arms", "lower legs", 
  "neck", "shoulders", "upper arms", "upper legs", "waist"
];

export async function fetchExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
  try {
    // Compare with empty string instead of a specific placeholder
    if (!API_KEY || API_KEY === "") {
      console.warn("Using mock data as API key is not configured");
      return mockExercises.filter(ex => ex.bodyPart === bodyPart);
    }

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
      throw new Error(`Failed to fetch exercises: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    toast.error("Failed to load exercises. Using demo data instead.");
    return mockExercises.filter(ex => ex.bodyPart === bodyPart || bodyPart === "all");
  }
}

export async function fetchExercisesByMuscle(muscle: string): Promise<Exercise[]> {
  try {
    // Compare with empty string instead of a specific placeholder
    if (!API_KEY || API_KEY === "") {
      console.warn("Using mock data as API key is not configured");
      return mockExercises.filter(ex => ex.target === muscle);
    }

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
      throw new Error(`Failed to fetch exercises: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching exercises:", error);
    toast.error("Failed to load exercises. Using demo data instead.");
    return mockExercises.filter(ex => ex.target === muscle);
  }
}

export async function fetchExerciseById(id: string): Promise<Exercise | null> {
  try {
    // Compare with empty string instead of a specific placeholder
    if (!API_KEY || API_KEY === "") {
      console.warn("Using mock data as API key is not configured");
      return mockExercises.find(ex => ex.id === id) || null;
    }

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
    toast.error("Failed to load exercise details. Using demo data instead.");
    const foundExercise = mockExercises.find(ex => ex.id === id);
    return foundExercise || null;
  }
}

export async function fetchAllBodyParts(): Promise<string[]> {
  try {
    // Compare with empty string instead of a specific placeholder
    if (!API_KEY || API_KEY === "") {
      console.warn("Using mock data as API key is not configured");
      return mockBodyParts;
    }

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
    toast.error("Failed to load body parts. Using demo data instead.");
    return mockBodyParts;
  }
}

export { type Exercise };
