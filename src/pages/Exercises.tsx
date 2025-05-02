
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MuscleViewer from "@/components/MuscleViewer/MuscleViewer";
import { Button } from "@/components/ui/button";
import { Play, Search, Heart } from "lucide-react";

const Exercises = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
            <p className="text-muted-foreground">
              Click on any muscle group to find targeted exercises with proper form and instructions.
            </p>
            
            {/* Quick actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Button asChild variant="default">
                <Link to="/workout-builder">
                  <Play className="h-4 w-4 mr-2" />
                  Custom Workout Builder
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/exercise-library">
                  <Search className="h-4 w-4 mr-2" />
                  Browse All Exercises
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/saved-exercises">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved Exercises
                </Link>
              </Button>
            </div>
          </div>
          
          <MuscleViewer />
        </div>
      </main>
    </div>
  );
};

export default Exercises;
