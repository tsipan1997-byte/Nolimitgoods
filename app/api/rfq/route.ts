async function findPriceWithAI(partNumber: string, machineModel: string, country: string): Promise<PriceCalculation> {
  const rawKey = process.env.PERPLEXITY_API_KEY || '';
  const apiKey = rawKey.trim();
  const cleanPart = partNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!apiKey) {
    return {
      basePrice: 0,
      delivery: 30,
      marginPercent: 25,
      marginAmount: 0,
      finalPrice: 0,
      currency: 'GBP',
      sourceNote: 'API ключ не знайдено у системі',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const query = `Find retail or wholesale price in GBP (£) for spare part "${cleanPart}" (or "${partNumber}") for "${machineModel || 'machinery'}". What is the price in GBP? Return price number and sources.`;

    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You search and extract part prices. State the approximate price in GBP and note the website or store where you found it. Keep it brief.'
          },
          { role: 'user', content: query },
        ],
        temperature: 0.2,
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      console.error('Perplexity API response error:', res.status, errText);
      throw new Error(`API error ${res.status}`);
    }

    const aiData = await res.json();
    const answer: string = aiData?.choices?.[0]?.message?.content || '';

    // Знаходимо будь-яку згадку ціни в GBP (£XX або XX GBP)
    const match = answer.match(/(?:£|GBP\s*)(\d+(?:\.\d{1,2})?)/i) || answer.match(/(\d+(?:\.\d{1,2})?)\s*(?:£|GBP)/i);
    let basePrice = match ? Math.round(parseFloat(match[1])) : 0;

    // Якщо раптом знайдено в EUR (€) чи USD ($), конвертуємо приблизно в GBP
    if (basePrice === 0) {
      const eurMatch = answer.match(/(?:€|EUR\s*)(\d+(?:\.\d{1,2})?)/i);
      const usdMatch = answer.match(/(?:\$|USD\s*)(\d+(?:\.\d{1,2})?)/i);
      if (eurMatch) basePrice = Math.round(parseFloat(eurMatch[1]) * 0.85);
      else if (usdMatch) basePrice = Math.round(parseFloat(usdMatch[1]) * 0.78);
    }

    const delivery = 30;
    const marginPercent = basePrice > 500 ? 20 : 25;
    const marginAmount = Math.round((basePrice * marginPercent) / 100);
    const finalPrice = basePrice > 0 ? basePrice + marginAmount + delivery : 0;

    const shortSummary = answer.split('\n')[0].substring(0, 150);

    return {
      basePrice,
      delivery,
      marginPercent,
      marginAmount,
      finalPrice,
      currency: 'GBP',
      sourceNote: shortSummary || 'Знайдено в онлайн-джерелах',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('AI Search Warning:', error.message);
    return {
      basePrice: 0,
      delivery: 30,
      marginPercent: 25,
      marginAmount: 0,
      finalPrice: 0,
      currency: 'GBP',
      sourceNote: 'Потрібен індивідуальний запит постачальникам',
    };
  }
}
