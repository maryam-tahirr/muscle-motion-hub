
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { Exercise } from '@/services/exerciseService';

// In a real app, this would be stored in a database
const getSavedExercises = async (): Promise<Exercise[]> => {
  // This would be a real API call in a production app
  const savedIdsStr = localStorage.getItem('savedExercises');
  if (!savedIdsStr) return [];
  
  const savedIds = JSON.parse(savedIdsStr);
  
  // For demo purposes, return mock exercises
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
    }
  ];
};

const SavedExercises = () => {
  const { data: savedExercises = [], isLoading, refetch } = useQuery({
    queryKey: ['savedExercises'],
    queryFn: getSavedExercises
  });

  const removeFromSaved = (id: string) => {
    // In a real app, this would make an API call
    const savedIdsStr = localStorage.getItem('savedExercises');
    if (!savedIdsStr) return;
    
    const savedIds = JSON.parse(savedIdsStr);
    const updatedIds = savedIds.filter((savedId: string) => savedId !== id);
    
    localStorage.setItem('savedExercises', JSON.stringify(updatedIds));
    toast.success('Exercise removed from favorites');
    refetch();
  };

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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
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
                        onClick={() => removeFromSaved(exercise.id)}
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

export default SavedExercises;
