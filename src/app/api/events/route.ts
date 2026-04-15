import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://gamma-api.polymarket.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const closed = searchParams.get('closed') || 'false';
    const limit = searchParams.get('limit') || '50';

    const response = await fetch(
      `${API_BASE_URL}/events?closed=${closed}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Disable Next.js cache for large responses
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
