'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import type { AuctionLot } from '@/lib/auction-lots';
import { LotCard, RequestModal } from './auction-lot-ui';

const STEP = 12;

// Сітка лотів + форма заявки на тематичній сторінці.
// Перші лоти рендеряться на сервері (Google бачить фото й назви), решта — кнопкою «Показати ще».
export default function LandingLots({ lots, page, topic }: { lots: AuctionLot[]; page: string; topic: string }) {
  const [now, setNow] = useState<number | null>(null);
  const [shown, setShown] = useState(STEP);
  const [selected, setSelected] = useState<AuctionLot | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60_000);
    const onOpen = () => {
      setSelected(null);
      setOpen(true);
    };
    window.addEventListener('nlg:landing-request', onOpen);
    return () => {
      clearInterval(t);
      window.removeEventListener('nlg:landing-request', onOpen);
    };
  }, []);

  const openFor = (l: AuctionLot | null) => {
    setSelected(l);
    setOpen(true);
  };

  return (
    <>
      {lots.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
          <p className="font-bold">Зараз на сторінці немає відкритих лотів цієї категорії</p>
          <p className="text-sm text-slate-500 mt-1">Нові аукціони — щотижня. Залиште запит, і ми надішлемо підбір першими.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
          {lots.slice(0, shown).map((l) => (
            <LotCard key={l.auction + l.item} lot={l} now={now} onRequest={() => openFor(l)} />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {shown < lots.length && (
          <button
            type="button"
            onClick={() => setShown((s) => s + STEP)}
            className="h-12 px-6 rounded-xl border-2 border-slate-900 font-bold inline-flex items-center justify-center gap-2"
          >
            Показати ще {Math.min(STEP, lots.length - shown)} з {lots.length - shown} <ChevronDown className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => openFor(null)}
          className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold inline-flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Підібрати під мій бюджет
        </button>
      </div>

      {open && <RequestModal lot={selected} onClose={() => setOpen(false)} page={page} source={`Сторінка ${page}`} topic={topic} />}
    </>
  );
}

// Кнопка, що відкриває форму з будь-якого місця сторінки (сервер-компоненти не можуть тримати стан)
export function LandingRequestButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('nlg:landing-request'))}>
      {children}
    </button>
  );
}
