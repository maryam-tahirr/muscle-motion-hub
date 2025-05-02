
import React from 'react';

interface MaleMuscleMapProps {
  selectedMuscle: string | null;
  onMuscleSelect: (muscle: any) => void;
}

const MaleMuscleMap: React.FC<MaleMuscleMapProps> = ({ selectedMuscle, onMuscleSelect }) => {
  const handleMuscleClick = (muscle: string) => {
    onMuscleSelect(muscle);
  };

  return (
    <div className="relative w-full aspect-[1/1.4]">
      <svg viewBox="0 0 250 350" className="w-full h-full">
        {/* Male silhouette outline */}
        <path 
          d="M125,20 C160,20 180,40 185,80 C190,120 190,150 190,180 C190,210 180,240 170,280 C160,320 150,330 140,340 C130,350 120,350 110,340 C100,330 90,320 80,280 C70,240 60,210 60,180 C60,150 60,120 65,80 C70,40 90,20 125,20 Z" 
          stroke="#555" 
          strokeWidth="1" 
          fill="none" 
        />
        
        {/* Chest muscles */}
        <path 
          className={`muscle-group ${selectedMuscle === 'chest' ? 'active' : ''}`}
          d="M95,90 C105,95 115,100 125,100 C135,100 145,95 155,90 C150,110 140,120 125,120 C110,120 100,110 95,90 Z" 
          onClick={() => handleMuscleClick('chest')}
        />
        
        {/* Abs */}
        <path 
          className={`muscle-group ${selectedMuscle === 'abs' ? 'active' : ''}`}
          d="M110,125 C120,125 130,125 140,125 C140,145 140,165 140,185 C130,185 120,185 110,185 C110,165 110,145 110,125 Z" 
          onClick={() => handleMuscleClick('abs')}
        />
        
        {/* Biceps (left) */}
        <path 
          className={`muscle-group ${selectedMuscle === 'biceps' ? 'active' : ''}`}
          d="M90,100 C85,110 82,120 80,130 C78,120 75,110 65,105 C70,95 75,90 90,100 Z" 
          onClick={() => handleMuscleClick('biceps')}
        />
        
        {/* Biceps (right) */}
        <path 
          className={`muscle-group ${selectedMuscle === 'biceps' ? 'active' : ''}`}
          d="M160,100 C165,110 168,120 170,130 C172,120 175,110 185,105 C180,95 175,90 160,100 Z" 
          onClick={() => handleMuscleClick('biceps')}
        />
        
        {/* Quads */}
        <path 
          className={`muscle-group ${selectedMuscle === 'quads' ? 'active' : ''}`}
          d="M110,190 C120,190 130,190 140,190 C140,220 140,250 130,270 C120,250 110,220 110,190 Z" 
          onClick={() => handleMuscleClick('quads')}
        />
        
        {/* Shoulders */}
        <path 
          className={`muscle-group ${selectedMuscle === 'shoulders' ? 'active' : ''}`}
          d="M80,80 C90,70 100,65 125,65 C150,65 160,70 170,80 C160,75 145,70 125,70 C105,70 90,75 80,80 Z" 
          onClick={() => handleMuscleClick('shoulders')}
        />
        
        {/* Add more muscle groups as needed */}
      </svg>
    </div>
  );
};

export default MaleMuscleMap;
