'use client';

import { useEffect } from 'react';
import { captureFbclid, getFbc } from '@/lib/meta-client';

// Відстеження кліків по контактах для Meta:
// піксель (якщо є згода на cookie) + сервер /api/track (працює завжди),
// з одним eventID, щоб Meta не рахувала клік двічі.
function contactMethod(href: string): string | null {
  if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp';
  if (href.includes('t.me')) return 'telegram';
  if (href.startsWith('viber://')) return 'viber';
  if (href.startsWith('tel:')) return 'phone';
  if (href.startsWith('mailto:')) return 'email';
  return null;
}

export default function MetaTracking() {
  useEffect(() => {
    captureFbclid();

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target && target.closest ? target.closest('a') : null;
      if (!el) return;
      const method = contactMethod(el.getAttribute('href') || '');
      if (!method) return;

      const eventId = `C-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const w = window as any;
      if (typeof w.fbq === 'function') {
        w.fbq('track', 'Contact', { contact_method: method }, { eventID: eventId });
      }
      const payload = JSON.stringify({ method, eventId, page: window.location.pathname, fbc: getFbc() });
      try {
        // sendBeacon переживає перехід у месенджер; fetch keepalive — запасний варіант
        const sent = navigator.sendBeacon?.('/api/track', new Blob([payload], { type: 'application/json' }));
        if (!sent) {
          fetch('/api/track', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
        }
      } catch {
        /* ignore */
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
