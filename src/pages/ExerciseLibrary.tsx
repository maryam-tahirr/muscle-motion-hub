
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { fetchAllBodyParts, fetchExercisesByBodyPart, Exercise } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Search } from 'lucide-react';
import ExerciseDetail from '@/components/ExerciseDetail';

const ExerciseLibrary = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Fetch all body parts
  const { 
    data: bodyParts = [], 
    isLoading: isLoadingBodyParts 
  } = useQuery({
    queryKey: ['bodyParts'],
    queryFn: fetchAllBodyParts,
  });

  // Fetch exercises for selected body part
  const { 
    data: exercises = [], 
    isLoading: isLoadingExercises 
  } = useQuery({
    queryKey: ['exercises', selectedBodyPart],
    queryFn: () => fetchExercisesByBodyPart(selectedBodyPart),
    enabled: !!selectedBodyPart,
  });

  useEffect(() => {
    if (bodyParts.length > 0 && !selectedBodyPart) {
      setSelectedBodyPart(bodyParts[0]);
    }
  }, [bodyParts, selectedBodyPart]);

  // Filter exercises by search term
  const filteredExercises = exercises.filter(
    (exercise) => exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
            <p className="text-muted-foreground">
              Browse exercises by body part or search for specific exercises
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - Categories */}
            <div className="w-full md:w-64 shrink-0">
              <div className="sticky top-24">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search exercises..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Body Parts</h3>
                
                {isLoadingBodyParts ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {bodyParts.map((bodyPart) => (
                      <Button
                        key={bodyPart}
                        variant={selectedBodyPart === bodyPart ? "secondary" : "ghost"}
                        className="justify-start w-full font-normal"
                        onClick={() => setSelectedBodyPart(bodyPart)}
                      >
                        {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Exercises */}
            <div className="flex-1">
              {selectedExercise ? (
                <div className="mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedExercise(null)}
                    className="mb-4"
                  >
                    ← Back to exercises
                  </Button>
                  <ExerciseDetail exercise={selectedExercise} />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 capitalize">
                    {selectedBodyPart} Exercises
                  </h2>
                  
                  {isLoadingExercises ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredExercises.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "No exercises found matching your search."
                          : "No exercises found for this body part."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredExercises.map((exercise) => (
                        <Card 
                          key={exercise.id} 
                          className="overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                            <img 
                              src={exercise.gifUrl} 
                              alt={exercise.name} 
                              className="h-full w-full object-cover"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Save to favorites functionality would go here
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium line-clamp-1 capitalize">{exercise.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 capitalize">{exercise.target}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExerciseLibrary;
