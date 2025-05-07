
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import Calculators from "./pages/Calculators";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ThemeProvider } from "./components/ThemeProvider";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import SavedExercises from "./pages/SavedExercises";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import WorkoutExecution from "./pages/WorkoutExecution";
import "./styles/muscleMap.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
            <Route path="/saved-exercises" element={<SavedExercises />} />
            <Route path="/workout-builder" element={<WorkoutBuilder />} />
            <Route path="/workout/:id" element={<WorkoutExecution />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
