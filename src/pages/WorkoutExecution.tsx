
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import WorkoutPlayer from '@/components/WorkoutPlayer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { workoutApi, WorkoutSession, ExerciseSession } from '@/services/mongoDbService';
import { ChevronLeft, Clock, Dumbbell, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const WorkoutExecution = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Fetch workout data
  const { data: workout, isLoading, error } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => id ? workoutApi.getWorkoutById(id) : Promise.reject('No workout ID provided'),
    enabled: !!id,
  });

  useEffect(() => {
    if (workout && !workoutSession) {
      // Prepare workout session when workout data is loaded
      const exercises: ExerciseSession[] = workout.exercises.map(ex => ({
        exerciseId: ex.exercise.id,
        name: ex.exercise.name,
        currentSet: 1,
        totalSets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        restTime: workout.restBetweenExercises || 60,
        isResting: false,
        completed: false
      }));

      // Create a session ID (this would normally come from the backend)
      const sessionId = `session_${Date.now()}`;

      setWorkoutSession({
        sessionId,
        workoutId: workout._id || 'local',
        name: workout.name,
        startTime: new Date(),
        exercises,
        currentExerciseIndex: 0,
        isCompleted: false,
        isPaused: false,
        totalTime: calculateTotalTime(exercises, workout.restBetweenExercises || 60),
        elapsedTime: 0
      });
    }
  }, [workout]);

  const calculateTotalTime = (exercises: ExerciseSession[], restTime: number): number => {
    // This is an estimate - 45 seconds per set plus rest time
    return exercises.reduce((total, ex) => {
      return total + (ex.totalSets * 45) + ((ex.totalSets - 1) * restTime);
    }, 0);
  };

  const handleWorkoutComplete = async (session: WorkoutSession) => {
    setShowSummary(true);
    setWorkoutSession(session);

    // In a real app, you would send this data to your MongoDB API
    try {
      if (session.workoutId !== 'local') {
        await workoutApi.completeWorkoutSession(session.sessionId, {
          completed: true,
          duration: session.elapsedTime,
          exercises: session.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            completed: ex.currentSet >= ex.totalSets,
            performance: 'completed'
          }))
        });
      }
      toast.success('Workout completed and saved to your history!');
    } catch (error) {
      console.error('Error saving workout session:', error);
      toast.error('Could not save workout results to the server');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this workout?')) {
      navigate(-1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-8">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="py-4">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-72 w-full rounded-lg mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-8 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Could not load workout</h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading the workout. Please try again.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                <RotateCcw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!workoutSession) {
    return null; // Still preparing session
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-3xl px-4">
          {showSummary ? (
            <div className="py-8">
              <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
              <p className="text-muted-foreground mb-8">
                You've finished your workout. Here's your summary:
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold">{formatTime(workoutSession.elapsedTime)}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Dumbbell className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Exercises Completed</p>
                  <p className="text-2xl font-bold">{workoutSession.exercises.length}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3">Exercise Details</h3>
              <ul className="space-y-3 mb-8">
                {workoutSession.exercises.map((exercise, index) => (
                  <li key={index} className="bg-background border rounded-md p-3 flex justify-between">
                    <div>
                      <p className="font-medium capitalize">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.currentSet >= exercise.totalSets 
                          ? `${exercise.totalSets} sets × ${exercise.reps} reps completed`
                          : `${exercise.currentSet} of ${exercise.totalSets} sets completed`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate('/')} className="flex-1">
                  Finish
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/saved-exercises')}
                  className="flex-1"
                >
                  Browse Exercises
                </Button>
              </div>
            </div>
          ) : (
            <WorkoutPlayer 
              session={workoutSession} 
              onComplete={handleWorkoutComplete}
              onCancel={handleCancel}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkoutExecution;
