
import React from 'react';
import { Exercise } from '@/services/exerciseService';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExerciseDetailProps {
  exercise: Exercise;
}

const ExerciseDetail: React.FC<ExerciseDetailProps> = ({ exercise }) => {
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
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
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
