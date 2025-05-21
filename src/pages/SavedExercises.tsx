
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { fetchSavedExercises, removeSavedExercise, SavedExercise } from '@/services/savedExerciseService';
import { Exercise } from '@/services/exerciseService';
import ExerciseDetail from '@/components/ExerciseDetail';
import authService from '@/services/authService';

const SavedExercisesPage = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();
  
  // Fetch saved exercises
  const {
    data: savedExercises = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['savedExercises'],
    queryFn: fetchSavedExercises,
    enabled: isAuthenticated,
  });

  // Remove exercise mutation
  const { mutate: removeExercise } = useMutation({
    mutationFn: removeSavedExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedExercises'] });
    }
  });

  const handleRemoveExercise = (exerciseId: string) => {
    removeExercise(exerciseId);
  };

  // Convert SavedExercise to Exercise format for detail view
  const handleSelectExercise = (savedExercise: SavedExercise) => {
    const exercise: Exercise = {
      id: savedExercise.exerciseId,
      name: savedExercise.name,
      gifUrl: savedExercise.gifUrl,
      target: savedExercise.target,
      equipment: savedExercise.equipment,
      bodyPart: '',
      secondaryMuscles: [],
      instructions: []
    };
    setSelectedExercise(exercise);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-8">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to view your saved exercises
              </p>
              <Button asChild>
                <a href="/signin">Sign In</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold mb-2">Saved Exercises</h1>
            <p className="text-muted-foreground">
              View and manage your favorite exercises
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-500">
                {error instanceof Error ? error.message : 'An error occurred loading your saved exercises'}
              </p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['savedExercises'] })} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : savedExercises.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No saved exercises yet</h2>
              <p className="text-muted-foreground mb-6">
                Start saving your favorite exercises by clicking the heart icon
              </p>
              <Button asChild>
                <a href="/exercise-library">Browse Exercise Library</a>
              </Button>
            </div>
          ) : selectedExercise ? (
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedExercise(null)}
                className="mb-4"
              >
                ← Back to saved exercises
              </Button>
              <ExerciseDetail exercise={selectedExercise} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedExercises.map((exercise) => (
                <Card key={exercise._id} className="overflow-hidden">
                  <div className="h-48 bg-muted flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => handleSelectExercise(exercise)}>
                    <img 
                      src={exercise.gifUrl} 
                      alt={exercise.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium capitalize">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{exercise.target}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveExercise(exercise.exerciseId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedExercisesPage;
