import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawOem = searchParams.get('oem');

  if (!rawOem) {
    return NextResponse.json({ error: 'OEM is required' }, { status: 400 });
  }

  // Очищення артикула від слешів і дефісів (наприклад, "458/20403" -> "45820403")
  const cleanOem = rawOem.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Логіка розрахунку собівартості та фінальної ціни
  const calculateFinalPrice = (supplierPriceGbp: number) => {
    const localUkShipping = 5.0; // Доставка по Англії до Coventry Hub
    const marginPercent = 0.25;  // 25% маржа
    const baseCost = supplierPriceGbp + localUkShipping;
    return Number((baseCost * (1 + marginPercent)).toFixed(2));
  };

  // Тимчасова заглушка для перевірки роботи вашого API-ендпоінту
  // Після отримання ключів сюди підставиться виклик eBay Browse API
  return NextResponse.json({
    oem: cleanOem,
    status: 'pending_ebay_approval',
    mockData: {
      source: 'ebay_uk',
      title: `Replacement part for OEM ${cleanOem}`,
      supplierPrice: 120.00,
      currency: 'GBP',
      finalPrice: calculateFinalPrice(120.00),
      hubLocation: 'Coventry, UK',
      inStock: true
    }
  });
}
