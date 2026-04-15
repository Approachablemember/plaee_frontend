import { Event, Market, Outcome, Category } from '@/lib/types';
import { PolymarketEvent, PolymarketMarket } from '@/lib/types/api';
import { parsePrice } from '@/lib/utils';

// Use our Next.js API routes to avoid CORS issues
const API_BASE_URL = '/api';

/**
 * Map Polymarket category tags to our category type
 */
function mapCategory(tags?: string[] | string, title?: string): Category {
  if (!tags && !title) return 'politics';
  
  // Handle both array and string formats
  const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
  
  // Combine all tags and title into searchable text
  const searchText = [...tagArray, title || ''].join(' ').toLowerCase();
  
  // Crypto keywords
  if (searchText.match(/crypto|bitcoin|btc|ethereum|eth|blockchain|defi|nft|token|coin|solana|cardano|polygon|binance/i)) {
    return 'crypto';
  }
  
  // Sports keywords
  if (searchText.match(/sport|nfl|nba|mlb|nhl|soccer|football|basketball|baseball|hockey|tennis|golf|boxing|ufc|mma|olympics|fifa|premier league|champions league/i)) {
    return 'sports';
  }
  
  // Default to politics
  return 'politics';
}

/**
 * Transform Polymarket API event to our Event type
 */
