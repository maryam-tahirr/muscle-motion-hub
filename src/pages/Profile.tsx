
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchWorkoutLogs } from '@/services/workoutService';
import { fetchSavedExercises } from '@/services/savedExerciseService';
import authService from '@/services/authService';
import { format } from 'date-fns';

const Profile = () => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  // Fetch workout logs
  const {
    data: workoutLogs = [],
    isLoading: isLoadingLogs
  } = useQuery({
    queryKey: ['workoutLogs'],
    queryFn: fetchWorkoutLogs,
    enabled: isAuthenticated,
  });

  // Fetch saved exercises
  const {
    data: savedExercises = [],
    isLoading: isLoadingSaved
  } = useQuery({
    queryKey: ['savedExercises'],
    queryFn: fetchSavedExercises,
    enabled: isAuthenticated,
  });

  // Process workout data for charts
  const workoutChartData = React.useMemo(() => {
    return workoutLogs.slice(0, 14).reverse().map(log => ({
      date: format(new Date(log.completedDate), 'MMM dd'),
      duration: log.duration,
      exercises: log.exercisesCompleted,
      name: log.workoutName
    }));
  }, [workoutLogs]);

  // Group workouts by name for the workout distribution chart
  const workoutDistribution = React.useMemo(() => {
    const distribution: Record<string, number> = {};
    
    workoutLogs.forEach(log => {
      distribution[log.workoutName] = (distribution[log.workoutName] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count
    }));
  }, [workoutLogs]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-8">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Please Sign In</h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to view your profile
              </p>
              <Button asChild>
                <a href="/signin">Sign In</a>
              </Button>
            </div>
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
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start py-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Workouts Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{workoutLogs.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Saved Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{savedExercises.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Workout Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {isLoadingLogs ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    `${workoutLogs.reduce((total, log) => total + log.duration, 0)} min`
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different data views */}
          <Tabs defaultValue="progress">
            <TabsList className="mb-6">
              <TabsTrigger value="progress">Workout Progress</TabsTrigger>
              <TabsTrigger value="history">Workout History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workout Duration Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Duration (Last 14 Workouts)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingLogs ? (
                      <Skeleton className="h-64 w-full" />
                    ) : workoutChartData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={workoutChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="duration" stroke="#4f46e5" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">No workout data available yet</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Workout Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingLogs ? (
                      <Skeleton className="h-64 w-full" />
                    ) : workoutDistribution.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={workoutDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4f46e5" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-muted-foreground">No workout data available yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingLogs ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : workoutLogs.length > 0 ? (
                    <div className="space-y-4">
                      {workoutLogs.map((log) => (
                        <div key={log._id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{log.workoutName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(log.completedDate), 'PPP')} • {log.duration} minutes • {log.exercisesCompleted} exercises
                              </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/workouts/${log.workoutId}`}>View</a>
                            </Button>
                          </div>
                          {log.notes && (
                            <p className="text-sm mt-2 bg-muted p-2 rounded">{log.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-10 text-muted-foreground">No workouts logged yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
