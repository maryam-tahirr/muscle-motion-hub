
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { fetchAllBodyParts, fetchExercisesByBodyPart, Exercise } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Trash2, Play, Pause, Clock, X } from 'lucide-react';

type WorkoutExercise = {
  exercise: Exercise;
  duration: number;
};

const WorkoutBuilder = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'target' | 'equipment'>('name');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);
  const [savedIdsMap, setSavedIdsMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('search');
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [isRunningWorkout, setIsRunningWorkout] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const whistleRef = useRef<HTMLAudioElement | null>(null);
  
  // Fetch all body parts
  const { data: bodyParts = [], isLoading: isLoadingBodyParts } = useQuery({
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

  // Set the first body part as selected when data loads
  useEffect(() => {
    if (bodyParts.length > 0 && !selectedBodyPart) {
      setSelectedBodyPart(bodyParts[0]);
    }
  }, [bodyParts, selectedBodyPart]);

  // Load saved exercises
  useEffect(() => {
    const loadSavedExercises = async () => {
      try {
        const savedIdsStr = localStorage.getItem('savedExercises');
        if (!savedIdsStr) return;
        
        const savedIds = JSON.parse(savedIdsStr);
        // Create a map for quick lookups
        const idsMap: Record<string, boolean> = {};
        savedIds.forEach((id: string) => {
          idsMap[id] = true;
        });
        setSavedIdsMap(idsMap);
        
        // Use mock data for this example - in a real app you'd fetch from API
        // Here we filter from available exercises
        const allExercises = exercises.filter(ex => savedIds.includes(ex.id));
        setSavedExercises(allExercises);
      } catch (err) {
        console.error("Failed to load saved exercises:", err);
      }
    };
    
    loadSavedExercises();
  }, [exercises]);

  // Advanced filtering
  const filteredExercises = exercises.filter(exercise => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch(searchType) {
      case 'name':
        return exercise.name.toLowerCase().includes(searchLower);
      case 'target':
        return exercise.target.toLowerCase().includes(searchLower);
      case 'equipment':
        return exercise.equipment.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  // Handle adding exercise to workout
  const addExerciseToWorkout = (exercise: Exercise) => {
    setWorkoutExercises([...workoutExercises, { exercise, duration: 45 }]);
  };

  // Handle removing exercise from workout
  const removeExerciseFromWorkout = (index: number) => {
    const updatedWorkout = [...workoutExercises];
    updatedWorkout.splice(index, 1);
    setWorkoutExercises(updatedWorkout);
  };

  // Update exercise duration
  const updateExerciseDuration = (index: number, duration: number) => {
    const updatedWorkout = [...workoutExercises];
    updatedWorkout[index].duration = duration;
    setWorkoutExercises(updatedWorkout);
  };

  // Start workout
  const startWorkout = () => {
    if (workoutExercises.length === 0) return;
    
    setIsRunningWorkout(true);
    setCurrentExerciseIndex(0);
    setTimeRemaining(workoutExercises[0].duration);
    setIsPaused(false);
  };

  // Pause/resume workout
  const togglePauseWorkout = () => {
    setIsPaused(prev => !prev);
  };
  
  // Stop workout
  const stopWorkout = () => {
    setIsRunningWorkout(false);
    setCurrentExerciseIndex(0);
    setTimeRemaining(0);
    setIsPaused(false);
  };

  // Timer effect
  useEffect(() => {
    if (!isRunningWorkout || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Play whistle when time is up
          if (whistleRef.current) {
            whistleRef.current.play().catch(e => console.error("Failed to play audio:", e));
          }
          
          // Move to next exercise
          if (currentExerciseIndex < workoutExercises.length - 1) {
            setCurrentExerciseIndex(prevIndex => {
              const nextIndex = prevIndex + 1;
              return nextIndex;
            });
            return workoutExercises[currentExerciseIndex + 1].duration;
          } else {
            // Workout complete
            clearInterval(interval);
            setIsRunningWorkout(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunningWorkout, isPaused, currentExerciseIndex, workoutExercises]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate total workout time
  const totalWorkoutTime = workoutExercises.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Audio element for whistle sound */}
      <audio ref={whistleRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold mb-2">Custom Workout Builder</h1>
            <p className="text-muted-foreground">
              Create your own custom workout by adding exercises and setting durations
            </p>
          </div>
          
          {isRunningWorkout ? (
            <div className="max-w-lg mx-auto">
              <Card className="bg-card/95 backdrop-blur">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {currentExerciseIndex + 1}/{workoutExercises.length}: {workoutExercises[currentExerciseIndex].exercise.name}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    Target: {workoutExercises[currentExerciseIndex].exercise.target}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Exercise GIF */}
                  <div className="relative h-64 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={workoutExercises[currentExerciseIndex].exercise.gifUrl} 
                      alt={workoutExercises[currentExerciseIndex].exercise.name} 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  
                  {/* Timer */}
                  <div className="text-center">
                    <div className="text-4xl font-bold">{formatTime(timeRemaining)}</div>
                    <p className="text-muted-foreground mt-1">Time remaining</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={togglePauseWorkout}
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={stopWorkout}
                  >
                    End Workout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left panel: Exercise selection */}
              <div className="col-span-1 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Exercises</CardTitle>
                    <CardDescription>Search or choose from your saved exercises</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
                        <TabsTrigger value="saved" className="flex-1">Saved Exercises</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="search">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="search"
                                placeholder="Search exercises..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            
                            <Tabs defaultValue="name" className="w-full sm:w-auto" onValueChange={(value) => setSearchType(value as any)}>
                              <TabsList>
                                <TabsTrigger value="name">Name</TabsTrigger>
                                <TabsTrigger value="target">Muscle</TabsTrigger>
                                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {bodyParts.map((bodyPart) => (
                              <Button
                                key={bodyPart}
                                variant={selectedBodyPart === bodyPart ? "secondary" : "outline"}
                                size="sm"
                                onClick={() => setSelectedBodyPart(bodyPart)}
                              >
                                {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                              </Button>
                            ))}
                          </div>
                          
                          {isLoadingExercises ? (
                            <div className="text-center py-8">Loading exercises...</div>
                          ) : filteredExercises.length === 0 ? (
                            <div className="text-center py-8">No exercises found matching your search.</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {filteredExercises.slice(0, 9).map((exercise) => (
                                <Card 
                                  key={exercise.id} 
                                  className="overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                                >
                                  <div className="relative h-36 bg-muted flex items-center justify-center overflow-hidden">
                                    <img 
                                      src={exercise.gifUrl} 
                                      alt={exercise.name} 
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                                      <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={() => setDetailExercise(exercise)}
                                      >
                                        View
                                      </Button>
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={() => addExerciseToWorkout(exercise)}
                                      >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                      </Button>
                                    </div>
                                  </div>
                                  <CardContent className="p-3">
                                    <h3 className="font-medium line-clamp-1 text-sm capitalize">{exercise.name}</h3>
                                    <p className="text-xs text-muted-foreground capitalize">{exercise.target}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="saved">
                        {savedExercises.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">You haven't saved any exercises yet.</p>
                            <Button asChild>
                              <a href="/exercise-library">Browse Exercise Library</a>
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {savedExercises.map((exercise) => (
                              <Card 
                                key={exercise.id} 
                                className="overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                              >
                                <div className="relative h-36 bg-muted flex items-center justify-center overflow-hidden">
                                  <img 
                                    src={exercise.gifUrl} 
                                    alt={exercise.name} 
                                    className="h-full w-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 hover:opacity-100 transition-opacity">
                                    <Button 
                                      variant="secondary" 
                                      size="sm"
                                      onClick={() => setDetailExercise(exercise)}
                                    >
                                      View
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => addExerciseToWorkout(exercise)}
                                    >
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                                <CardContent className="p-3">
                                  <h3 className="font-medium line-clamp-1 text-sm capitalize">{exercise.name}</h3>
                                  <p className="text-xs text-muted-foreground capitalize">{exercise.target}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right panel: Workout plan */}
              <div className="col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Workout</CardTitle>
                    <CardDescription>
                      {workoutExercises.length} exercises • {formatTime(totalWorkoutTime)} total
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {workoutExercises.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="font-medium">No exercises yet</p>
                        <p className="text-muted-foreground mt-1">
                          Add exercises from the left panel
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {workoutExercises.map((item, index) => (
                          <Card key={index} className="bg-card/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                    <img 
                                      src={item.exercise.gifUrl} 
                                      alt={item.exercise.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm capitalize line-clamp-1">{item.exercise.name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">{formatTime(item.duration)}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                  onClick={() => removeExerciseFromWorkout(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Duration</span>
                                  <span>{formatTime(item.duration)}</span>
                                </div>
                                <Slider
                                  defaultValue={[item.duration]}
                                  min={10}
                                  max={300}
                                  step={5}
                                  onValueChange={(value) => updateExerciseDuration(index, value[0])}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={workoutExercises.length === 0}
                      onClick={startWorkout}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Exercise Detail Dialog */}
      <Dialog open={!!detailExercise} onOpenChange={() => setDetailExercise(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="capitalize">{detailExercise?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-muted rounded-md h-64 flex items-center justify-center overflow-hidden">
                {detailExercise && (
                  <img 
                    src={detailExercise.gifUrl} 
                    alt={detailExercise.name} 
                    className="h-full object-contain"
                  />
                )}
              </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="font-medium">Target Muscle</h4>
                  <Badge variant="secondary" className="mt-1 capitalize">{detailExercise?.target}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium">Equipment</h4>
                  <Badge variant="outline" className="mt-1 capitalize">{detailExercise?.equipment}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium">Secondary Muscles</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailExercise?.secondaryMuscles?.map((muscle, i) => (
                      <Badge key={i} variant="outline" className="capitalize">{muscle}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              {detailExercise?.instructions?.length ? (
                <ol className="list-decimal list-inside space-y-2">
                  {detailExercise.instructions.map((step, i) => (
                    <li key={i} className="text-sm">{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No detailed instructions available.</p>
              )}
              
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (detailExercise) {
                      addExerciseToWorkout(detailExercise);
                      setDetailExercise(null);
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Workout
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutBuilder;
