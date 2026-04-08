'use client';

import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { eventsAtom, eventsLoadingAtom, eventsErrorAtom } from '@/lib/store';
import { fetchEvents } from '@/lib/api';

/**
 * Hook to fetch and manage events data
 */
export function useEvents() {
  const [events, setEvents] = useAtom(eventsAtom);
  const [loading, setLoading] = useAtom(eventsLoadingAtom);
  const [error, setError] = useAtom(eventsErrorAtom);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents(false);
        
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load events');
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [setEvents, setLoading, setError]);

  return { events, loading, error };
}
