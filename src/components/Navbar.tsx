
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, User, Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b border-border py-3 px-4 bg-card/50 backdrop-blur supports-backdrop-blur:bg-card/30 fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">MuscleMotionHub</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/exercises" className="text-muted-foreground hover:text-foreground transition-colors">
            Exercises
          </Link>
          <Link to="/calculators" className="text-muted-foreground hover:text-foreground transition-colors">
            Fitness Tools
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="secondary">
            <User className="h-5 w-5 mr-2" />
            <span>Sign in</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
