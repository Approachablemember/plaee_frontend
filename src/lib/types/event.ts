export type Category = 'all' | 'crypto' | 'sports' | 'politics';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: Category;
  slug: string;
  volume: number;
  liquidity: number;
  endDate: string;
  image?: string;
  markets: Market[];
  active: boolean;
  closed: boolean;
  createdAt: string;
}

export interface Market {
  id: string;
  eventId: string;
  question: string;
  outcomes: Outcome[];
  volume: number;
  liquidity: number;
  endDate: string;
  active: boolean;
}

export interface Outcome {
  id: string;
  marketId: string;
  name: string;
  price: number;
  previousPrice?: number;
  lastUpdate?: number;
}

export interface PriceUpdate {
  outcomeId: string;
  marketId: string;
  price: number;
  timestamp: number;
}
