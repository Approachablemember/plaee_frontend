'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Event } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { useRealtimePrice } from '@/lib/hooks';

interface EventCardProps {
  event: Event;
}

export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  // Get top 2 outcomes for preview
  const topOutcomes = event.markets[0]?.outcomes.slice(0, 2) || [];

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge category={event.category} />
          <span className="text-sm text-gray-400">{formatCurrency(event.volume)}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {event.description}
        </p>

        {topOutcomes.length > 0 && (
          <div className="space-y-2">
            {topOutcomes.map((outcome) => (
              <OutcomePreview key={outcome.id} outcome={outcome} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
});

function OutcomePreview({ outcome }: { outcome: { id: string; name: string; price: number } }) {
  const livePrice = useRealtimePrice(outcome.id, outcome.price);

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-300">{outcome.name}</span>
      <span className="font-semibold text-blue-400">{(livePrice * 100).toFixed(0)}%</span>
    </div>
  );
}
