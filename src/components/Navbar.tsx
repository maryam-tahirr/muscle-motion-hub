
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, User, Heart, LogIn } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b border-border py-3 px-4 bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/30 fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MuscleMotionHub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/exercises" className={`transition-colors ${location.pathname === '/exercises' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Exercises
          </Link>
          <Link to="/exercise-library" className={`transition-colors ${location.pathname === '/exercise-library' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Exercise Library
          </Link>
          <Link to="/calculators" className={`transition-colors ${location.pathname === '/calculators' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            Fitness Tools
          </Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            About
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/saved-exercises">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/signin">
              <LogIn className="h-5 w-5 mr-2" />
              <span>Sign in</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
