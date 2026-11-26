# Онбординг нового партнера White Label

Покрокова інструкція для Івана / розробника. Архітектура і пояснення — [`docs/white-label-spec.md`](./white-label-spec.md).
Приклад нижче — партнер `agroplus` з доменом `auction.agroplus.ua` (вигаданий).

Час на одного партнера: ~3–4 год роботи + очікування DNS (до 24–48 год).

---

## Крок 1. Анкета

Надіслати партнеру чек-лист з розділу **f)** специфікації і отримати:

| Що | Куди піде |
|---|---|
| Піддомен, доступ до DNS (або готовність додати CNAME) | `hosts`, `siteUrl`, Vercel Domains |
| Лого SVG + PNG (світлий/темний фон), favicon, OG 1200×630 | `public/tenants/<id>/` |
| Основний HEX-колір | `brand.palette` |
| Телефон, WhatsApp/Viber, Telegram, email, ім'я менеджера | `contact` |
| Юрособа: назва, ЄДРПОУ/РНОКПП, адреса, email для персональних даних | `company` |
| Telegram-група для заявок і/або CRM-вебхук, Google Sheet | env `TENANT_<ID>_…` |
| Meta Pixel ID, GA4 ID, Google Ads ID, токен CAPI | `analytics` + env |
| Соцмережі | `social` |
| Маржа: % і мінімум у £ | `pricing` |

Секрети (токен CAPI, URL вебхука з ключем) — **не в чаті/пошті відкритим текстом**, а через менеджер паролів або одразу в Vercel.

---

## Крок 2. Запис у `lib/tenants.ts`

Скопіювати `DEMO_TENANT`, змінити значення, додати в `TENANTS`. `id` — латиницею, малими, без дефісів (з нього будуються назви env: `agroplus` → `TENANT_AGROPLUS_…`).

```ts
const AGROPLUS_PHONE = '+380 67 000 0000';
const AGROPLUS_DIGITS = AGROPLUS_PHONE.replace(/[^0-9]/g, '');

export const AGROPLUS_TENANT: Tenant = {
  id: 'agroplus',
  hosts: ['auction.agroplus.ua', 'agroplus.localhost'], // перший — канонічний; *.localhost — для локальної перевірки
  siteUrl: 'https://auction.agroplus.ua',
  isDefault: false,
  brand: {
    name: 'АгроПлюс Аукціон',
    nameLegal: 'ТОВ «АгроПлюс»',
    tagline: 'ТЕХНІКА З АУКЦІОНІВ ЄВРОПИ',
    logo: '/tenants/agroplus/logo.svg',
    ogImage: '/tenants/agroplus/og.png',
    ogAuctionsImage: '/tenants/agroplus/og.png',
    favicon: '/tenants/agroplus/favicon.svg',
    // Шкала з основного HEX (напр. #1d4ed8) — RGB-трійки «r g b»
    palette: {
      '50': '239 246 255', '100': '219 234 254', '200': '191 219 254', '300': '147 197 253',
      '400': '96 165 250', '500': '59 130 246', '600': '37 99 235', '700': '29 78 216',
      '800': '30 64 175', '900': '30 58 138', '950': '23 37 84',
    },
  },
  contact: {
    phone: AGROPLUS_PHONE,
    phoneUk: AGROPLUS_PHONE,
    phoneUa: AGROPLUS_PHONE,
    waNumber: AGROPLUS_DIGITS,
    waDisplay: AGROPLUS_PHONE,
    whatsapp: `https://wa.me/${AGROPLUS_DIGITS}`,
    viber: `viber://chat?number=%2B${AGROPLUS_DIGITS}`,
    telegram: 'https://t.me/agroplus_manager',
    email: 'sales@agroplus.ua',
    personalEmail: 'manager@agroplus.ua',
    personName: 'Олена, менеджер',
  },
  social: { instagram: '', instagramHandle: '', telegramChannel: '', telegramChannelHandle: '', facebook: '' },
  company: {
    legalName: 'ТОВ «АгроПлюс»',
    legalNameFull: 'Товариство з обмеженою відповідальністю «АгроПлюс»',
    number: '12345678',
    numberLabel: 'ЄДРПОУ', // для ФОП — 'РНОКПП'
    since: 2015,
    vat: '',
    address: 'вул. Польова, 10, Вінниця, 21000, Україна',
    street: 'вул. Польова, 10',
    city: 'Вінниця',
    postalCode: '21000',
    countryCode: 'UA',
    jurisdictionUk: 'Україні',
    jurisdictionEn: 'Ukraine',
    registryUrl: '',
    privacyEmail: 'privacy@agroplus.ua',
  },
  analytics: {
    metaPixelId: '000000000000000',
    ga4Id: 'G-XXXXXXXXXX',
    googleAdsId: 'AW-000000000',
    metaCapiTokenEnv: 'TENANT_AGROPLUS_META_CAPI_TOKEN',
  },
  leads: {
    idPrefix: 'AGP',
    telegramBotTokenEnv: 'TELEGRAM_BOT_TOKEN', // або 'TENANT_AGROPLUS_TELEGRAM_BOT_TOKEN' для окремого бота
    telegramChatIdEnv: 'TENANT_AGROPLUS_TELEGRAM_CHAT_ID',
    googleSheetUrlEnv: 'TENANT_AGROPLUS_GOOGLE_SHEET_URL',
    crmWebhookUrlEnv: 'TENANT_AGROPLUS_CRM_WEBHOOK_URL',
    crmWebhookSecretEnv: 'TENANT_AGROPLUS_CRM_WEBHOOK_SECRET',
    notifyOwner: true,
    csvExportTokenEnv: 'TENANT_AGROPLUS_CSV_TOKEN',
  },
  pricing: {
    mode: 'partner',
    partnerMarginPct: 0.07, // маржа імпорту партнера, частка від молотка
    partnerMarginMinGbp: 400,
    ownerSharePct: 0.5, // наша частка за договором
    ownerShareMinGbp: OWNER_SHARE_MIN_GBP, // £150 / £299 / £799
    exportDocsGbp: 70,
    showUkVatDeposit: true,
    ukVatDepositRate: 0.2,
    paymentSchedule: [0.2, 0.5, 0.3],
  },
  features: { parts: false, reels: [], telegramChannelCta: false, showAuctionHouses: false },
  seo: { indexable: false }, // true — лише після приймання (крок 8)
};

