'use client';

import { useEvents, useCategory } from '@/lib/hooks';
import { EventGrid } from '@/components/events/EventGrid';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const { loading, error } = useEvents();
  const { filteredEvents } = useCategory();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Prediction Markets
        </h1>
        <p className="text-gray-400 text-lg">
          Trade on the outcome of future events
        </p>
      </div>

      <CategoryNav />

      <div className="mt-8">
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <EventGrid events={filteredEvents} />
        )}
      </div>
    </div>
  );
}
