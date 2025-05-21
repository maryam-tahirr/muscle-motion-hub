
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Exercise } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { saveExercise, removeSavedExercise } from '@/services/savedExerciseService';
import authService from '@/services/authService';

interface ExerciseDetailProps {
  exercise: Exercise;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise }) => {
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();

  // Save exercise mutation
  const { mutate: saveExerciseMutation } = useMutation({
    mutationFn: () => saveExercise({
      exerciseId: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      target: exercise.target,
      equipment: exercise.equipment
    }),
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['savedExercises'] });
    }
  });

  // Remove exercise mutation
  const { mutate: removeExerciseMutation } = useMutation({
    mutationFn: () => removeSavedExercise(exercise.id),
    onSuccess: () => {
      setIsSaved(false);
      queryClient.invalidateQueries({ queryKey: ['savedExercises'] });
    }
  });

  // Check if exercise is saved
  useEffect(() => {
    try {
      // If using backend authentication, we'll rely on that
      if (isAuthenticated) {
        // We'll set this based on the saved exercises returned from the backend
        // This will be handled in the parent component or via a query
        const savedIdsStr = localStorage.getItem('savedExercises');
        const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
        setIsSaved(Array.isArray(savedIds) && savedIds.includes(exercise.id));
      } else {
        // Fallback to local storage when not authenticated
        const savedIdsStr = localStorage.getItem('savedExercises');
        const savedIds = savedIdsStr ? JSON.parse(savedIdsStr) : [];
        setIsSaved(Array.isArray(savedIds) && savedIds.includes(exercise.id));
      }
    } catch (err) {
      console.error('Error checking saved status:', err);
      setIsSaved(false);
    }
  }, [exercise.id, isAuthenticated]);

  const toggleSave = () => {
    if (isAuthenticated) {
      if (isSaved) {
        removeExerciseMutation();
      } else {
        saveExerciseMutation();
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
          savedIds = savedIds.filter(id => id !== exercise.id);
          toast.success('Exercise removed from favorites');
          setIsSaved(false);
        } else {
          savedIds.push(exercise.id);
          toast.success('Exercise saved to favorites');
          setIsSaved(true);
        }
        
        localStorage.setItem('savedExercises', JSON.stringify(savedIds));
      } catch (err) {
        console.error('Error toggling save status:', err);
        toast.error('Failed to update favorites');
      }
    }
  };

  const shareExercise = () => {
    if (navigator.share) {
      navigator.share({
        title: exercise.name,
        text: `Check out this exercise: ${exercise.name}`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support sharing
      toast.success('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 h-[300px] md:h-[400px] bg-muted flex items-center justify-center">
          <img 
            src={exercise.gifUrl} 
            alt={exercise.name} 
            className="h-full w-full object-contain"
          />
        </div>
        
        <div className="p-6 md:w-1/2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold capitalize">{exercise.name}</h1>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={isSaved ? 'text-red-500' : ''}
                onClick={toggleSave}
              >
                <Heart className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
              </Button>
              <Button variant="ghost" size="icon" onClick={shareExercise}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Target Muscle</h3>
              <Badge variant="secondary" className="capitalize">{exercise.target}</Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Equipment</h3>
              <Badge variant="outline" className="capitalize">{exercise.equipment}</Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Secondary Muscles</h3>
              <div className="flex flex-wrap gap-1">
                {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? (
                  exercise.secondaryMuscles.map((muscle, index) => (
                    <Badge key={index} variant="outline" className="capitalize">{muscle}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Instructions</h3>
              {exercise.instructions && exercise.instructions.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">No instructions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
