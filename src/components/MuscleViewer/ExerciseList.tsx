import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchExercisesByMuscle, Exercise } from '@/services/exerciseService'; 
import { Heart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';

interface ExerciseListProps {
  muscleGroup: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  equipment?: 'bodyweight' | 'dumbbell' | 'barbell' | 'machine' | 'all';
  showAnimations?: boolean;
}

// Map our muscle groups to ExerciseDB target muscles
const muscleGroupToTargetMap: Record<string, string> = {
  'chest': 'pectorals',
  'abs': 'abs',
  'quads': 'quads',
  'biceps': 'biceps',
  'forearms': 'forearms',
  'calves': 'calves',
  'shoulders': 'delts',
  'back': 'lats',
  'triceps': 'triceps',
  'glutes': 'glutes',
  'hamstrings': 'hamstrings'
};

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  muscleGroup, 
  difficulty = 'all',
  equipment = 'all',
  showAnimations = true 
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);
  
  // Convert our muscle group to the ExerciseDB target
  const targetMuscle = muscleGroupToTargetMap[muscleGroup] || muscleGroup;
  
  // Fetch exercises from API
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['muscleExercises', targetMuscle],
    queryFn: () => fetchExercisesByMuscle(targetMuscle),
  });

  // Load saved exercises from localStorage
  useEffect(() => {
    const savedIdsStr = localStorage.getItem('savedExercises');
    if (savedIdsStr) {
      try {
        const saved = JSON.parse(savedIdsStr);
        setSavedExercises(Array.isArray(saved) ? saved : []);
      } catch (err) {
        console.error('Error parsing saved exercises:', err);
        setSavedExercises([]);
        localStorage.setItem('savedExercises', JSON.stringify([]));
      }
    }
  }, []);
  
  // Filter exercises based on difficulty and equipment
  const filteredExercises = exercises.filter(exercise => {
    // Simple filtering logic based on equipment names
    if (equipment !== 'all') {
      if (!exercise.equipment.toLowerCase().includes(equipment)) {
        return false;
      }
    }
    
    // Note: ExerciseDB doesn't have difficulty levels, so this is just a placeholder
    // In a real app, you'd need to add this data or get it from another source
    const exerciseDifficulty = 
      exercise.name.includes('advanced') ? 'advanced' : 
      exercise.name.includes('beginner') ? 'beginner' : 'intermediate';
    
    if (difficulty !== 'all' && exerciseDifficulty !== difficulty) {
      return false;
    }
    
    return true;
  });

  const toggleSaveExercise = (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    
    const savedIdsStr = localStorage.getItem('savedExercises');
    let savedIds: string[] = [];
    
    try {
      savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
      if (!Array.isArray(savedIds)) savedIds = [];
    } catch (err) {
      console.error('Error parsing saved exercises:', err);
    }
    
    if (savedIds.includes(exerciseId)) {
      savedIds = savedIds.filter(id => id !== exerciseId);
      toast.success('Exercise removed from favorites');
    } else {
      savedIds.push(exerciseId);
      toast.success('Exercise saved to favorites');
    }
    
    localStorage.setItem('savedExercises', JSON.stringify(savedIds));
    setSavedExercises(savedIds);
  };

  const isExerciseSaved = (id: string) => {
    return savedExercises.includes(id);
  };

  if (isLoading) {
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

  if (filteredExercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No exercises found matching your filters.</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-2"
          onClick={() => window.location.href = '/exercise-library'}
        >
          Browse all exercises
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar pr-2">
        {filteredExercises.slice(0, 6).map((exercise) => (
          <div 
            key={exercise.id} 
            className="flex gap-4 p-3 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => setSelectedExercise(exercise)}
          >
            <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {showAnimations ? (
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <span className="text-4xl">{exercise.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium capitalize">{exercise.name}</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-6 w-6 ${isExerciseSaved(exercise.id) ? 'text-red-500' : ''}`}
                  onClick={(e) => toggleSaveExercise(e, exercise.id)}
                >
                  <Heart className="h-4 w-4" fill={isExerciseSaved(exercise.id) ? "currentColor" : "none"} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 capitalize">
                Target: {exercise.target}
              </p>
              <div className="flex gap-2 items-center text-xs">
                <Badge variant="secondary" className="capitalize">{exercise.equipment}</Badge>
              </div>
            </div>
          </div>
        ))}
        
        {filteredExercises.length > 6 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/exercise-library'}
          >
            View all {filteredExercises.length} exercises
          </Button>
        )}
      </div>
      
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">{selectedExercise?.name}</DialogTitle>
            <DialogDescription className="capitalize">
              Target Muscle: {selectedExercise?.target}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div className="bg-muted rounded-md h-64 flex items-center justify-center overflow-hidden">
                {selectedExercise && (
                  <img 
                    src={selectedExercise.gifUrl} 
                    alt={selectedExercise.name} 
                    className="h-full object-contain"
                  />
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <div>
                  <h4 className="font-medium">Equipment</h4>
                  <p className="text-muted-foreground capitalize">{selectedExercise?.equipment}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Secondary Muscles</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExercise?.secondaryMuscles?.map((muscle, i) => (
                      <Badge key={i} variant="outline" className="capitalize">{muscle}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h4 className="font-medium mb-2">Instructions</h4>
              {selectedExercise?.instructions?.length ? (
                <ol className="list-decimal list-inside space-y-2">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i} className="text-sm">{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No detailed instructions available.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            {selectedExercise && (
              <Button 
                variant="ghost" 
                size="icon"
                className={isExerciseSaved(selectedExercise.id) ? 'text-red-500' : ''}
                onClick={(e) => toggleSaveExercise(e, selectedExercise.id)}
              >
                <Heart 
                  className="h-5 w-5" 
                  fill={isExerciseSaved(selectedExercise.id) ? "currentColor" : "none"} 
                />
              </Button>
            )}
            <Button onClick={() => setSelectedExercise(null)}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseList;
