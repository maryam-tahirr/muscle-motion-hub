
import React, { useEffect, useState } from 'react';
import { Exercise } from '@/services/exerciseService';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ExerciseCard from './ExerciseCard';
import { fetchItems } from '@/services/itemService';

interface ExerciseGridProps {
  exercises: Exercise[];
  searchTerm: string;
  searchType: 'name' | 'target' | 'equipment';
  isLoading: boolean;
  savedExercises: string[];
  onSelectExercise: (exercise: Exercise) => void;
  onToggleSave: (e: React.MouseEvent, exercise: Exercise) => void;
}

const ExerciseGrid = ({
  exercises,
  searchTerm,
  searchType,
  isLoading,
  savedExercises,
  onSelectExercise,
  onToggleSave,
}: ExerciseGridProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(false);

  useEffect(() => {
    const getItems = async () => {
      setIsLoadingItems(true);
      try {
        const data = await fetchItems();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setIsLoadingItems(false);
      }
    };
    getItems();
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    switch (searchType) {
      case 'name':
        return exercise.name.toLowerCase().includes(searchLower);
      case 'target':
        return exercise.target.toLowerCase().includes(searchLower);
      case 'equipment':
        return exercise.equipment.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredExercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm
            ? `No exercises found matching your search for "${searchTerm}" in ${searchType}.`
            : 'No exercises found for this body part.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredExercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          isSaved={savedExercises.includes(exercise.id)}
          onSelect={onSelectExercise}
          onToggleSave={onToggleSave}
        />
      ))}

      {/* Example output of fetched items from backend */}
      <div className="col-span-full mt-8">
        <h2 className="text-xl font-bold mb-2">Items from Backend</h2>
        {isLoadingItems ? (
          <p>Loading items...</p>
        ) : items.length > 0 ? (
          <ul className="list-disc list-inside">
            {items.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseGrid;
