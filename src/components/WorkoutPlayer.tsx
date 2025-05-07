
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseSession, WorkoutSession, audioService } from "@/services/mongoDbService";
import { AlertCircle, CheckCircle, Play, Pause, SkipForward, X } from "lucide-react";

interface WorkoutPlayerProps {
  session: WorkoutSession;
  onComplete: (session: WorkoutSession) => void;
  onCancel: () => void;
}

const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ session, onComplete, onCancel }) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(session);
  const [timer, setTimer] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const getCurrentExercise = (): ExerciseSession | undefined => {
    return currentSession.exercises[currentSession.currentExerciseIndex];
  };

  const startTimer = () => {
    if (timerRef.current) return;
    
    timerRef.current = window.setInterval(() => {
      setTimer(prev => {
        // If we're resting and timer reaches 0, move to next exercise or next set
        const exercise = getCurrentExercise();
        if (exercise?.isResting && prev <= 1) {
          audioService.playRestComplete();
          nextAction();
          return 0;
        } 
        // If we're exercising, just count up
        return prev + 1;
      });
      
      setTotalElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setCurrentSession(prev => ({
      ...prev,
      isPaused: true
    }));
  };

  const resumeTimer = () => {
    startTimer();
    setCurrentSession(prev => ({
      ...prev,
      isPaused: false
    }));
  };

  const nextAction = () => {
    const exercise = getCurrentExercise();
    if (!exercise) return;

    // If we're resting, move to the next set or exercise
    if (exercise.isResting) {
      if (exercise.currentSet < exercise.totalSets) {
        // Move to the next set
        const updatedExercises = currentSession.exercises.map((ex, idx) => {
          if (idx === currentSession.currentExerciseIndex) {
            return {
              ...ex,
              currentSet: ex.currentSet + 1,
              isResting: false
            };
          }
          return ex;
        });

        setCurrentSession(prev => ({
          ...prev,
          exercises: updatedExercises
        }));

        // Play sound for starting next set
        audioService.playExerciseStart();
        setTimer(0);
      } else {
        // Move to the next exercise
        const nextExerciseIndex = currentSession.currentExerciseIndex + 1;
        
        if (nextExerciseIndex < currentSession.exercises.length) {
          setCurrentSession(prev => ({
            ...prev,
            currentExerciseIndex: nextExerciseIndex
          }));
          
          // Play sound for starting next exercise
          audioService.playExerciseStart();
          setTimer(0);
        } else {
          // Workout complete
          completeWorkout();
        }
      }
    } else {
      // We're exercising, now move to rest
      const updatedExercises = currentSession.exercises.map((ex, idx) => {
        if (idx === currentSession.currentExerciseIndex) {
          return {
            ...ex,
            isResting: true
          };
        }
        return ex;
      });

      setCurrentSession(prev => ({
        ...prev,
        exercises: updatedExercises
      }));

      // Play sound for starting rest
      audioService.playRestStart();
      setTimer(exercise.restTime);
    }
  };

  const skipExercise = () => {
    const nextExerciseIndex = currentSession.currentExerciseIndex + 1;
    
    if (nextExerciseIndex < currentSession.exercises.length) {
      setCurrentSession(prev => ({
        ...prev,
        currentExerciseIndex: nextExerciseIndex
      }));
      
      // Play sound for starting next exercise
      audioService.playExerciseStart();
      setTimer(0);
    } else {
      // Workout complete
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    audioService.playWorkoutComplete();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const completedSession: WorkoutSession = {
      ...currentSession,
      isCompleted: true,
      elapsedTime: totalElapsedTime
    };
    
    setCurrentSession(completedSession);
    onComplete(completedSession);
  };

  useEffect(() => {
    // Start timer when component mounts
    startTimer();
    
    // Play sound to indicate workout has started
    audioService.playExerciseStart();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const currentExercise = getCurrentExercise();
  if (!currentExercise) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalProgress = 
    ((currentSession.currentExerciseIndex / currentSession.exercises.length) * 100) +
    ((currentExercise.currentSet - 1) / (currentExercise.totalSets * currentSession.exercises.length) * 100);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{currentSession.name}</h2>
          <p className="text-muted-foreground">
            Exercise {currentSession.currentExerciseIndex + 1} of {currentSession.exercises.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{formatTime(totalElapsedTime)}</div>
          <p className="text-muted-foreground">Total Time</p>
        </div>
      </div>

      <Progress value={totalProgress} className="h-2" />

      <Card className="overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {currentExercise.exerciseId && (
            <img 
              src={`https://v2.exercisedb.io/image/${currentExercise.exerciseId}`}
              alt={currentExercise.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-semibold capitalize">{currentExercise.name}</h3>
              <p className="text-muted-foreground">
                Set {currentExercise.currentSet} of {currentExercise.totalSets} • {currentExercise.reps} reps
                {currentExercise.weight && ` • ${currentExercise.weight} kg`}
              </p>
            </div>
            {currentExercise.isResting ? (
              <div className="flex flex-col items-end">
                <span className="text-xl font-bold">{timer}s</span>
                <span className="text-sm text-muted-foreground">Rest Time</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{formatTime(timer)}</span>
                {currentExercise.isResting ? 
                  <AlertCircle className="text-yellow-500 h-5 w-5" /> : 
                  <CheckCircle className="text-green-500 h-5 w-5" />
                }
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {currentSession.isPaused ? (
              <Button onClick={resumeTimer} className="flex-1">
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" className="flex-1">
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}
            <Button onClick={nextAction} variant="default" className="flex-1">
              {currentExercise.isResting ? 'Skip Rest' : 'Completed Set'}
            </Button>
            <Button onClick={skipExercise} variant="secondary">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button onClick={onCancel} variant="ghost" className="text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <h4 className="font-medium mb-2">Instructions</h4>
        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
          <li>Keep proper form throughout the exercise</li>
          <li>Breathe out during the exertion phase</li>
          <li>Control the movement, avoid using momentum</li>
          <li>Complete all repetitions before resting</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkoutPlayer;
