// src/app/api/SubmitSurvey/route.ts

import { NextResponse } from 'next/server';
import { SubmitPayload, SubmitResponse } from '@/types/survey';

const inMemorySubmissions: SubmitResponse[] = [];

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SubmitPayload;

    if (process.env.NODE_ENV === 'development') {
      // In dev: store in memory and return the payload
      inMemorySubmissions.push(payload);
      return NextResponse.json(payload);
    }

    // In production: proxy to the real API instead of storing in memory
    const externalUrl = process.env.API_SUBMIT_SURVEY_URL;
    if (!externalUrl) {
      return NextResponse.json(
        { error: 'Missing API_SUBMIT_SURVEY_URL env var' },
        { status: 500 }
      );
    }

    const res = await fetch(externalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: SubmitResponse = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Error in POST /api/dev/SubmitSurvey:', err);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Only return in-memory submissions in dev
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json(inMemorySubmissions);
  }

  // In production, don’t expose in-memory storage
  return NextResponse.json(
    { error: 'Not available in production' },
    { status: 404 }
  );
}