function transformEvent(apiEvent: PolymarketEvent): Event {
  const markets: Market[] = apiEvent.markets?.map((apiMarket, index) => {
    // Handle both array and string formats for outcomes
    let outcomeNames: string[] = [];
    if (Array.isArray(apiMarket.outcomes)) {
      outcomeNames = apiMarket.outcomes;
    } else if (typeof apiMarket.outcomes === 'string') {
      outcomeNames = [apiMarket.outcomes];
    }

    const outcomes: Outcome[] = outcomeNames.map((outcomeName, outcomeIndex) => ({
      id: `${apiMarket.id}-outcome-${outcomeIndex}`,
      marketId: apiMarket.id,
      name: outcomeName,
      price: parsePrice(apiMarket.outcomePrices?.[outcomeIndex] || '0.5'),
      previousPrice: parsePrice(apiMarket.outcomePrices?.[outcomeIndex] || '0.5'),
      lastUpdate: Date.now(),
    }));

    return {
      id: apiMarket.id,
      eventId: apiEvent.id,
      question: apiMarket.question,
      outcomes,
      volume: parseFloat(apiMarket.volume || '0'),
      liquidity: parseFloat(apiMarket.liquidity || '0'),
      endDate: apiMarket.endDate || apiEvent.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      active: apiMarket.active ?? true,
    };
  }) || [];

  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description || '',
    category: mapCategory(apiEvent.tags, apiEvent.title),
    slug: apiEvent.slug,
    volume: parseFloat(apiEvent.volume || '0'),
    liquidity: parseFloat(apiEvent.liquidity || '0'),
    endDate: apiEvent.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    image: apiEvent.image,
    markets,
    active: apiEvent.active ?? true,
    closed: apiEvent.closed ?? false,
    createdAt: apiEvent.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetch events from Polymarket API
 */
export async function fetchEvents(closed: boolean = false): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events?closed=${closed}&limit=50`, {
      cache: 'no-store', // Disable cache to avoid issues with large responses
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PolymarketEvent[] = await response.json();
    return data.map(transformEvent);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return mock data for development
    return getMockEvents();
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(eventId: string): Promise<Event | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      cache: 'no-store', // Disable cache to avoid issues with large responses
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PolymarketEvent = await response.json();
    return transformEvent(data);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Mock data for development/demo purposes
 */
function getMockEvents(): Event[] {
  return [
    {
      id: '1',
      title: 'Will Bitcoin reach $100,000 by end of 2026?',
      description: 'This market will resolve to "Yes" if Bitcoin (BTC) reaches or exceeds $100,000 USD at any point before December 31, 2026.',
      category: 'crypto',
      slug: 'bitcoin-100k-2026',
      volume: 2500000,
      liquidity: 500000,
      endDate: '2026-12-31T23:59:59Z',
      markets: [
        {
          id: 'market-1',
          eventId: '1',
          question: 'Will Bitcoin reach $100,000 by end of 2026?',
          outcomes: [
            { id: 'outcome-1-yes', marketId: 'market-1', name: 'Yes', price: 0.67, previousPrice: 0.65, lastUpdate: Date.now() },
            { id: 'outcome-1-no', marketId: 'market-1', name: 'No', price: 0.33, previousPrice: 0.35, lastUpdate: Date.now() },
          ],
          volume: 2500000,
          liquidity: 500000,
          endDate: '2026-12-31T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Will Ethereum switch to a new consensus mechanism in 2026?',
      description: 'This market resolves to "Yes" if Ethereum implements a new consensus mechanism different from Proof of Stake.',
      category: 'crypto',
      slug: 'ethereum-consensus-2026',
      volume: 1800000,
      liquidity: 350000,
      endDate: '2026-12-31T23:59:59Z',
      markets: [
        {
          id: 'market-2',
          eventId: '2',
          question: 'Will Ethereum switch to a new consensus mechanism in 2026?',
          outcomes: [
            { id: 'outcome-2-yes', marketId: 'market-2', name: 'Yes', price: 0.15, previousPrice: 0.14, lastUpdate: Date.now() },
            { id: 'outcome-2-no', marketId: 'market-2', name: 'No', price: 0.85, previousPrice: 0.86, lastUpdate: Date.now() },
          ],
          volume: 1800000,
          liquidity: 350000,
          endDate: '2026-12-31T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-01-15T00:00:00Z',
    },
    {
      id: '3',
      title: 'NBA Championship 2026 Winner',
      description: 'Which team will win the 2026 NBA Championship?',
      category: 'sports',
      slug: 'nba-championship-2026',
      volume: 3200000,
      liquidity: 650000,
      endDate: '2026-06-30T23:59:59Z',
      markets: [
        {
          id: 'market-3',
          eventId: '3',
          question: 'NBA Championship 2026 Winner',
          outcomes: [
            { id: 'outcome-3-lakers', marketId: 'market-3', name: 'Los Angeles Lakers', price: 0.28, previousPrice: 0.27, lastUpdate: Date.now() },
            { id: 'outcome-3-celtics', marketId: 'market-3', name: 'Boston Celtics', price: 0.25, previousPrice: 0.26, lastUpdate: Date.now() },
            { id: 'outcome-3-warriors', marketId: 'market-3', name: 'Golden State Warriors', price: 0.22, previousPrice: 0.21, lastUpdate: Date.now() },
            { id: 'outcome-3-other', marketId: 'market-3', name: 'Other', price: 0.25, previousPrice: 0.26, lastUpdate: Date.now() },
          ],
          volume: 3200000,
          liquidity: 650000,
          endDate: '2026-06-30T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-02-01T00:00:00Z',
    },
    {
      id: '4',
      title: 'Will there be a US Presidential Election in 2026?',
      description: 'This market resolves to "Yes" if a US Presidential Election takes place in 2026.',
      category: 'politics',
      slug: 'us-election-2026',
      volume: 5000000,
      liquidity: 1000000,
      endDate: '2026-12-31T23:59:59Z',
      markets: [
        {
          id: 'market-4',
          eventId: '4',
          question: 'Will there be a US Presidential Election in 2026?',
          outcomes: [
            { id: 'outcome-4-yes', marketId: 'market-4', name: 'Yes', price: 0.02, previousPrice: 0.02, lastUpdate: Date.now() },
            { id: 'outcome-4-no', marketId: 'market-4', name: 'No', price: 0.98, previousPrice: 0.98, lastUpdate: Date.now() },
          ],
          volume: 5000000,
          liquidity: 1000000,
          endDate: '2026-12-31T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: '5',
      title: 'Super Bowl LXI Winner',
      description: 'Which team will win Super Bowl LXI in 2027?',
      category: 'sports',
      slug: 'super-bowl-lxi-2027',
      volume: 4500000,
      liquidity: 900000,
      endDate: '2027-02-15T23:59:59Z',
      markets: [
        {
          id: 'market-5',
          eventId: '5',
          question: 'Super Bowl LXI Winner',
          outcomes: [
            { id: 'outcome-5-chiefs', marketId: 'market-5', name: 'Kansas City Chiefs', price: 0.18, previousPrice: 0.17, lastUpdate: Date.now() },
            { id: 'outcome-5-49ers', marketId: 'market-5', name: 'San Francisco 49ers', price: 0.16, previousPrice: 0.16, lastUpdate: Date.now() },
            { id: 'outcome-5-bills', marketId: 'market-5', name: 'Buffalo Bills', price: 0.14, previousPrice: 0.15, lastUpdate: Date.now() },
            { id: 'outcome-5-other', marketId: 'market-5', name: 'Other', price: 0.52, previousPrice: 0.52, lastUpdate: Date.now() },
          ],
          volume: 4500000,
          liquidity: 900000,
          endDate: '2027-02-15T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: '6',
      title: 'Will a new cryptocurrency enter the top 10 by market cap in 2026?',
      description: 'This market resolves to "Yes" if a cryptocurrency not currently in the top 10 enters the top 10 by market capitalization.',
      category: 'crypto',
      slug: 'new-crypto-top-10-2026',
      volume: 1200000,
      liquidity: 250000,
      endDate: '2026-12-31T23:59:59Z',
      markets: [
        {
          id: 'market-6',
          eventId: '6',
          question: 'Will a new cryptocurrency enter the top 10 by market cap in 2026?',
          outcomes: [
            { id: 'outcome-6-yes', marketId: 'market-6', name: 'Yes', price: 0.42, previousPrice: 0.41, lastUpdate: Date.now() },
            { id: 'outcome-6-no', marketId: 'market-6', name: 'No', price: 0.58, previousPrice: 0.59, lastUpdate: Date.now() },
          ],
          volume: 1200000,
          liquidity: 250000,
          endDate: '2026-12-31T23:59:59Z',
          active: true,
        },
      ],
      active: true,
      closed: false,
      createdAt: '2026-02-15T00:00:00Z',
    },
  ];
}
