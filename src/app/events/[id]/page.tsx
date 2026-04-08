'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Event } from '@/lib/types';
import { fetchEventById } from '@/lib/api';
import { MarketCard } from '@/components/markets/MarketCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Event not found</h1>
          <p className="text-gray-400">The event you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <Badge category={event.category} />
          <div className="text-right">
            <p className="text-sm text-gray-400">Volume</p>
            <p className="text-xl font-bold text-white">{formatCurrency(event.volume)}</p>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
        
        <p className="text-lg text-gray-300 mb-6">{event.description}</p>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div>
            <span className="font-medium">Liquidity:</span> {formatCurrency(event.liquidity)}
          </div>
          <div>
            <span className="font-medium">Ends:</span>{' '}
            {format(new Date(event.endDate), 'MMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Markets Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Markets</h2>
        
        {event.markets.map((market) => (
          <div key={market.id} className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">{market.question}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {market.outcomes.map((outcome) => (
                <MarketCard key={outcome.id} outcome={outcome} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
