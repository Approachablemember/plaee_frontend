'use client';

import { useAtom } from 'jotai';
import { selectedCategoryAtom, filteredEventsAtom } from '@/lib/store';
import { Category } from '@/lib/types';

/**
 * Hook for category filtering
 */
export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [filteredEvents] = useAtom(filteredEventsAtom);

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  return {
    selectedCategory,
    selectCategory,
    filteredEvents,
  };
}
