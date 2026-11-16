import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Залишити відгук | NoLimitGoods',
  description: 'Розкажіть, як пройшло ваше замовлення запчастин у NoLimitGoods.',
  alternates: { canonical: '/vidguk' },
  robots: { index: false },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
