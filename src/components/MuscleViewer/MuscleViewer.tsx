
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import MaleMuscleMap from './MaleMuscleMap';
import FemaleMuscleMap from './FemaleMuscleMap';
import ExerciseList from './ExerciseList';
import { Dumbbell } from 'lucide-react';
import { Exercise } from '@/services/exerciseService';
import { useQuery } from '@tanstack/react-query';
import authService from '@/services/authService';

type MuscleGroup = 
  | 'chest' 
  | 'abs' 
  | 'quads' 
  | 'biceps' 
  | 'forearms' 
  | 'calves' 
  | 'shoulders' 
  | 'back' 
  | 'triceps' 
  | 'glutes' 
  | 'hamstrings' 
  | null;

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
type EquipmentType = 'bodyweight' | 'dumbbell' | 'barbell' | 'machine' | 'all';

const MuscleViewer = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('all');
  const [equipment, setEquipment] = useState<EquipmentType>('all');
  const [showAnimations, setShowAnimations] = useState<boolean>(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);
  
  const isAuthenticated = authService.isAuthenticated();
  
  // Load saved exercises from localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const savedIds = localStorage.getItem('savedExercises');
      if (savedIds) {
        try {
          const parsedIds = JSON.parse(savedIds);
          if (Array.isArray(parsedIds)) {
            setSavedExercises(parsedIds);
          }
        } catch (err) {
          console.error('Error parsing saved exercises:', err);
        }
      }
    }
  }, [isAuthenticated]);

  // Fetch saved exercises for authenticated users
  const { data: userSavedExercises = [] } = useQuery({
    queryKey: ['savedExercises'],
    queryFn: async () => {
      // This will be implemented when we set up the Supabase tables
      return [];
    },
    enabled: isAuthenticated,
  });

  // Use appropriate saved exercises based on auth status
  const currentSavedExercises = isAuthenticated ? userSavedExercises : savedExercises;
  
  const handleMuscleSelect = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="container mx-auto py-4">
      <Card className="bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/30 border-border">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Interactive Muscle Map</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-animations" className="cursor-pointer mr-2">Show animations</Label>
                <Switch 
                  id="show-animations" 
                  checked={showAnimations}
                  onCheckedChange={setShowAnimations}
                />
              </div>
              
              <div>
                <Label className="mb-1.5 block">Filter by difficulty</Label>
                <ToggleGroup 
                  type="single" 
                  value={difficulty}
                  onValueChange={(value) => value && setDifficulty(value as DifficultyLevel)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                  <ToggleGroupItem value="beginner">Beginner</ToggleGroupItem>
                  <ToggleGroupItem value="intermediate">Intermediate</ToggleGroupItem>
                  <ToggleGroupItem value="advanced">Advanced</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <Label className="mb-1.5 block">Filter by equipment</Label>
                <ToggleGroup 
                  type="single"
                  value={equipment}
                  onValueChange={(value) => value && setEquipment(value as EquipmentType)}
                  className="justify-start"
                >
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                  <ToggleGroupItem value="bodyweight">Bodyweight</ToggleGroupItem>
                  <ToggleGroupItem value="dumbbell">Dumbbell</ToggleGroupItem>
                  <ToggleGroupItem value="barbell">Barbell</ToggleGroupItem>
                  <ToggleGroupItem value="machine">Machine</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <Tabs defaultValue="male" className="w-full" onValueChange={(value) => setGender(value as 'male' | 'female')}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="male">Male</TabsTrigger>
                <TabsTrigger value="female">Female</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <TabsContent value="male" className="mt-0 w-full max-w-md">
                    <MaleMuscleMap selectedMuscle={selectedMuscle} onMuscleSelect={handleMuscleSelect} />
                  </TabsContent>
                  <TabsContent value="female" className="mt-0 w-full max-w-md">
                    <FemaleMuscleMap selectedMuscle={selectedMuscle} onMuscleSelect={handleMuscleSelect} />
                  </TabsContent>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  Click on a muscle group to see targeted exercises
                </div>
              </div>

              <div>
                <div className="bg-muted/10 p-4 rounded-lg border border-border mb-4">
                  {selectedMuscle ? (
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold capitalize">
                        {selectedMuscle} Exercises
                      </h3>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/exercise-library" target="_blank">
                          <Dumbbell className="h-4 w-4 mr-1" /> More exercises
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <h3 className="text-xl font-semibold">Select a muscle group</h3>
                  )}
                </div>
                
                {selectedMuscle ? (
                  <ExerciseList 
                    selectedMuscle={selectedMuscle} 
                    onSelectExercise={handleSelectExercise}
                    savedExercises={currentSavedExercises}
                  />
                ) : (
                  <div className="text-muted-foreground text-center py-12">
                    Click on a muscle group to view exercises
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MuscleViewer;
