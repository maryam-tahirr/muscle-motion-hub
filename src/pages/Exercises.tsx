
import React from "react";
import Navbar from "@/components/Navbar";
import MuscleViewer from "@/components/MuscleViewer/MuscleViewer";

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
          </div>
          
          <MuscleViewer />
        </div>
      </main>
    </div>
  );
};

export default Exercises;
