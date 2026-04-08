// Polymarket API response types
export interface PolymarketEvent {
  id: string;
  title: string;
  description: string;
  slug: string;
  markets: PolymarketMarket[];
  volume?: string;
  liquidity?: string;
  endDate?: string;
  image?: string;
  active?: boolean;
  closed?: boolean;
  createdAt?: string;
  tags?: string[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  outcomes: string[];
  outcomePrices: string[];
  volume?: string;
  liquidity?: string;
  endDate?: string;
  active?: boolean;
  clobTokenIds?: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface EventsResponse {
  events: PolymarketEvent[];
  nextCursor?: string;
}
