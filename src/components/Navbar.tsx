import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import authService from '@/services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const user = authService.getCurrentUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/signin');
  };

  return (
    <nav className="fixed z-50 w-full bg-background backdrop-blur-lg bg-opacity-90 border-b shadow-sm">
      <div className="container max-w-7xl h-16 flex items-center justify-between py-4 px-4">
        {/* Logo and Brand */}
        <Link to="/" className="font-bold text-xl flex items-center">
          Muscle Motion Hub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" asChild>
            <Link to="/exercises">Exercises</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/workout-builder">Workout Builder</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/calculators">Calculators</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
        </div>
                
        {/* Mobile Menu */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/saved-exercises">Saved Exercises</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" asChild size="sm">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background border-b md:hidden z-50">
            <div className="container py-4 flex flex-col space-y-3">
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/exercises">Exercises</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/workout-builder">Workout Builder</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/calculators">Calculators</Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/about">About</Link>
              </Button>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/profile">Profile</Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/saved-exercises">Saved Exercises</Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" asChild className="justify-start">
                      <Link to="/admin">Admin Panel</Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
