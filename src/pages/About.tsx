
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Mail, Github, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">About MuscleMotionHub</h1>
            <p className="text-muted-foreground">
              Learn more about our platform and how it can help you achieve your fitness goals.
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Dumbbell className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="mb-4 text-lg">
                MuscleMotionHub aims to make fitness knowledge accessible to everyone, regardless of experience level. Our platform provides visual, interactive tools to help you understand proper exercise techniques and plan your fitness journey.
              </p>
              <p>
                Inspired by resources like MuscleWiki, we've created an improved experience that combines exercise tutorials with practical fitness calculators to give you everything you need in one place.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Interactive male & female body models</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Comprehensive exercise database</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Step-by-step exercise instructions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>BMI, calorie, macro & 1RM calculators</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Save favorite exercises</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p className="mb-4">
                  Have questions, feedback, or suggestions? We'd love to hear from you! Reach out through any of these channels:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>support@musclemotionhub.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-primary" />
                    <span>github.com/musclemotionhub</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center pb-8">
            <div className="flex items-center justify-center gap-2 text-lg">
              <span>Made with</span>
              <Heart className="h-5 w-5 text-destructive" />
              <span>for fitness enthusiasts</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
