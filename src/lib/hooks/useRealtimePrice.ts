'use client';

import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { priceAtomFamily, previousPriceAtomFamily, priceUpdateTimeAtomFamily } from '@/lib/store';
import { simulatePriceChange } from '@/lib/utils';

/**
 * Hook for real-time price updates
 * Uses simulation for demo purposes - can be replaced with WebSocket
 */
export function useRealtimePrice(outcomeId: string, initialPrice: number) {
  const [price, setPrice] = useAtom(priceAtomFamily(outcomeId));
  const setPreviousPrice = useSetAtom(previousPriceAtomFamily(outcomeId));
  const setUpdateTime = useSetAtom(priceUpdateTimeAtomFamily(outcomeId));

  // Initialize price
  useEffect(() => {
    if (price === 0) {
      setPrice(initialPrice);
      setPreviousPrice(initialPrice);
    }
  }, [initialPrice, price, setPrice, setPreviousPrice]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((currentPrice) => {
        const newPrice = simulatePriceChange(currentPrice || initialPrice);
        setPreviousPrice(currentPrice || initialPrice);
        setUpdateTime(Date.now());
        return newPrice;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [outcomeId, initialPrice, setPrice, setPreviousPrice, setUpdateTime]);

  return price || initialPrice;
}
