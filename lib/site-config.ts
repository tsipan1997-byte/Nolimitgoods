// Загальні налаштування сайту: соцмережі, контакти, націнка.
// Змінюйте тут — оновиться по всьому сайту.

export const SOCIAL = {
  instagram: 'https://www.instagram.com/nolimit_goods/',
  instagramHandle: '@nolimit_goods',
  // Telegram-канал: щодня нові лоти з аукціонів Англії (автопостинг з сайту)
  telegramChannel: 'https://t.me/nolimitgoods',
  telegramChannelHandle: '@nolimitgoods',
  // Вставте посилання на сторінку Facebook — і кнопка зʼявиться автоматично.
  // Поки порожньо, кнопка Facebook на сайті не показується.
  facebook: 'https://www.facebook.com/profile.php?id=61595405257258',
};

// Український номер (WhatsApp/Viber). Впишіть повністю, напр. '+380 XX XXX 0245' —
// і WhatsApp/Viber по всьому сайту перейдуть на нього. Поки порожньо — на англійському.
const PHONE_UA = '+380 50 140 0245';
const PHONE_UK = '+44 7426 826595';
const digits = (p: string) => p.replace(/[^0-9]/g, '');
const WA_NUMBER = digits(PHONE_UA || PHONE_UK);

export const CONTACT = {
  phone: PHONE_UK,            // англійський: дзвінки + Telegram
  phoneUk: PHONE_UK,
  phoneUa: PHONE_UA,          // український: WhatsApp / Viber
  waNumber: WA_NUMBER,
  waDisplay: PHONE_UA || PHONE_UK,
  whatsapp: `https://wa.me/${WA_NUMBER}`,
  viber: `viber://chat?number=%2B${WA_NUMBER}`,
  telegram: `https://t.me/+${digits(PHONE_UK)}`,
  email: 'sales@nolimitgoods.com',
  personalEmail: 'ivan.tsipan@nolimitgoods.com',
  personName: 'Іван Ціпан',
};

// Наша націнка на ціну постачальника без VAT (1.25 = +25%)
export const MARKUP = 1.25;

// Реальні дані компанії — показуються в блоці «Перевірте нас»
export const COMPANY = {
  legalName: 'NoLimitGoods Ltd',
  number: '13146899',
  since: 2021,
  vat: 'GB372654187',
  address: '374 Hipswell Highway, Coventry, CV2 5FR, UK',
  registryUrl: 'https://find-and-update.company-information.service.gov.uk/company/13146899',
};

// Ваші Reels: вставте сюди посилання на 2–4 відео (https://www.instagram.com/reel/XXXX/),
// і вони з'являться на головній. Поки порожньо — блок не показується.
export const REELS: string[] = [
  'https://www.instagram.com/reel/DfktfweKyHr/',
  'https://www.instagram.com/reel/DffnHk-ir-D/',
  'https://www.instagram.com/reel/Dfiu4sgI9uw/',
  'https://www.instagram.com/reel/DfpdwiPts6g/',
];
