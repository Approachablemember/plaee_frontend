'use client';

import { useAtom } from 'jotai';
import { useEvents } from '@/lib/hooks';
import { eventsByCategoryAtomFamily } from '@/lib/store';
import { EventGrid } from '@/components/events/EventGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function SportsPage() {
  const { loading, error } = useEvents();
  const [sportsEvents] = useAtom(eventsByCategoryAtomFamily('sports'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Sports Markets
        </h1>
        <p className="text-gray-400 text-lg">
          Bet on your favorite teams and sporting events
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-400">
              {sportsEvents.length} {sportsEvents.length === 1 ? 'market' : 'markets'} available
            </p>
          </div>
          <EventGrid events={sportsEvents} />
        </>
      )}
    </div>
  );
}
