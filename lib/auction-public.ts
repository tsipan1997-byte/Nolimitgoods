// Що бачить клієнт про аукціон: тільки дату торгів і країну, без назви аукціонного дому і міста.
// Назву (house) і майданчик лишаємо в даних — вони потрібні нам у заявках і для ставок.

// «Мальтбі (Англія), Шотландія» → «Англія, Шотландія»; «Оканья, Іспанія» → «Іспанія»
const COUNTRIES = ['Англія', 'Шотландія', 'Уельс', 'Північна Ірландія', 'Ірландія', 'Іспанія', 'Нідерланди', 'Франція', 'Німеччина', 'Бельгія', 'Італія', 'Польща'];

export function publicPlace(place: string | undefined | null): string {
  if (!place) return 'Велика Британія';
  const found = COUNTRIES.filter((c) => place.includes(c) && !(c === 'Ірландія' && /Північна Ірландія/.test(place) && !/(^|[,(\s])Ірландія/.test(place.replace('Північна Ірландія', ''))));
  return found.length ? found.join(', ') : 'Велика Британія';
}

// «18–19 листопада 2026» → «Торги 18–19 листопада»
export function tradeDates(dates: string | undefined | null): string {
  return dates ? `Торги ${dates.replace(/\s*20\d\d\s*$/, '')}` : 'Торги';
}
