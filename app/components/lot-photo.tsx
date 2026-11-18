'use client';

import React, { useState } from 'react';
import { lotPhotoUrl } from '@/lib/lot-photos';

// Фото лота: спершу наша копія у сховищі (не зникає після торгів), потім оригінал з аукціону, потім заглушка.
export default function LotPhoto({ auction, item, src, alt, className = 'absolute inset-0 w-full h-full object-cover' }: {
  auction: string;
  item: string;
  src: string;
  alt: string;
  className?: string;
}) {
  const ours = lotPhotoUrl(auction, item);
  const chain = [ours, src].filter(Boolean) as string[];
  const [i, setI] = useState(0);
  if (i >= chain.length) return <div className="absolute inset-0 bg-slate-100" aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={chain[i]} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setI((n) => n + 1)} className={className} />
  );
}
