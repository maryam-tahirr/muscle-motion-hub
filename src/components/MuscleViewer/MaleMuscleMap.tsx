
import React from 'react';
import maleMuscleFront from '@/assets/male-muscle-front.png';

interface MaleMuscleMapProps {
  selectedMuscle: string | null;
  onMuscleSelect: (muscle: string) => void;
}

const MaleMuscleMap: React.FC<MaleMuscleMapProps> = ({ selectedMuscle, onMuscleSelect }) => {
  const handleMuscleClick = (muscle: string) => {
    onMuscleSelect(muscle);
  };

  // Define clickable regions for different muscle groups
  const muscleAreas = [
    { id: 'chest', shape: 'poly', coords: '108,118,144,118,167,143,147,157,104,157,84,143', alt: 'Chest muscles' },
    { id: 'abs', shape: 'poly', coords: '108,158,147,158,147,210,129,229,105,210', alt: 'Abdominal muscles' },
    { id: 'quads', shape: 'poly', coords: '95,230,129,230,137,280,137,330,123,330,112,280', alt: 'Quadriceps' },
    { id: 'biceps', shape: 'poly', coords: '67,145,84,143,90,180,70,185,58,173', alt: 'Biceps (left)' },
    { id: 'biceps', shape: 'poly', coords: '188,145,171,143,165,180,185,185,197,173', alt: 'Biceps (right)' },
    { id: 'shoulders', shape: 'poly', coords: '70,120,84,110,108,118,84,143,67,145', alt: 'Shoulder (left)' },
    { id: 'shoulders', shape: 'poly', coords: '185,120,171,110,147,118,171,143,188,145', alt: 'Shoulder (right)' },
    { id: 'forearms', shape: 'poly', coords: '58,173,70,185,65,217,50,225', alt: 'Forearm (left)' },
    { id: 'forearms', shape: 'poly', coords: '197,173,185,185,190,217,205,225', alt: 'Forearm (right)' },
    { id: 'calves', shape: 'poly', coords: '112,330,123,330,123,370,115,390,107,370', alt: 'Calves' },
    { id: 'traps', shape: 'poly', coords: '108,90,147,90,147,117,108,117', alt: 'Trapezius' },
    { id: 'triceps', shape: 'poly', coords: '40,170,58,173,50,225,35,215', alt: 'Triceps (left)' },
    { id: 'triceps', shape: 'poly', coords: '215,170,197,173,205,225,220,215', alt: 'Triceps (right)' }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <img 
        src={maleMuscleFront} 
        alt="Male Muscle Anatomy" 
        className="w-full"
        useMap="#male-muscle-map"
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
      
      <map name="male-muscle-map">
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

export default MaleMuscleMap;
