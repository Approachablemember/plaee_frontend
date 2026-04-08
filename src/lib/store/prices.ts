import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

// Price data for each outcome (atomic updates to prevent unnecessary re-renders)
export const priceAtomFamily = atomFamily((outcomeId: string) =>
  atom<number>(0)
);

// Previous price for calculating changes
export const previousPriceAtomFamily = atomFamily((outcomeId: string) =>
  atom<number>(0)
);

// Last update timestamp
export const priceUpdateTimeAtomFamily = atomFamily((outcomeId: string) =>
  atom<number>(Date.now())
);

// Derived atom for price change
export const priceChangeAtomFamily = atomFamily((outcomeId: string) =>
  atom((get) => {
    const current = get(priceAtomFamily(outcomeId));
    const previous = get(previousPriceAtomFamily(outcomeId));
    
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  })
);
