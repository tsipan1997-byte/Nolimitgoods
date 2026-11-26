import type { Metadata } from 'next';
import { getTenant } from '@/lib/tenant-server';

// WHITE LABEL: назва бренду — з конфігу партнера (для NoLimitGoods — як було).
export function generateMetadata(): Metadata {
  const t = getTenant();
  return {
    title: `Залишити відгук | ${t.brand.name}`,
    description: `Розкажіть, як пройшло ваше замовлення запчастин у ${t.brand.name}.`,
    alternates: { canonical: '/vidguk' },
    robots: { index: false },
  };
}

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
