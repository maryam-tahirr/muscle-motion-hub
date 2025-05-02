
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { PlusCircle, Trash2, Save } from 'lucide-react';

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

const WorkoutBuilder = () => {
  const [workoutName, setWorkoutName] = useState("My Custom Workout");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([
    { id: "1", name: "Push-ups", sets: 3, reps: 12, rest: 60 },
    { id: "2", name: "Squats", sets: 4, reps: 15, rest: 90 }
  ]);

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: "New Exercise",
      sets: 3,
      reps: 10,
      rest: 60
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const updateExercise = (id: string, field: keyof WorkoutExercise, value: any) => {
    setExercises(
      exercises.map(exercise => 
        exercise.id === id ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const saveWorkout = () => {
    // In a real app, this would save to backend
    toast.success("Workout saved successfully!");
  };

  return (
    <Card className="bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/30 border-border">
      <CardHeader>
        <CardTitle>Workout Builder</CardTitle>
        <CardDescription>
          Create your custom workout routine by adding exercises, sets, and reps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input 
              id="workout-name" 
              value={workoutName} 
              onChange={e => setWorkoutName(e.target.value)}
              className="font-medium"
            />
          </div>
          
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="border border-border p-4 rounded-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-secondary w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Select
                      value={exercise.name}
                      onValueChange={(value) => updateExercise(exercise.id, "name", value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Push-ups">Push-ups</SelectItem>
                        <SelectItem value="Squats">Squats</SelectItem>
                        <SelectItem value="Lunges">Lunges</SelectItem>
                        <SelectItem value="Plank">Plank</SelectItem>
                        <SelectItem value="Bicep Curls">Bicep Curls</SelectItem>
                        <SelectItem value="Bench Press">Bench Press</SelectItem>
                        <SelectItem value="Pull-ups">Pull-ups</SelectItem>
                        <SelectItem value="Deadlifts">Deadlifts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor={`sets-${exercise.id}`} className="text-xs">Sets</Label>
                    <Input
                      id={`sets-${exercise.id}`}
                      type="number"
                      value={exercise.sets}
                      onChange={e => updateExercise(exercise.id, "sets", parseInt(e.target.value) || 1)}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`reps-${exercise.id}`} className="text-xs">Reps</Label>
                    <Input
                      id={`reps-${exercise.id}`}
                      type="number"
                      value={exercise.reps}
                      onChange={e => updateExercise(exercise.id, "reps", parseInt(e.target.value) || 1)}
                      min={1}
                      max={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`rest-${exercise.id}`} className="text-xs">Rest (sec)</Label>
                    <Input
                      id={`rest-${exercise.id}`}
                      type="number"
                      value={exercise.rest}
                      onChange={e => updateExercise(exercise.id, "rest", parseInt(e.target.value) || 10)}
                      min={10}
                      step={10}
                      max={300}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-1" 
              onClick={addExercise}
            >
              <PlusCircle className="h-4 w-4" />
              Add Exercise
            </Button>
          </div>
          
          <div className="pt-4">
            <Button className="w-full" onClick={saveWorkout}>
              <Save className="h-4 w-4 mr-2" />
              Save Workout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutBuilder;