export const TENANTS: Tenant[] = [DEFAULT_TENANT, DEMO_TENANT, AGROPLUS_TENANT];
```

Не чіпати `DEFAULT_TENANT`. Порожній рядок у `social.*` / відсутній ID в `analytics` = кнопка/скрипт не показується.

---

## Крок 3. Файли бренду

```
public/tenants/agroplus/
  logo.svg        — лого для світлого фону (header/footer, schema.org)
  logo-dark.svg   — (необов'язково) для темного фону
  og.png          — 1200×630, ≤ 300 КБ, без NoLimitGoods і логотипів аукціонів
  favicon.svg     — або favicon.png 512×512
```

Перевірити SVG: немає вбудованих зовнішніх шрифтів/посилань, `viewBox` задано, файл ≤ 50 КБ.

---

## Крок 4. Змінні середовища у Vercel

Vercel → Project → Settings → Environment Variables (Production + Preview). Шаблон: `TENANT_<ID>_<НАЗВА>`, `<ID>` = `id` у верхньому регістрі.

| Змінна | Обов'язкова | Значення / звідки |
|---|---|---|
| `TENANT_ID` | Режим 1 — так | `agroplus` (у проєкті партнера). У режимі 2 не задавати |
| `TENANT_HOST_ROUTING` | Режим 2 — так | `1` (спільний проєкт). У режимі 1 не задавати |
| `TELEGRAM_BOT_TOKEN` | так | Бот, що шле заявки (вже є в основному проєкті; у режимі 1 — скопіювати) |
| `TENANT_AGROPLUS_TELEGRAM_BOT_TOKEN` | ні | Якщо партнеру окремий бот (тоді вказати в `telegramBotTokenEnv`) |
| `TENANT_AGROPLUS_TELEGRAM_CHAT_ID` | так* | chat id групи партнера (крок 6), напр. `-1001234567890` |
| `TENANT_AGROPLUS_GOOGLE_SHEET_URL` | ні | URL Google Apps Script партнера |
| `TENANT_AGROPLUS_CRM_WEBHOOK_URL` | ні* | URL вебхука CRM |
| `TENANT_AGROPLUS_CRM_WEBHOOK_SECRET` | з вебхуком | Випадковий секрет: `openssl rand -hex 32`, передати партнеру захищено |
| `TENANT_AGROPLUS_CSV_TOKEN` | так | `openssl rand -hex 24` |
| `TENANT_AGROPLUS_META_CAPI_TOKEN` | ні | Токен Conversions API з Events Manager партнера |
| `TELEGRAM_CHAT_ID` / `OWNER_TELEGRAM_CHAT_ID` | так | Наш чат для коротких повідомлень (без контактів) |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | так (для CSV) | Vercel → Storage → KV (Upstash), підключити до проєкту |
| `LOTS_FEED_URL` | так | URL фіду лотів у Vercel Blob (той самий для всіх партнерів) |

\* Потрібен хоча б один канал: Telegram або CRM (або Sheet).

Після зміни env — **Redeploy** (env застосовуються лише до нових деплоїв).

---

## Крок 5. Домен / CNAME

1. **Режим 1:** Vercel → Add New → Project → той самий GitHub-репо, назва `wl-agroplus`, Production Branch як в основного проєкту, env з кроку 4 (`TENANT_ID=agroplus`).
   **Режим 2:** використовуємо спільний проєкт.
2. Project → Settings → **Domains → Add** → `auction.agroplus.ua`.
3. Партнер у своєму DNS: `CNAME  auction  cname.vercel-dns.com` (TTL 300).
4. Якщо Vercel показує «Verification needed» (домен уже в іншому акаунті Vercel) — партнер додає `TXT _vercel.agroplus.ua  vc-domain-verify=…` (значення з дашборду).
5. Дочекатися статусу **Valid Configuration**; SSL видається автоматично.
6. Перевірити:
   ```bash
   dig +short CNAME auction.agroplus.ua      # cname.vercel-dns.com.
   curl -sI https://auction.agroplus.ua | head -5
   ```
7. Переконатися, що host є в `hosts` (крок 2) і `siteUrl` = `https://auction.agroplus.ua`.

Поки DNS не готовий — перевіряти на `wl-agroplus.vercel.app` (у режимі 1 бренд задається `TENANT_ID`, тож працює одразу; noindex).

---

## Крок 6. chat id Telegram-групи

1. Партнер створює групу (напр. «Заявки аукціон»), додає менеджерів.
2. Додати в групу бота (той, чий токен у `telegramBotTokenEnv`). Якщо в боті ввімкнено Privacy Mode — написати в групі `/start@<ім'я_бота>` або будь-яке повідомлення зі згадкою бота.
3. Отримати оновлення (токен не публікувати в чатах/логах):
   ```bash
   curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates" | jq '.result[].message.chat | {id, title, type}'
   ```
   Потрібен `id` групи — від'ємне число, для супергруп `-100…`.
4. Якщо `getUpdates` порожній — бот має вебхук; тимчасово переглянути: `getWebhookInfo` (не видаляти вебхук основного бота без потреби) або взяти id через `@RawDataBot`/`@getidsbot`, доданого в групу на хвилину.
5. Тест:
   ```bash
   curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
     -d chat_id=-1001234567890 -d text="Тест каналу заявок"
   ```
6. Записати id у `TENANT_AGROPLUS_TELEGRAM_CHAT_ID`. Якщо група стане супергрупою, id зміниться — повторити.

---

## Крок 7. Локальна перевірка

```bash
npm run dev     # у next dev маршрутизація за Host увімкнена автоматично
```

Браузер: `http://agroplus.localhost:3000` (Chrome/Firefox резолвлять `*.localhost` на 127.0.0.1). Або curl:

```bash
# Бренд партнера, жодного NoLimitGoods (очікується 0)
curl -s -H 'Host: agroplus.localhost' localhost:3000 | grep -ic nolimit
curl -s -H 'Host: demo.localhost' localhost:3000 | grep -i nolimit     # демо — порожній вивід

# Інші сторінки
for p in / /aukciony /rezultaty-aukcioniv /privacy /sitemap.xml /robots.txt; do
  printf '%s ' "$p"; curl -s -H 'Host: agroplus.localhost' "localhost:3000$p" | grep -ic 'nolimit\|coventry\|13146899'
done

# Запчастини редіректять на /aukciony (307)
curl -sI -H 'Host: agroplus.localhost' localhost:3000/catalog | grep -i 'location\|HTTP'

# noindex
curl -sI -H 'Host: agroplus.localhost' localhost:3000/aukciony | grep -i x-robots-tag

# Основний сайт не змінився
curl -s localhost:3000 | grep -ic nolimit          # > 0
curl -s -H 'x-tenant-id: agroplus' localhost:3000 | grep -ic nolimit   # > 0 (підробка ігнорується)

# CSV-експорт (потрібні KV_* і токен у .env.local)
curl -s -H 'Host: agroplus.localhost' -H "Authorization: Bearer $TENANT_AGROPLUS_CSV_TOKEN" \
  'localhost:3000/api/leads/export?from=2026-12-01&to=2026-12-31' | head
```

Для заявок локально — `.env.local` з тестовим chat id (окрема тестова група), не продовою.

---

## Крок 8. Чек-лист приймання перед запуском

**Бренд і тексти** (Володимир)
- [ ] `grep -ic nolimit` = 0 на всіх сторінках sitemap, у `robots.txt`, `sitemap.xml`, JSON-LD
- [ ] Лого, кольори, favicon, OG-превʼю (Telegram, Facebook Sharing Debugger)
- [ ] Футер, `/privacy`: юрособа партнера, ЄДРПОУ/РНОКПП, адреса, `privacyEmail`, право України
- [ ] Назви аукціонних домів і посилання на аукціони не показуються; лотів Ritchie Bros немає

**Техніка** (Іван)
- [ ] Домен: Valid Configuration, SSL валідний, `www`/apex партнера не зачеплені
- [ ] `/catalog` тощо → `/aukciony`; `/` — портал
- [ ] Розрахунок ціни на 3 лотах збігається з прикладом у специфікації (розд. d.4): маржа партнера, депозит UK VAT
- [ ] Лоти свіжі (фід оновлено ≤ 4 год тому)
- [ ] Основний сайт NoLimitGoods без змін

**Заявки** (менеджер партнера)
- [ ] Тестова заявка з картки лота → повна заявка в Telegram партнера, кнопки WhatsApp/Telegram працюють
- [ ] CRM отримала JSON, підпис `X-Signature` перевіряється
- [ ] Google Sheet (якщо є) — новий рядок
- [ ] CSV-експорт відкривається в Excel з кирилицею
- [ ] Нам прийшло коротке повідомлення без контактів клієнта

**Аналітика** (маркетолог)
- [ ] Meta Events Manager → Test Events: PageView, Lead (event_id = номер заявки), CAPI дедуплікується
- [ ] GA4 DebugView, Google Tag Assistant: теги партнера; тегів NoLimitGoods (`AW-670192610`, Pixel `1667641475157850`) немає

**Запуск**
- [ ] `seo.indexable: true` у записі партнера, деплой
- [ ] Партнер додав сайт у Google Search Console і подав `sitemap.xml`
- [ ] Договір, DPA, оплата Setup $700 — підтверджено

---

## Крок 9. Як вимкнути партнера

Тимчасово (несплата, пауза):
- **Режим 1:** Vercel → проєкт партнера → Settings → Domains → видалити домен (або Pause Project). Основний сайт не зачеплено.
- **Режим 2:** прибрати host з `hosts` у `lib/tenants.ts` і задеплоїти — запити на `auction.agroplus.ua` перестануть отримувати бренд партнера (впадуть на NoLimitGoods), тому **обов'язково** також видалити домен у Vercel → Domains, щоб піддомен не показував наш сайт.

Остаточно:
1. Видалити домен у Vercel; попросити партнера прибрати CNAME.
2. Видалити запис з `TENANTS` і папку `public/tenants/<id>/`.
3. Видалити env `TENANT_<ID>_*` (і Vercel-проєкт у режимі 1).
4. Вивантажити партнеру CSV заявок, потім видалити ключ `leads:<id>` з KV (за DPA).
5. Вийти бота з Telegram-групи партнера; відкликати CRM-секрет.
6. Записати дату вимкнення в договорі/обліку (строк Non-Circumvention рахується від неї).
