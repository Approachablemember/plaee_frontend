'use client';

import { memo } from 'react';
import { Outcome } from '@/lib/types';
import { ProbabilityBar } from './ProbabilityBar';
import { PriceDisplay } from './PriceDisplay';
import { useRealtimePrice } from '@/lib/hooks';
import { formatProbability } from '@/lib/utils';

interface MarketCardProps {
  outcome: Outcome;
}

export const MarketCard = memo(function MarketCard({ outcome }: MarketCardProps) {
  const livePrice = useRealtimePrice(outcome.id, outcome.price);

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{outcome.name}</h3>
        <PriceDisplay outcomeId={outcome.id} price={livePrice} />
      </div>
      <div className="space-y-2">
        <ProbabilityBar probability={livePrice} />
        <p className="text-sm text-gray-400">{formatProbability(livePrice)} chance</p>
      </div>
    </div>
  );
});
