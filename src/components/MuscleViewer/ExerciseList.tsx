
import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { fetchExercisesByBodyPart, Exercise } from '@/services/exerciseService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveExercise, removeSavedExercise } from '@/services/savedExerciseService';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import authService from '@/services/authService';

interface ExerciseListProps {
  selectedMuscle: string;
  onSelectExercise: (exercise: Exercise) => void;
  savedExercises: string[];
}

// Helper function to map muscle names to body parts
const mapMuscleToBodyPart = (muscleName: string): string => {
  const muscleMap: Record<string, string> = {
    // Upper body
    'chest': 'chest',
    'lats': 'back',
    'trapezius': 'back',
    'upper_back': 'back',
    'lower_back': 'back',
    'biceps': 'upper arms',
    'triceps': 'upper arms',
    'forearms': 'lower arms',
    'deltoids': 'shoulders',
    'rotator_cuffs': 'shoulders',
    
    // Lower body
    'quadriceps': 'upper legs',
    'hamstrings': 'upper legs',
    'glutes': 'upper legs',
    'adductors': 'upper legs',
    'calves': 'lower legs',
    
    // Core
    'abs': 'waist',
    'obliques': 'waist',
    'neck': 'neck',
    
    // Default if not found
    'default': 'chest',
  };

  return muscleMap[muscleName] || 'chest';
};

// Helper function to filter exercises by actual target muscle
const filterExercisesByMuscle = (exercises: Exercise[], muscleName: string): Exercise[] => {
  const muscleKey = muscleName.toLowerCase();
  
  // Direct match for target muscle
  const directMatches = exercises.filter(ex => 
    ex.target.toLowerCase().includes(muscleKey) || 
    (ex.secondaryMuscles && ex.secondaryMuscles.some(m => m.toLowerCase().includes(muscleKey)))
  );
  
  if (directMatches.length > 0) {
    return directMatches;
  }
  
  // If no direct matches, return all exercises for that body part
  return exercises;
};

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  selectedMuscle, 
  onSelectExercise,
  savedExercises
}) => {
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();
  const bodyPart = mapMuscleToBodyPart(selectedMuscle);
  
  // Fetch exercises for the body part
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises', bodyPart],
    queryFn: () => fetchExercisesByBodyPart(bodyPart),
  });
  
  // Filter exercises by muscle
  const filteredExercises = filterExercisesByMuscle(exercises, selectedMuscle);
  
  // Save exercise mutation
  const { mutate: saveExerciseMutation } = useMutation({
    mutationFn: (exercise: Exercise) => saveExercise({
      exerciseId: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      equipment: exercise.equipment
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedExercises'] });
    }
  });

  // Remove exercise mutation
  const { mutate: removeExerciseMutation } = useMutation({
    mutationFn: (exerciseId: string) => removeSavedExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedExercises'] });
    }
  });

  const handleToggleSave = (e: React.MouseEvent, exercise: Exercise) => {
    e.stopPropagation();
    
    if (isAuthenticated) {
      if (savedExercises.includes(exercise.id)) {
        removeExerciseMutation(exercise.id);
      } else {
        saveExerciseMutation(exercise);
      }
    } else {
      // Fallback to local storage if not authenticated
      try {
        const savedIdsStr = localStorage.getItem('savedExercises');
        let savedIds: string[] = [];
        
        try {
          savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
          if (!Array.isArray(savedIds)) savedIds = [];
        } catch (err) {
          console.error('Error parsing saved exercises:', err);
        }
        
        if (savedIds.includes(exercise.id)) {
          const newSavedIds = savedIds.filter(id => id !== exercise.id);
          localStorage.setItem('savedExercises', JSON.stringify(newSavedIds));
          queryClient.invalidateQueries({ queryKey: ['savedExercisesLocal'] });
        } else {
          savedIds.push(exercise.id);
          localStorage.setItem('savedExercises', JSON.stringify(savedIds));
          queryClient.invalidateQueries({ queryKey: ['savedExercisesLocal'] });
        }
      } catch (err) {
        console.error('Error saving exercise locally:', err);
      }
    }
  };
  
  if (isLoading) {
    return <div>Loading exercises...</div>;
  }
  
  if (filteredExercises.length === 0) {
    return <div>No exercises found for this muscle group.</div>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredExercises.map((exercise) => (
        <Card 
          key={exercise.id}
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectExercise(exercise)}
        >
          <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
            <img 
              src={exercise.gifUrl} 
              alt={exercise.name} 
              className="h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium capitalize">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{exercise.target}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={savedExercises.includes(exercise.id) ? 'text-red-500' : ''}
                onClick={(e) => handleToggleSave(e, exercise)}
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={savedExercises.includes(exercise.id) ? "currentColor" : "none"} 
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExerciseList;
