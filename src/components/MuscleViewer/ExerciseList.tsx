
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  imageUrl: string;
}

interface ExerciseListProps {
  muscleGroup: string;
}

// Mock data - in a real app this would come from an API
const mockExercises: Record<string, Exercise[]> = {
  chest: [
    {
      id: 1,
      name: 'Bench Press',
      description: 'A compound exercise that works the chest, shoulders, and triceps.',
      muscleGroup: 'chest',
      difficulty: 'intermediate',
      equipment: 'Barbell, Bench',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 2,
      name: 'Push-ups',
      description: 'A bodyweight exercise that targets the chest, shoulders, and triceps.',
      muscleGroup: 'chest',
      difficulty: 'beginner',
      equipment: 'None',
      imageUrl: '/placeholder.svg',
    },
  ],
  abs: [
    {
      id: 3,
      name: 'Crunches',
      description: 'A classic abdominal exercise targeting the rectus abdominis.',
      muscleGroup: 'abs',
      difficulty: 'beginner',
      equipment: 'None',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 4,
      name: 'Plank',
      description: 'An isometric core exercise that improves stability and strength.',
      muscleGroup: 'abs',
      difficulty: 'beginner',
      equipment: 'None',
      imageUrl: '/placeholder.svg',
    },
  ],
  biceps: [
    {
      id: 5,
      name: 'Bicep Curls',
      description: 'An isolation exercise that targets the biceps.',
      muscleGroup: 'biceps',
      difficulty: 'beginner',
      equipment: 'Dumbbells',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 6,
      name: 'Hammer Curls',
      description: 'A variation of bicep curls that also targets the brachialis and forearms.',
      muscleGroup: 'biceps',
      difficulty: 'beginner',
      equipment: 'Dumbbells',
      imageUrl: '/placeholder.svg',
    },
  ],
  quads: [
    {
      id: 7,
      name: 'Squats',
      description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
      muscleGroup: 'quads',
      difficulty: 'intermediate',
      equipment: 'Barbell (optional)',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 8,
      name: 'Leg Press',
      description: 'A machine-based exercise that targets the quadriceps, hamstrings, and glutes.',
      muscleGroup: 'quads',
      difficulty: 'beginner',
      equipment: 'Leg Press Machine',
      imageUrl: '/placeholder.svg',
    },
  ],
  shoulders: [
    {
      id: 9,
      name: 'Shoulder Press',
      description: 'A compound exercise that targets the deltoids and triceps.',
      muscleGroup: 'shoulders',
      difficulty: 'intermediate',
      equipment: 'Dumbbells or Barbell',
      imageUrl: '/placeholder.svg',
    },
    {
      id: 10,
      name: 'Lateral Raises',
      description: 'An isolation exercise that targets the lateral deltoids.',
      muscleGroup: 'shoulders',
      difficulty: 'beginner',
      equipment: 'Dumbbells',
      imageUrl: '/placeholder.svg',
    },
  ],
};

const ExerciseList: React.FC<ExerciseListProps> = ({ muscleGroup }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      setExercises(mockExercises[muscleGroup] || []);
      setLoading(false);
    }, 800);
  }, [muscleGroup]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (exercises.length === 0) {
    return <div className="text-center py-8">No exercises found for this muscle group.</div>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar pr-2">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="flex gap-4 p-3 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-all">
          <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={exercise.imageUrl} 
              alt={exercise.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium">{exercise.name}</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
            <div className="flex gap-2 items-center text-xs">
              <span className="px-2 py-0.5 bg-secondary rounded-full">{exercise.difficulty}</span>
              <span className="text-muted-foreground">{exercise.equipment}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
