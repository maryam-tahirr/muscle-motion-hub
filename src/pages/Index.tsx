
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import WorkoutBuilder from "@/components/WorkoutBuilder";
import { Dumbbell, ChevronRight, Calculator, User, Heart, BicepsFlexed, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Unlock Your 
                  <span className="text-primary"> Fitness</span> Potential
                </h1>
                <p className="text-xl text-muted-foreground">
                  Discover exercises, calculate your fitness metrics, and track your progress with our interactive platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/exercises">
                      <BicepsFlexed className="mr-2 h-5 w-5" />
                      Explore Exercises
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/calculators">
                      <Calculator className="mr-2 h-5 w-5" />
                      Fitness Tools
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full flex items-center justify-center">
                  <Dumbbell className="h-24 w-24 text-primary animate-pulse-light" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 px-4 bg-card">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <BicepsFlexed className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Body Map</h3>
                <p className="text-muted-foreground mb-4">
                  Explore exercises by clicking on specific muscle groups with our interactive 3D models.
                </p>
                <Link to="/exercises" className="text-primary flex items-center group">
                  Explore exercises 
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fitness Calculators</h3>
                <p className="text-muted-foreground mb-4">
                  Track your BMI, calculate calories, determine macro splits, and find your one-rep max.
                </p>
                <Link to="/calculators" className="text-primary flex items-center group">
                  Use calculators 
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Exercise Library</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our comprehensive database of exercises with detailed instructions and animations.
                </p>
                <Link to="/exercise-library" className="text-primary flex items-center group">
                  Browse library
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              
              <div className="p-6 bg-secondary/20 rounded-lg border border-border">
                <Heart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to save your favorite exercises and track your progress over time.
                </p>
                <Link to="/signup" className="text-primary flex items-center group">
                  Sign up now 
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Workout Builder */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Create Custom Workouts</h2>
                <p className="text-lg text-muted-foreground">
                  Build personalized workout routines that fit your fitness goals and schedule. Add exercises, set your reps, and track your progress all in one place.
                </p>
                <div className="hidden md:block">
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div>
                <WorkoutBuilder />
              </div>
              <div className="md:hidden">
                <Button asChild className="w-full">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">MuscleMotionHub</span>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                <Link to="/exercises" className="text-sm text-muted-foreground hover:text-foreground">Exercises</Link>
                <Link to="/exercise-library" className="text-sm text-muted-foreground hover:text-foreground">Library</Link>
                <Link to="/calculators" className="text-sm text-muted-foreground hover:text-foreground">Calculators</Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} MuscleMotionHub. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
