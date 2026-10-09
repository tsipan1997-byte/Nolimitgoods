import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partNumber, machineModel, quantity, country, contact, invoiceNumber, action } = body;

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const perplexityKey = process.env.PERPLEXITY_API_KEY;

    // Режим оцінки вартості через реальний пошук в UK
    if (action === 'lookup') {
      let estimatedPrice = 95;
      let parcelSize: 'small' | 'medium' | 'large' = 'medium';
      let title = `${partNumber} ${machineModel || ''}`.trim();

      if (perplexityKey) {
        try {
          const pplxRes = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${perplexityKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'sonar',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are an industrial machinery parts UK pricing expert. Return ONLY a valid JSON object without markdown or commentary with exact format: {"priceGbp": number, "weightCategory": "small"|"medium"|"large", "partTitle": string}. Estimate realistic UK market wholesale price in GBP and parcel shipping category.',
                },
                {
                  role: 'user',
                  content: `Find typical UK replacement part price in GBP (£) and size for heavy machinery part: "${partNumber}" machine/brand: "${machineModel}". Small is up to 2kg (filter, belt, sensor). Medium is 2-10kg (alternator, starter, turbo). Large is 10kg+ (hydraulic pump, axle, transmission).`,
                },
              ],
              temperature: 0.1,
            }),
          });

          if (pplxRes.ok) {
            const pplxData = await pplxRes.json();
            const textResponse = pplxData.choices?.[0]?.message?.content || '{}';
            const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            if (parsed.priceGbp && Number(parsed.priceGbp) > 0) {
              // Захисна маржа +25% для страхування курсу та прибутку
              estimatedPrice = Math.round(Number(parsed.priceGbp) * 1.25);
            }
            if (['small', 'medium', 'large'].includes(parsed.weightCategory)) {
              parcelSize = parsed.weightCategory;
            }
            if (parsed.partTitle) {
              title = parsed.partTitle;
            }
          }
        } catch (apiErr) {
          console.error('Perplexity search fallback:', apiErr);
        }
      }

      const shippingRates = { small: 27, medium: 41, large: 68 };
      const shippingCost = qty === 1 ? shippingRates[parcelSize] : Math.round(shippingRates[parcelSize] + (qty - 1) * 12);
      const total = (estimatedPrice * qty) + shippingCost;

      return NextResponse.json({
        success: true,
        unitPrice: estimatedPrice,
        shippingCost,
        parcelCategory: parcelSize,
        categoryLabel: title,
        total,
      });
    }

    // Режим відправки заявки в Make/Xero та Telegram
    const xeroWebhookUrl = process.env.XERO_WEBHOOK_URL;
    if (xeroWebhookUrl) {
      try {
        await fetch(xeroWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceNumber: invoiceNumber || `NLG-${Date.now()}`,
            contactName: contact || 'Website Lead',
            itemDescription: `${partNumber} - ${machineModel || 'Machinery part'}`,
            quantity: qty,
            unitAmount: body.total ? Number(body.total) / qty : 100,
            currencyCode: 'GBP',
            taxType: 'NONE',
            lineAmountType: 'Exclusive',
            reference: `Online RFQ - ${country || 'Ukraine'}`,
            date: new Date().toISOString().split('T')[0],
          }),
        });
      } catch (xeroErr) {
        console.error('Xero Webhook error:', xeroErr);
      }
    }

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (error) {
    console.error('RFQ API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
