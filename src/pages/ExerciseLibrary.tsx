
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { fetchAllBodyParts, fetchExercisesByBodyPart, Exercise } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import ExerciseDetail from '@/components/ExerciseDetail';
import SearchBar from '@/components/ExerciseLibrary/SearchBar';
import BodyPartList from '@/components/ExerciseLibrary/BodyPartList';
import ExerciseGrid from '@/components/ExerciseLibrary/ExerciseGrid';

const ExerciseLibrary = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'target' | 'equipment'>('name');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [savedExercises, setSavedExercises] = useState<string[]>([]);

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

  // Load saved exercises
  useEffect(() => {
    const savedIds = localStorage.getItem('savedExercises');
    if (savedIds) {
      setSavedExercises(JSON.parse(savedIds));
    }
  }, []);

  useEffect(() => {
    if (bodyParts.length > 0 && !selectedBodyPart) {
      setSelectedBodyPart(bodyParts[0]);
    }
  }, [bodyParts, selectedBodyPart]);

  const toggleSaveExercise = (e: React.MouseEvent, exercise: Exercise) => {
    e.stopPropagation();
    
    const savedIds = [...savedExercises];
    const exerciseIndex = savedIds.indexOf(exercise.id);
    
    if (exerciseIndex > -1) {
      savedIds.splice(exerciseIndex, 1);
      toast.success('Exercise removed from favorites');
    } else {
      savedIds.push(exercise.id);
      toast.success('Exercise saved to favorites');
    }
    
    localStorage.setItem('savedExercises', JSON.stringify(savedIds));
    setSavedExercises(savedIds);
  };

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
                  <SearchBar 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchType={searchType}
                    setSearchType={setSearchType}
                  />
                </div>
                
                <h3 className="font-medium mb-2">Body Parts</h3>
                <BodyPartList 
                  bodyParts={bodyParts}
                  selectedBodyPart={selectedBodyPart}
                  isLoading={isLoadingBodyParts}
                  onSelectBodyPart={setSelectedBodyPart}
                />
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
                  
                  <ExerciseGrid 
                    exercises={exercises}
                    searchTerm={searchTerm}
                    searchType={searchType}
                    isLoading={isLoadingExercises}
                    savedExercises={savedExercises}
                    onSelectExercise={setSelectedExercise}
                    onToggleSave={toggleSaveExercise}
                  />
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
