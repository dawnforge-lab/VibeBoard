import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {
  getPublicFeatureFlags,
  isFeatureEnabled,
} from '../../../lib/admin/feature-flags';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    const userId = searchParams.get('userId');

    // If key is specified, check single feature flag
    if (key) {
      const enabled = await isFeatureEnabled(key, userId || undefined);
      return NextResponse.json(
        { [key]: enabled },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          },
        }
      );
    }

    // Otherwise, return all public feature flags
    const flags = await getPublicFeatureFlags();

    return NextResponse.json(flags, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}
