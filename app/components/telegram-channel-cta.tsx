'use client';

import React from 'react';
import { Send } from 'lucide-react';
import { useTenant } from '@/lib/tenant-context';

// Банер «підписатись на канал з лотами»: на сторінках аукціонів і тематичних сторінках
export default function TelegramChannelCta({ topic = 'техніку' }: { topic?: string }) {
  const { social: SOCIAL, features } = useTenant();
  // У партнера без Telegram-каналу (або з вимкненим блоком) банер не показуємо
  if (!features.telegramChannelCta || !SOCIAL.telegramChannel) return null;
  return (
    <a
      href={`${SOCIAL.telegramChannel}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl bg-[#229ED9] hover:bg-[#1d8fc4] text-white p-4 sm:p-5 transition-colors"
    >
      <span className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Send className="w-6 h-6" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-black text-base sm:text-lg leading-tight">Нові лоти щодня — у Telegram-каналі</span>
        <span className="block text-sm text-white/85">Фото, рік, дата торгів — першими дізнавайтесь про {topic} з аукціонів Англії</span>
      </span>
      <span className="hidden sm:inline-flex h-10 px-4 rounded-xl bg-white text-[#1b7fb0] font-bold text-sm items-center shrink-0">Підписатись</span>
    </a>
  );
}
