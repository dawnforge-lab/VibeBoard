import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getActiveNotifications } from '../../../../lib/admin/notifications';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') as 'web' | 'mobile' | null;

    const notifications = await getActiveNotifications(platform || 'web');

    return NextResponse.json(notifications, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching active notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
