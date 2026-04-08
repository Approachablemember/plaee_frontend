import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { Market, Outcome } from '@/lib/types';

// Market data by market ID
export const marketAtomFamily = atomFamily((marketId: string) =>
  atom<Market | null>(null)
);

// Outcomes for a specific market
export const marketOutcomesAtomFamily = atomFamily((marketId: string) =>
  atom<Outcome[]>([])
);
