import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET() {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: 'API ключ PERPLEXITY_API_KEY не знайдено в Environment Variables на Vercel!',
    });
  }

  const testParts = 'Fleetguard AF25627NF, Fleetguard FK11008NN, Fleetguard AB15803';
  const prompt = `Find live purchase prices in GBP (£) ex-VAT across UK/EU machinery distributors for these parts: ${testParts}. List each part, the price in GBP, weight in kg, and the store/source.`;

  try {
    const startTime = Date.now();
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a parts sourcing specialist. Be direct and concise.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const elapsedMs = Date.now() - startTime;
    const data = await res.json();

    return NextResponse.json({
      status: res.status,
      elapsedSeconds: (elapsedMs / 1000).toFixed(2),
      apiKeyPresent: true,
      apiKeyPrefix: apiKey.slice(0, 8) + '...',
      rawResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Network error',
    });
  }
}
