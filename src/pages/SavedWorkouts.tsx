
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { supabaseSavedWorkoutService, SavedWorkout } from '@/services/supabaseSavedWorkoutService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Play, Trash2, Clock, Timer, Dumbbell } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';

const SavedWorkouts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteDialog, setDeleteDialog] = useState<SavedWorkout | null>(null);

  // Fetch saved workouts
  const { 
    data: savedWorkouts = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['savedWorkouts'],
    queryFn: supabaseSavedWorkoutService.getSavedWorkouts,
    enabled: !!user,
  });

  const handleDeleteWorkout = async () => {
    if (!deleteDialog) return;

    const success = await supabaseSavedWorkoutService.deleteSavedWorkout(deleteDialog.id);
    if (success) {
      refetch();
      setDeleteDialog(null);
    }
  };

  const handleUseWorkout = (workout: SavedWorkout) => {
    // Navigate to workout builder with the saved workout items
    navigate('/workout-builder', { 
      state: { 
        savedWorkoutItems: workout.items,
        workoutName: workout.name 
      } 
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutStats = (items: any[]) => {
    if (!Array.isArray(items)) return { totalTime: 0, exerciseCount: 0, restCount: 0 };
    
    const totalTime = items.reduce((acc, item) => acc + (item.duration || 0), 0);
    const exerciseCount = items.filter(item => !item.isRest).length;
    const restCount = items.filter(item => item.isRest).length;
    
    return { totalTime, exerciseCount, restCount };
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your saved workouts.</p>
            <Button onClick={() => navigate('/signin')}>Sign In</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-6">
            <h1 className="text-3xl font-bold mb-2">Saved Workouts</h1>
            <p className="text-muted-foreground">
              Revisit and reuse your previously saved custom workouts
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : savedWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Saved Workouts</h2>
              <p className="text-muted-foreground mb-6">
                You haven't saved any workouts yet. Create your first custom workout!
              </p>
              <Button onClick={() => navigate('/workout-builder')}>
                Create Workout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedWorkouts.map((workout) => {
                const stats = getWorkoutStats(workout.items);
                
                return (
                  <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{workout.name}</CardTitle>
                      <CardDescription>
                        Saved on {new Date(workout.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="flex flex-col items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="text-sm font-medium">{formatTime(stats.totalTime)}</span>
                          <span className="text-xs text-muted-foreground">Duration</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Dumbbell className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="text-sm font-medium">{stats.exerciseCount}</span>
                          <span className="text-xs text-muted-foreground">Exercises</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Timer className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="text-sm font-medium">{stats.restCount}</span>
                          <span className="text-xs text-muted-foreground">Rest Periods</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Workout Preview:</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(workout.items) && workout.items.slice(0, 3).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item.isRest ? 'Rest' : (item.exercise?.name || 'Exercise')}
                            </Badge>
                          ))}
                          {Array.isArray(workout.items) && workout.items.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{workout.items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-2">
                      <Button 
                        onClick={() => handleUseWorkout(workout)}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Use Workout
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteDialog(workout)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkout}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedWorkouts;
