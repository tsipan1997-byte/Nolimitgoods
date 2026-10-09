import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      invoiceNumber,
      partNumber,
      categoryLabel,
      totalAmount,
      contact,
    } = body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY не знайдено у змінних оточення Vercel.' },
        { status: 400 }
      );
    }

    const host =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get('origin') ||
      'https://no-limot-goods.vercel.app';

    // Сума в пенсах (GBP Pence)
    const amountInPence = Math.round(Number(totalAmount) * 100);

    const params = new URLSearchParams();
    params.append('payment_method_types[]', 'card');
    params.append('mode', 'payment');
    params.append('client_reference_id', String(invoiceNumber || 'NLG-ORDER'));

    if (contact && contact.includes('@')) {
      params.append('customer_email', contact);
    }

    params.append('line_items[0][price_data][currency]', 'gbp');
    params.append('line_items[0][price_data][unit_amount]', amountInPence.toString());
    params.append('line_items[0][price_data][product_data][name]', `NoLimitGoods Invoice: ${invoiceNumber}`);
    params.append(
      'line_items[0][price_data][product_data][description]',
      `${categoryLabel || 'Machinery Spares'} [${partNumber}]`
    );
    params.append('line_items[0][quantity]', '1');

    params.append('success_url', `${host}/?payment=success&inv=${invoiceNumber}`);
    params.append('cancel_url', `${host}/?payment=cancelled`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe Gateway Error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Помилка виклику Stripe API' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error('Checkout route failure:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
