
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaleMuscleMap from './MaleMuscleMap';
import FemaleMuscleMap from './FemaleMuscleMap';
import ExerciseList from './ExerciseList';

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

const MuscleViewer = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const handleMuscleSelect = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
  };

  return (
    <div className="container mx-auto py-4">
      <Card className="bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/30 border-border">
        <CardContent className="p-6">
          <Tabs defaultValue="male" className="w-full" onValueChange={(value) => setGender(value as 'male' | 'female')}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Interactive Muscle Map</h2>
              <TabsList>
                <TabsTrigger value="male">Male</TabsTrigger>
                <TabsTrigger value="female">Female</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <TabsContent value="male" className="mt-0 w-full max-w-md">
                  <MaleMuscleMap selectedMuscle={selectedMuscle} onMuscleSelect={handleMuscleSelect} />
                </TabsContent>
                <TabsContent value="female" className="mt-0 w-full max-w-md">
                  <FemaleMuscleMap selectedMuscle={selectedMuscle} onMuscleSelect={handleMuscleSelect} />
                </TabsContent>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {selectedMuscle 
                    ? `${selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)} Exercises` 
                    : "Select a muscle group"}
                </h3>
                {selectedMuscle ? (
                  <ExerciseList muscleGroup={selectedMuscle} />
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
