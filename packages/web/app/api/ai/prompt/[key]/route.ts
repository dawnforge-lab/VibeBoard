import { NextResponse } from 'next/server';
import { getActivePrompt } from '../../../../../lib/admin/ai-prompts';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET(
  _request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;

    if (!key) {
      return NextResponse.json(
        { error: 'Prompt key is required' },
        { status: 400 }
      );
    }

    const prompt = await getActivePrompt(key);

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found or not active' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching AI prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI prompt' },
      { status: 500 }
    );
  }
}
