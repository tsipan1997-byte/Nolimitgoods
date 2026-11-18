// Lead forms must give us a way to call or message the client:
// a phone number (WhatsApp/Viber) or a Telegram username. Email alone is not enough.

export const CONTACT_LABEL = 'Телефон або Telegram *';
export const CONTACT_PLACEHOLDER = '+380… або @username';
export const CONTACT_ERROR = 'Вкажіть номер телефону або Telegram (@username), щоб ми могли швидко з вами зв’язатися.';

export function isPhoneOrTelegram(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  // Telegram: @username or t.me/username (Telegram usernames are 5+ chars)
  if (/^@[A-Za-z0-9_]{4,}$/.test(v)) return true;
  if (/^(https?:\/\/)?t\.me\/[A-Za-z0-9_]{4,}\/?$/i.test(v)) return true;
  // Phone: only digits, spaces, +, -, (, ), and at least 9 digits
  if (/^[+\d\s()\-]+$/.test(v) && v.replace(/\D/g, '').length >= 9) return true;
  return false;
}
