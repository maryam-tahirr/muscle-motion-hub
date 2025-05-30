
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import Exercises from '@/pages/Exercises';
import ExerciseLibrary from '@/pages/ExerciseLibrary';
import SavedExercises from '@/pages/SavedExercises';
import WorkoutBuilder from '@/pages/WorkoutBuilder';
import WorkoutExecution from '@/pages/WorkoutExecution';
import Calculators from '@/pages/Calculators';
import About from '@/pages/About';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import AdminPanel from '@/pages/AdminPanel';
import NotFound from '@/pages/NotFound';
import AuthCallback from '@/pages/AuthCallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/exercise-library" element={<ExerciseLibrary />} />
              <Route path="/saved-exercises" element={<SavedExercises />} />
              <Route path="/workout-builder" element={<WorkoutBuilder />} />
              <Route path="/workout-execution/:id" element={<WorkoutExecution />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
