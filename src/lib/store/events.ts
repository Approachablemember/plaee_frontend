import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { Event, Category } from '@/lib/types';

// Base atom for all events
export const eventsAtom = atom<Event[]>([]);

// Loading state
export const eventsLoadingAtom = atom<boolean>(true);

// Error state
export const eventsErrorAtom = atom<string | null>(null);

// Selected category filter
export const selectedCategoryAtom = atom<Category>('all');

// Filtered events based on selected category
export const filteredEventsAtom = atom((get) => {
  const events = get(eventsAtom);
  const category = get(selectedCategoryAtom);
  
  if (category === 'all') {
    return events;
  }
  
  return events.filter((event) => event.category === category);
});

// Get event by ID using atom family for optimized lookups
export const eventByIdAtomFamily = atomFamily((eventId: string) =>
  atom((get) => {
    const events = get(eventsAtom);
    return events.find((event) => event.id === eventId);
  })
);

// Get events by category
export const eventsByCategoryAtomFamily = atomFamily((category: Category) =>
  atom((get) => {
    const events = get(eventsAtom);
    if (category === 'all') return events;
    return events.filter((event) => event.category === category);
  })
);
