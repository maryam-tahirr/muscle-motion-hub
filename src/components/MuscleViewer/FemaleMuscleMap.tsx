
import React from 'react';
import femaleMuscleFront from '@/assets/female-muscle-front.png';

interface FemaleMuscleMapProps {
  selectedMuscle: string | null;
  onMuscleSelect: (muscle: string) => void;
}

const FemaleMuscleMap: React.FC<FemaleMuscleMapProps> = ({ selectedMuscle, onMuscleSelect }) => {
  const handleMuscleClick = (muscle: string) => {
    onMuscleSelect(muscle);
  };

  // Define clickable regions for different muscle groups
  const muscleAreas = [
    { id: 'chest', shape: 'poly', coords: '108,118,144,118,162,143,147,157,105,157,89,143', alt: 'Chest muscles' },
    { id: 'abs', shape: 'poly', coords: '108,158,147,158,147,210,129,229,105,210', alt: 'Abdominal muscles' },
    { id: 'quads', shape: 'poly', coords: '95,230,129,230,137,280,137,330,123,330,112,280', alt: 'Quadriceps' },
    { id: 'biceps', shape: 'poly', coords: '75,145,89,143,95,180,75,185,63,173', alt: 'Biceps (left)' },
    { id: 'biceps', shape: 'poly', coords: '180,145,163,143,158,180,178,185,190,173', alt: 'Biceps (right)' },
    { id: 'shoulders', shape: 'poly', coords: '75,120,89,110,108,118,89,143,75,145', alt: 'Shoulder (left)' },
    { id: 'shoulders', shape: 'poly', coords: '180,120,166,110,147,118,166,143,180,145', alt: 'Shoulder (right)' },
    { id: 'forearms', shape: 'poly', coords: '63,173,75,185,70,217,55,225', alt: 'Forearm (left)' },
    { id: 'forearms', shape: 'poly', coords: '190,173,178,185,183,217,198,225', alt: 'Forearm (right)' },
    { id: 'calves', shape: 'poly', coords: '112,330,123,330,123,370,115,390,107,370', alt: 'Calves' },
    { id: 'traps', shape: 'poly', coords: '108,90,147,90,147,117,108,117', alt: 'Trapezius' },
    { id: 'triceps', shape: 'poly', coords: '45,170,63,173,55,225,40,215', alt: 'Triceps (left)' },
    { id: 'triceps', shape: 'poly', coords: '210,170,190,173,198,225,213,215', alt: 'Triceps (right)' }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img 
        src={femaleMuscleFront} 
        alt="Female Muscle Anatomy" 
        className="w-full"
        useMap="#female-muscle-map"
      />
      
      {/* Highlight overlay for selected muscle */}
      {selectedMuscle && (
        <div className="absolute inset-0 pointer-events-none">
          {muscleAreas
            .filter(area => area.id === selectedMuscle)
            .map((area, index) => {
              // Create SVG polygon for highlighting based on the coordinates
              const points = area.coords.split(',').map(Number);
              const polygonPoints = [];
              for (let i = 0; i < points.length; i += 2) {
                polygonPoints.push(`${points[i]},${points[i + 1]}`);
              }
              
              return (
                <svg key={index} className="absolute inset-0 w-full h-full">
                  <polygon 
                    points={polygonPoints.join(' ')} 
                    className="fill-muscle-active stroke-primary stroke-2 animate-pulse-light"
                  />
                </svg>
              );
            })}
        </div>
      )}
      
      <map name="female-muscle-map">
        {muscleAreas.map((area, index) => (
          <area
            key={index}
            shape={area.shape}
            coords={area.coords}
            alt={area.alt}
            title={area.id.charAt(0).toUpperCase() + area.id.slice(1)}
            onClick={() => handleMuscleClick(area.id)}
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
          />
        ))}
      </map>
    </div>
  );
};

export default FemaleMuscleMap;
