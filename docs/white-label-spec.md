# White Label аукціонного порталу — технічна специфікація

> Гілка: `white-label-foundation`. Документ від 26.11.2026. Пілот — орієнтовно з **14.12.2026**.
> Власник продукту: Іван Ціпан (NoLimitGoods Ltd, UK). Канал продажу партнерам: агент Володимир Кулініч (ФОП, Київ).
> Інструкція підключення конкретного партнера — [`docs/white-label-onboarding.md`](./white-label-onboarding.md).

## 0. Суть

Український дистриб'ютор техніки отримує аукціонний портал на своєму піддомені (напр. `auction.домен.ua`)
під своїм брендом. Лоти з аукціонів Великої Британії та ЄС оновлюються автоматично кожні 1–4 год,
заявки клієнтів ідуть у Telegram або CRM дистриб'ютора. Закупівлю на аукціоні, експортні документи,
повернення UK VAT і логістику UK → UA виконує NoLimitGoods.

Жорсткі вимоги до партнерського сайту:

| Вимога | Як забезпечено |
|---|---|
| Жодної згадки NoLimitGoods в інтерфейсі, мета-тегах, schema.org, повідомленнях | Усі бренд-рядки беруться з `Tenant` (`lib/tenants.ts`), а не з `lib/site-config.ts`; перевірка `curl … \| grep -i nolimit` (розд. e) |
| Назви аукціонних домів приховані | На картці лота лише країна й дата торгів (`lib/auction-public.ts` → `publicPlace`, `tradeDates`); для партнера — без назви дому і без посилання на оригінальний лот |
| Ritchie Bros не використовуємо (RB заборонив експорт в Україну) | Лоти з `auction` = `rb-*` (зараз є в `lib/auction-europe.ts`) відфільтровуються для партнерів; парсера RB немає |
| Контакти клієнта бачить лише дистриб'ютор | NoLimitGoods отримує коротке повідомлення без контактів (Non-Circumvention, розд. b) |

---

## a) Мультибрендовість

### a.1. Конфіг партнера за доменом

Файл: `lib/tenants.ts`. Масив `TENANTS = [DEFAULT_TENANT, DEMO_TENANT, …]`.
Пошук: `tenantByHost(host)` — точний збіг host без порту в `hosts[]`; немає збігу → `DEFAULT_TENANT` (NoLimitGoods).
Секрети в конфігу **не зберігаються** — лише назви env (`…Env`), значення лежать у Vercel → Settings → Environment Variables.
У браузер передається `PublicTenant` = `Tenant` без `leads` (`toPublicTenant`).

| Поле | Тип / приклад | Призначення |
|---|---|---|
| `id` | `'demo'` | Ідентифікатор; заголовок `x-tenant-id`, ключ KV `leads:<id>`, папка `public/tenants/<id>/` |
| `hosts` | `['demo.localhost', 'auction.demo-tekhnika.ua']` | Host-и без порту; перший — канонічний |
| `siteUrl` | `'https://auction.domen.ua'` | Канонічний URL без `/` — canonical, OG url, sitemap, robots |
| `isDefault` | `false` | `true` лише для NoLimitGoods |
| `brand.name` | `'АгроТех Аукціон'` | Назва в заголовках, alt, текстах |
| `brand.nameLegal` | `'ТОВ «АгроТех Демо»'` | `og:site_name`, підписи |
| `brand.tagline` | `'ТЕХНІКА З АУКЦІОНІВ ЄВРОПИ'` | Підпис під лого у футері |
| `brand.logo` | `'/tenants/demo/logo.svg'` | Лого для світлого фону |
| `brand.ogImage` / `ogAuctionsImage` | `'/tenants/demo/og.png'` | OG 1200×630 (за замовчуванням / для `/aukciony` і лендингів) |
| `brand.favicon` | `'/tenants/demo/favicon.svg'` | Іконка вкладки |
| `brand.palette` | `BrandPalette \| null` | 11 RGB-трійок `'r g b'` для `--brand-50…950`; `null` — червоний NoLimitGoods |
| `contact.*` | `phone, phoneUk, phoneUa, waNumber, waDisplay, whatsapp, viber, telegram, email, personalEmail, personName` | Кнопки дзвінка/WhatsApp/Viber/Telegram, email, ім'я менеджера |
| `social.*` | `instagram, instagramHandle, telegramChannel, telegramChannelHandle, facebook` | Порожній рядок → кнопка не показується |
| `company.legalName` / `legalNameFull` | `'ТОВ «…»'` / повна назва | Футер, політика конфіденційності, schema.org |
| `company.number` / `numberLabel` | `'12345678'` / `'ЄДРПОУ'` або `'РНОКПП'` | Реквізити |
| `company.since`, `vat` | `2020`, `''` | Рік; ІПН платника ПДВ (`''` — не показувати) |
| `company.address, street, city, postalCode, countryCode` | `'UA'` | Адреса; `countryCode` ISO-2 для schema.org |
| `company.jurisdictionUk` / `jurisdictionEn` | `'Україні'` / `'Ukraine'` | Право, що застосовується, у політиці |
| `company.registryUrl` | URL або `''` | Посилання на реєстр (ЄДР) |
| `company.privacyEmail` | `'privacy@…'` | Email для запитів щодо персональних даних |
| `analytics.metaPixelId` / `googleAdsId` / `ga4Id` | `'123…'`, `'AW-…'`, `'G-…'` | Без значення — скрипт не підключається |
| `analytics.metaCapiTokenEnv` | `'TENANT_DEMO_META_CAPI_TOKEN'` | Назва env з токеном Meta Conversions API |
| `leads.idPrefix` | `'DEMO'` | Номер заявки `DEMO-123456` |
| `leads.telegramBotTokenEnv` | `'TELEGRAM_BOT_TOKEN'` | Бот (може бути спільний або окремий бот партнера) |
| `leads.telegramChatIdEnv` | `'TENANT_DEMO_TELEGRAM_CHAT_ID'` | Чат партнера для повної заявки |
| `leads.googleSheetUrlEnv` | `'TENANT_DEMO_GOOGLE_SHEET_URL'` | Google Apps Script партнера |
| `leads.crmWebhookUrlEnv` / `crmWebhookSecretEnv` | `'TENANT_DEMO_CRM_WEBHOOK_URL'` / `…_SECRET` | CRM-вебхук і секрет HMAC |
| `leads.notifyOwner` | `true` | Коротке повідомлення NoLimitGoods без контактів |
| `leads.csvExportTokenEnv` | `'TENANT_DEMO_CSV_TOKEN'` | Токен для `/api/leads/export` |
| `pricing.mode` / `partnerMarginPct` / `partnerMarginMinGbp` / `ownerSharePct` / `ownerShareMinGbp` | `'partner'` / `0.06` / `400` / `0.5` / `150/299/799` | Маржа імпорту партнера і наша частка (розд. d) |
| `pricing.showUkVatDeposit` / `ukVatDepositRate` | `true` / `0.2` | Рядок «депозит UK VAT 20%» |
| `features.parts` | `false` | Розділи запчастин; для партнерів вимкнено |
| `features.reels` | `[]` | Reels на головній (для партнера — порожньо або його власні) |
| `features.telegramChannelCta` | `false` | Блок «наш Telegram-канал» |
| `seo.indexable` | `false` для демо/стейджу | robots + `X-Robots-Tag` |

### a.2. Визначення партнера в рантаймі

- `middleware.ts`: tenant = `TENANT_ID` (якщо задано) або `tenantByHost(x-forwarded-host || host)`.
  - Основний домен: заголовок `x-tenant-id` від клієнта **перезаписується** на `nolimitgoods` (не довіряємо підробці).
  - Партнер з `features.parts=false`: `/catalog`, `/part`, `/zapchastyny`, `/spectehnika`, `/vidguk` (і вкладені) → 307 на `/aukciony`; `/` → rewrite на `/aukciony` (URL у браузері лишається `/`).
  - `seo.indexable=false` → заголовок `X-Robots-Tag: noindex, nofollow`.
- `lib/tenant-server.ts`: `getTenant()` — для server-компонентів і `generateMetadata`; `getTenantFromRequest(req)` — для Route Handlers (`/api/lead`, `/api/leads/export`).
- `lib/tenant-context.tsx`: `TenantProvider` (обгортає дерево в `app/layout.tsx`) і `useTenant()` для client-компонентів. Поза провайдером — NoLimitGoods.

### a.3. Режими розгортання

| Режим | Як увімкнути | Рендер | Плюси | Мінуси |
|---|---|---|---|---|
| **1. Проєкт на партнера** | Окремий Vercel-проєкт з того ж репо, env `TENANT_ID=<id>` | Статика / ISR, як зараз | Швидкий TTFB, дешево, ізоляція env і доменів, збій одного не чіпає інших | N проєктів, N збірок на кожен коміт, env дублюються |
| **2. Один деплой, бренд за Host** | `TENANT_HOST_ROUTING=1` | Усі сторінки динамічні (читають `headers()`) | Один проєкт, один деплой, нові партнери без нових проєктів | Дорожче (кожен запит — функція), повільніший TTFB, ризик витоку кешу між брендами при помилці в коді |
| **3. Нічого** | — | Як зараз | Основний сайт NoLimitGoods без змін | Партнерів немає |

У `next dev` режим 2 увімкнений автоматично (`hostRoutingEnabled()`), щоб перевіряти `Host: demo.localhost`.
**Рекомендація для пілоту — режим 1** (один-два партнери, мінімальний ризик для основного сайту). Рішення — за Іваном (розд. «Відкриті рішення»).

### a.4. Кольори і лого

- `tailwind.config.ts`: палітра `red-*` перенаправлена на `rgb(var(--brand-NNN) / <alpha-value>)`.
- `app/globals.css`: `:root { --brand-50 … --brand-950 }` = стандартні значення Tailwind red → вигляд NoLimitGoods не змінюється.
- `app/layout.tsx`: якщо `tenant.brand.palette` задано — інлайн `<style>` з перевизначенням змінних. Достатньо одного основного HEX від партнера: шкалу 50–950 генеруємо (напр. uicolors.app / tints.dev) і перевіряємо контраст тексту на `600/700` (WCAG AA ≥ 4.5:1).
- Лого: `brand.logo` (header, footer, schema.org `logo`), alt = `brand.name`.

### a.5. Куди підставляється який бренд-рядок

| Місце | Поле конфігу | Файл(и) |
|---|---|---|
| Header: лого, alt, назва | `brand.logo`, `brand.name` | header-компонент, `app/layout.tsx` |
| Footer: назва, tagline, реквізити, контакти | `brand.nameLegal`, `brand.tagline`, `company.*`, `contact.*`, `social.*` | footer-компонент |
| Кнопки WhatsApp/Viber/Telegram/тел. | `contact.whatsapp`, `viber`, `telegram`, `phone` | `app/components/auction-lot-ui.tsx`, CTA-компоненти |
| `<title>`, `description` | шаблон `%s — ${brand.name}` | `generateMetadata` у `app/layout.tsx`, `app/aukciony/layout.tsx`, `app/[landing]`, `app/rezultaty-aukcioniv` |
| `og:title/description/site_name/url/image`, `twitter:*` | `brand.name`, `brand.nameLegal`, `siteUrl`, `brand.ogImage` / `ogAuctionsImage` | ті самі `generateMetadata`, `metadataBase = new URL(siteUrl)` |
| canonical | `siteUrl` + шлях | `generateMetadata` |
| schema.org `Organization` | `brand.name`, `company.legalName`, `logo`, `siteUrl`, `contact.phone/email`, `company.address/countryCode`, `social.*` (`sameAs`) | `app/layout.tsx` (JSON-LD) |
| schema.org `Offer` / `Product` лота | `seller` = `company.legalName`, `url` = `siteUrl` + лот | `app/aukciony`, лендинги |
| favicon | `brand.favicon` | `metadata.icons` у `app/layout.tsx` |
| Telegram-повідомлення заявки | `leads.idPrefix`, `brand.name` у шапці | `app/api/lead/route.ts` |
| Номер заявки | `${leads.idPrefix}-${6 цифр}` | клієнтські форми + `/api/lead` |
| Політика конфіденційності / умови | `company.*`, `privacyEmail`, `jurisdiction*` | `app/privacy` |
| Блок «Перевірте нас» / trust | `company.*` | `app/components/trust-banner.tsx` |
| Reels, Telegram-канал | `features.reels`, `features.telegramChannelCta` | `app/components/telegram-channel-cta.tsx`, головна |
| robots / sitemap | `seo.indexable`, `siteUrl`, `features.parts` | `app/robots.ts`, `app/sitemap.ts` |
| Pixel / gtag | `analytics.*` | `app/layout.tsx` |
| Meta CAPI | `analytics.metaCapiTokenEnv`, `metaPixelId` | `lib/meta-capi.ts` |

Контрольне правило: на сайті партнера `grep -i "nolimit\|ціпан\|coventry\|13146899\|GB372654187"` по HTML (включно з JSON-LD і `__NEXT_DATA__`/RSC-payload) має давати **0** збігів. Також не повинно бути посилань на `t.me/nolimitgoods`, `instagram.com/nolimit_goods`, `/logo.png`, `/og-nlg.png`.

### a.6. Політика конфіденційності на юрособу партнера

- **Контролер персональних даних** — дистриб'ютор (`company.legalNameFull`, `number`, `address`, `privacyEmail`). Сторінка `/privacy` рендериться з конфігу, право — `company.jurisdictionUk` (для партнерів — Україна, Закон України «Про захист персональних даних»; для NoLimitGoods — UK GDPR).
- **NoLimitGoods — обробник/субпідрядник** за договором з партнером: хостинг сайту, технічна передача заявки в канали партнера, закупівля і логістика.
- **Що отримує NoLimitGoods:** лише дані лота (номер лота/артикул, джерело, ціна), номер заявки, ідентифікатор партнера, час. **Не отримує:** ім'я, телефон, email, Telegram, коментар клієнта.
- Технічно заявка проходить через функцію `/api/lead` на нашому Vercel-акаунті і (якщо налаштовано) зберігається в KV під ключем `leads:<tenantId>` для CSV-експорту партнеру. Це треба прямо зазначити в політиці («технічний підрядник, хостинг у ЄС/США — Vercel, Upstash») і в договорі (DPA): строк зберігання (пропозиція — 12 міс), видалення за запитом партнера.
- Cookie-банер (`app/cookie-consent.tsx`) і Consent Mode для gtag — ті самі, тексти без бренду NoLimitGoods.

### a.7. Pixel / GA4 / Google Ads для кожного партнера

- `app/layout.tsx` підключає Meta Pixel, якщо є `analytics.metaPixelId`; gtag.js — якщо є `googleAdsId` або `ga4Id` (`gtag('config', …)` для кожного наявного ID). Без ID — скриптів немає взагалі (у демо їх немає).
- Події: `PageView`, `Lead` з `eventID = leadId` (дедуплікація з CAPI), `Contact` на кліки по месенджерах — ті самі, що в NoLimitGoods.
- Meta CAPI (`lib/meta-capi.ts`): pixel id з конфігу партнера, токен з `process.env[analytics.metaCapiTokenEnv]`; немає токена — подія не шлеться.
- Pixel NoLimitGoods (`1667641475157850`) і `AW-670192610` на сайті партнера **не підключаються**.

### a.8. OG-картинки

- 1200×630 px, PNG/JPG до 300 КБ, лого партнера + слоган, без логотипів аукціонних домів і без NoLimitGoods.
- Файли: `public/tenants/<id>/og.png` (за замовчуванням) і за бажанням `og-aukciony.png`. Якщо партнер не дав — робимо з його лого й кольору (з дозволу).
- Перевірка: Facebook Sharing Debugger, Telegram (@WebpageBot для скидання кешу превʼю).

### a.9. robots / sitemap для піддоменів

- `app/robots.ts`: для `seo.indexable=false` — `Disallow: /`; інакше `Allow: /`, `Disallow: /api/`; `Sitemap: <siteUrl>/sitemap.xml`.
- `app/sitemap.ts`: окремий sitemap на host (`siteUrl` партнера). Для `features.parts=false` — лише `/aukciony`, `/rezultaty-aukcioniv`, лендинги з `lib/landings.ts`, `/privacy`.
- Демо і стейдж (`*.vercel.app`, `demo.*`) — завжди `indexable: false` + `X-Robots-Tag`. Прод-піддомен партнера вмикаємо `indexable: true` лише після приймання (розд. e).
- Партнер додає піддомен у свій Google Search Console (DNS-TXT) і подає sitemap.
- Дублі контенту між партнерами і NoLimitGoods (ті самі лоти): canonical на власний `siteUrl`, тексти лендингів по можливості унікалізувати (не блокер для пілоту).

### a.10. Підключення піддомену (CNAME) на Vercel

1. Vercel → Project (режим 1 — проєкт партнера; режим 2 — спільний) → **Settings → Domains → Add** → `auction.домен.ua`.
2. Vercel покаже потрібний запис. Партнер у DNS свого домену додає: `CNAME auction → cname.vercel-dns.com` (TTL 300–3600).
3. Якщо домен (або батьківський `домен.ua`) уже прив'язаний до **іншого** акаунту Vercel — Vercel попросить TXT-верифікацію: `TXT _vercel.домен.ua → vc-domain-verify=…` (значення з дашборду).
4. SSL (Let's Encrypt) Vercel видає автоматично після того, як DNS почне резолвитись (зазвичай хвилини, до 24–48 год через TTL/кеш провайдера).
5. Додати host у `hosts` партнера в `lib/tenants.ts`, оновити `siteUrl` на `https://auction.домен.ua`, задеплоїти.
6. Перевірити: `dig CNAME auction.домен.ua`, `curl -I https://auction.домен.ua` (200, валідний сертифікат), бренд на сторінці.

CAA-записи: якщо в домені партнера є CAA, має бути дозволено `letsencrypt.org`.

---

## b) Маршрутизація заявок

### b.1. Потік

```
Форма на сайті партнера ──POST /api/lead──► getTenantFromRequest(req)
   │
   ├─ tenant.isDefault (NoLimitGoods) ─► як зараз: TELEGRAM_CHAT_ID + GOOGLE_SHEET_URL + Meta CAPI
   │
   └─ партнер:
        1. Telegram: повна заявка → env[leads.telegramChatIdEnv] (бот env[leads.telegramBotTokenEnv])
        2. Google Sheet партнера → env[leads.googleSheetUrlEnv]
        3. CRM-вебхук → POST JSON на env[leads.crmWebhookUrlEnv], X-Signature = HMAC-SHA256(body, env[crmWebhookSecretEnv])
        4. KV: LPUSH leads:<tenantId> (якщо задано KV_REST_API_URL + KV_REST_API_TOKEN)
        5. Meta CAPI партнера (якщо є pixel + токен)
        6. leads.notifyOwner → коротке повідомлення NoLimitGoods (TELEGRAM_CHAT_ID або OWNER_TELEGRAM_CHAT_ID) — без контактів
```

Правила:
- Заявка вважається доставленою, якщо спрацював хоча б один канал партнера (Telegram / Sheet / CRM / KV); інакше `502 delivery_failed` і клієнт бачить запасні контакти партнера.
- Канали викликаються паралельно (`Promise.allSettled`), таймаут CRM — 8 с, одна повторна спроба при 5xx.
- Повідомлення NoLimitGoods не впливає на статус відповіді клієнту.
- Антиспам (honeypot `website_hp`) і обмеження розмірів — як зараз у `app/api/lead/route.ts`.
- Для NoLimitGoods логіка лишається як зараз (поточний `app/api/lead/route.ts`: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `GOOGLE_SHEET_URL`).

### b.2. Формат вебхука CRM

`POST <crmWebhookUrl>`, заголовки:

```
Content-Type: application/json
X-Signature: sha256=<hex HMAC-SHA256 від сирого тіла, ключ = секрет з env>
X-Lead-Id: DEMO-482913
X-Tenant-Id: demo
User-Agent: AuctionPortal-Webhook/1.0
```

Тіло:

```json
{
  "event": "lead.created",
  "version": 1,
  "leadId": "DEMO-482913",
  "tenantId": "demo",
  "createdAt": "2026-12-14T09:41:27.512Z",
  "contact": {
    "raw": "+380 67 123 4567",
    "name": "Олександр",
    "phone": "+380671234567",
    "email": null,
    "telegram": null
  },
  "country": "Україна",
  "comment": "Цікавить з доставкою в Житомир, бюджет до $45 000",
  "items": [
    {
      "lot": "1452",
      "itemId": "ea-leeds-dec-1452",
      "title": "Гусеничний екскаватор 14 т, 2018, 6 200 м/г",
      "category": "excavators",
      "country": "Англія",
      "endsAt": "2026-12-17T10:00:00.000Z",
      "currentBidGbp": 21000,
      "turnkeyGbp": [39000, 46200],
      "url": "https://auction.demo-tekhnika.ua/aukciony#ea-leeds-dec-1452"
    }
  ],
  "source": "lot-card",
  "page": "/aukciony",
  "utm": { "source": "facebook", "medium": "cpc", "campaign": "excavators-dec" }
}
```

Перевірка підпису на боці CRM (Node):

```js
const sig = 'sha256=' + crypto.createHmac('sha256', SECRET).update(rawBody).digest('hex');
crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(req.headers['x-signature']));
```

Очікувана відповідь: будь-який `2xx`. `url` лота веде на сайт партнера, а не на аукціон (назви домів приховані).

### b.3. Приклад повідомлення партнеру (Telegram, HTML)

```
🆕 НОВА ЗАЯВКА DEMO-482913
━━━━━━━━━━━━━━━━━━━━
👤 Контакт: +380 67 123 4567 (Олександр)
🌍 Доставка: Україна

🚜 Лоти (1):
1. Лот 1452 — Гусеничний екскаватор 14 т, 2018, 6 200 м/г
   Англія · торги 17 грудня · ставка £21 000
   Під ключ ≈ £39 000–46 000 (≈ $50 500–60 000)

💬 Цікавить з доставкою в Житомир, бюджет до $45 000
🔎 lot-card | /aukciony
[✈️ Telegram] [💬 WhatsApp]
```

Без назви аукціонного дому, без NoLimitGoods.

### b.4. Приклад повідомлення нам (NoLimitGoods)

```
🤝 Партнер: АгроТех Аукціон (demo)
Заявка DEMO-482913 · 14.12.2026 11:41 (Київ)
Лоти: ea-leeds-dec-1452 (лот 1452)
Контакти клієнта — у партнера.
```

Без імені, телефону, email, Telegram, коментаря клієнта.

### b.5. Експорт у CSV

`GET /api/leads/export?from=2026-12-01&to=2026-12-31` з `Authorization: Bearer <token>` або `?token=<token>`;
токен = `process.env[leads.csvExportTokenEnv]`. Партнер визначається за Host (токен одного партнера не відкриває чужі заявки). Читає `leads:<tenantId>` з KV. UTF-8 з BOM (щоб Excel відкривав кирилицю), роздільник `,`.

| Колонка | Приклад |
|---|---|
| `lead_id` | DEMO-482913 |
| `created_at` | 2026-12-14T09:41:27Z |
| `contact` | +380 67 123 4567 |
| `name` | Олександр |
| `country` | Україна |
| `lots` | 1452 |
| `item_ids` | ea-leeds-dec-1452 |
| `titles` | Гусеничний екскаватор 14 т, 2018 |
| `turnkey_gbp_from` / `turnkey_gbp_to` | 39000 / 46200 |
| `comment` | … |
| `source` / `page` | lot-card / /aukciony |
| `utm_source` / `utm_medium` / `utm_campaign` | facebook / cpc / excavators-dec |
| `delivered` | telegram;sheet;crm |

Відповіді: `401` без/з невірним токеном, `400` на невалідні дати, `503` якщо KV не налаштовано.

### b.6. Non-Circumvention

- Технічно: NoLimitGoods не отримує контактів клієнтів партнера (b.4); у логах Vercel контакти не друкуються (лише `leadId`).
- Договірно: NoLimitGoods не звертається до клієнтів партнера напряму і не продає їм в обхід партнера протягом строку договору + 24 міс; партнер не звертається напряму до аукціонів/перевізників, яких використовує NoLimitGoods, і не розкриває джерела. Назви аукціонів на сайті приховані.
- Доступ до KV-сховища заявок мають лише партнер (CSV-токен) і технічний адміністратор; це прописати в DPA.

---

## c) Автопарсер лотів

### c.1. Поточний стан

- Лоти лежать у коді: `lib/auction-*.ts` (`auction-brightwells.ts`, `auction-cheffins.ts`, `auction-wilsons.ts`, `auction-ea-dromore.ts`, `auction-dec-uk.ts`, `auction-europe.ts`, `auction-zaragoza.ts`…), агрегуються в `lib/auction-lots.ts` (`AUCTIONS`, `AUCTION_LOTS`).
- `scripts/auction-scrape/scrape-catalogues.mjs` — збирає Cheffins і Brightwells через справжній Chrome (`playwright-core`) на ноутбуці, пише `scripts/auction-scrape/out/*.json`; далі дані вручну/скриптами переносяться в `lib/`.
- Архів результатів: `lib/auction-archive.json`, `lib/auction-results.ts`, `scripts/archive-results.ts`.

### c.2. Цільова архітектура

```
scripts/parsers/
  types.ts             — інтерфейс джерела + нормалізована модель лота
  sources/euro-auctions.mjs  (Leeds, Dromore, ЄС-майданчики EA)
  sources/wilsons.mjs
  sources/cheffins.mjs
  sources/brightwells.mjs
  sources/bca.mjs      — заглушка
  sources/dealers.mjs  — заглушка (фіди дилерів)
  run.mjs              — запуск усіх/одного (--source=…), злиття, архівація
  alert-telegram.mjs   — алерт при збої
  out/<source>.json, out/lots.json, out/archive.json
.github/workflows/parse-lots.yml  — cron закоментований до погодження
lib/lots-data.ts       — адаптер getLots() для сайту
```

Інтерфейс джерела: `{ id, name, priority, fetchAuctions(): AuctionInfo[], fetchLots(auction): RawLot[], normalize(raw): Lot }`.
Нормалізований лот = поточний `AuctionLot` (`lib/auction-lots.ts`) + `source`, `status: 'active' | 'sold' | 'closed'`, `currentBidGbp`, `soldPriceGbp`, `currency`, `updatedAt`, `firstSeenAt`.

### c.3. Джерела по черзі (пріоритети)

| Пріоритет | Джерело | Що беремо | Техніка | Частота |
|---|---|---|---|---|
| 1 | Euro Auctions (Leeds, Dromore + ЄС) | Найбільший обсяг важкої техніки | Playwright, API каталогу | кожні 2 год, у день торгів — 1 год |
| 2 | Wilsons Auctions | Plant & commercial | Playwright | 4 год |
| 3 | Cheffins | Агро, техніка | Playwright (є код у `scrape-catalogues.mjs`) | 4 год |
| 4 | Brightwells | Plant & Machinery | API `api.brightwells.com` через сесію браузера (є код) | 4 год |
| 5 | BCA | Комерційний транспорт | заглушка (потрібен акаунт/дозвіл) | — |
| 6 | Дилери | Фіксовані ціни | заглушка (CSV/XML-фіди) | 1 раз/добу |
| ✕ | Ritchie Bros | **не використовуємо** (заборона експорту в UA) | — | — |

### c.4. Де запускати: GitHub Actions vs VPS

На Vercel headless Chrome не запускаємо (ліміт розміру функції, час виконання, блокування дата-центрових IP).

| Критерій | GitHub Actions (Playwright) | VPS (Hetzner/DO, $5–10/міс) |
|---|---|---|
| Вартість | Публічний репо — безкоштовно; **приватний** — 2 000 хв/міс на Free (3 000 на Pro), далі $0.008/хв Linux. 4 джерела × ~8 хв × 12 запусків/добу ≈ 11 500 хв/міс → **платно** (~$75/міс) або рідше запускати | $5–10/міс фіксовано, необмежені запуски |
| IP-блокування | IP Azure змінюються, частина аукціонів (Cloudflare) блокує дата-центри | Один статичний IP — простіше потрапити в бан, але можна додати резидентний проксі |
| Ліміти | 6 год/job, cron з затримками 5–30 хв, вимикається після 60 днів без комітів у публічному репо | Немає |
| Обслуговування | Нуль: оновлення раннерів GitHub | Оновлення ОС, Chrome, моніторинг диска |
| Секрети | GitHub Secrets | `.env` на сервері |
| Старт для пілоту | Швидко (workflow уже в плані) | +4–6 год налаштування |

Рекомендація: пілот — GitHub Actions з частотою 2–4 год (вписується в 3 000 хв, якщо робити інкрементально лише активні аукціони); при блокуваннях або зростанні — VPS. Рішення за Іваном.

### c.5. Куди писати (публікація фіду)

| Варіант | Як | Затримка до сайту | Плюси | Мінуси |
|---|---|---|---|---|
| **А. Коміт `lib/lots-feed.json`** | Workflow комітить файл → автодеплой Vercel | 2–5 хв (збірка) | Історія в git, нуль інфраструктури | 12+ збірок/добу на кожен проєкт (режим 1 × N партнерів), шум у git |
| **Б. Vercel Blob** | Upload `lots.json` у Blob, URL у `LOTS_FEED_URL`; сторінки ISR `revalidate = 3600` (+ on-demand `revalidatePath` через захищений endpoint) | ≤ 1 год (або миттєво з on-demand) | Без перезбірок, один фід на всі проєкти, Blob уже використовується (`telegram-post`) | Потрібен токен Blob у GitHub Secrets |
| **В. Vercel Postgres / KV** | Лоти як рядки, сайт читає з БД | секунди | Фільтри/пошук на сервері, історія цін | Найбільше роботи, вартість запитів, динамічні сторінки |

Рекомендація для пілоту — **Б** (Blob + ISR).

Адаптер `lib/lots-data.ts`: `getLots()` → (1) `fetch(LOTS_FEED_URL, { next: { revalidate: 3600 } })`, (2) інакше імпорт `lib/lots-feed.json`, (3) інакше поточні `lib/auction-*.ts` (fallback — сайт ніколи не лишається порожнім). Валідатор схеми: якщо фід порожній або лотів < 50% від попереднього — не публікувати, слати алерт.

### c.6. Продані лоти і архів

- Кожен прогін: лот, якого немає в каталозі або `endsAt < now`, отримує `status: 'closed'`; якщо джерело показує результат — `status: 'sold'`, `soldPriceGbp`.
- На сайті показуються лише `active`. `sold` з ціною потрапляють у `out/archive.json` → `/rezultaty-aukcioniv` (як зараз `lib/auction-archive.json`); `closed` без ціни — видаляються з фіду через 7 днів.
- Дедуплікація за `source + item`; `firstSeenAt` зберігається між прогонами.
- `app/api/cron/telegram-post` (щоденні пости в наш канал) **не змінюється** і працює лише для NoLimitGoods; у партнерів `features.telegramChannelCta=false`.

### c.7. Моніторинг і алерти

`scripts/parsers/alert-telegram.mjs` (секрети `TELEGRAM_ALERT_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` у GitHub Secrets) шле в технічний чат:
- джерело впало (exception, HTTP 403/429, Cloudflare challenge) — з назвою джерела і кроком;
- 0 лотів там, де минулого разу було > 0, або падіння > 50%;
- фід не оновлювався > 6 год (перевірка `updatedAt` окремим кроком/крон-функцією);
- workflow job failed (`if: failure()`).
Щоденний підсумок (необов'язково): кількість активних лотів по джерелах.

---

## d) Формула ціни для партнера

### d.1. Що вже в коді (перевірено)

| Компонент | Значення в коді | Файл |
|---|---|---|
| Збір аукціону (buyer's premium) | 5–10% від молотка (діапазон); RB — `rbFee` (не використовуємо для партнерів) | `lib/turnkey.ts` → `premium()` |
| Наша комісія `ourFee(H)` | `max(minFee(H), round(H × pct))`, pct = **2,99%** при H ≤ £40 000, **1,99%** вище; `minFee`: H ≤ £5 000 → **£150**, H < £10 000 → **£299**, інакше **£799** | `lib/auction-lots.ts` (`FEE`, `minFee`, `ourFee`) |
| Експортні документи | `AUCTION_META.exportDocsGbp = 70` (£70) | `lib/auction-lots.ts` |
| Доставка UK → UA | `transportGbp()` за категорією: навісне £500–1 200; міні-екскаватор £1 200–2 500; екскаватор £3 500–6 000 (20 т+ £5 500–8 000); телескопічний £3 000–4 500; агро £3 000–5 000; вантажівки £2 000–3 500; пікапи £1 200–1 800; енергія £1 500–3 000; інше £2 000–4 000 | `lib/turnkey.ts` |
| Мито / акциз | спецтехніка 0–5%; вантажівки 5–10% + акциз £200–800; пікапи 10% + £300–900 | `lib/turnkey.ts` → `customs()` |
| ПДВ України | 20% на (митна вартість + мито + акциз) | `lib/turnkey.ts` → `turnkeyGbp()` |
| Брокер | £400–700 | `lib/turnkey.ts` |

Формула NoLimitGoods (не змінюється):

```
base     = H + premium + ourFee(H) + 70 + transport          // митна вартість на кордоні
turnkey  = (base × (1 + duty) + excise) × 1.20 + broker
```

### d.2. Формула для партнера (реалізовано: `lib/turnkey.ts`, ставки в `lib/tenants.ts` → `pricing`)

Для NoLimitGoods `pricing.mode = 'nlg'` — розрахунок рівно як вище (`turnkeyGbpFor(DEFAULT_TENANT.pricing, …)` = `turnkeyGbp(…)`, перевірено скриптом на трьох лотах). Для партнера `mode = 'partner'`: замість `ourFee(H)` у митну вартість іде **маржа імпорту партнера** `M`, з якої ми отримуємо свою частку.

```
Min(H)  = ownerShareMinGbp: 150, якщо H < 5 000; 299, якщо H < 10 000; 799 — від 10 000     // OWNER_SHARE_MIN_GBP
M       = max(round(H × partnerMarginPct), partnerMarginMinGbp, Min(H))                      // importMargin().total
Ours    = min(M, max(round(M × ownerSharePct), Min(H)))                                       // importMargin().owner, 50%
Partner = M − Ours                                                                            // importMargin().partner
base    = H + premium + M + exportDocsGbp(70) + transport
turnkey = (base × (1 + duty) + excise) × 1.20 + broker                                        // turnkeyGbpFor()
ukVatDeposit = ukVatDepositRate(0.20) × (H + premium)   // лише лоти з UK (аукціон у £), окремий рядок, ПОВЕРТАЄТЬСЯ
```

- Рядки для картки/калькулятора — `turnkeyBreakdown(pricing, lot, H)`: молоток, збір аукціону, комісія за викуп, експортні документи, доставка, розмитнення, «Депозит UK VAT 20%» (`refundable: true`, не входить у суму під ключ).
- Сервісний пакет (огляд, фото/відео, перевірка) — 100% партнеру, у формулу сайту не входить, партнер додає його окремо.
- Ставки партнера — у конфігу: `partnerMarginPct`, `partnerMarginMinGbp`, `ownerSharePct`, `ownerShareMinGbp`, `exportDocsGbp`, `showUkVatDeposit`, `ukVatDepositRate`, `paymentSchedule`.
- Межі мінімумів у коді: «до £5k» = H < 5 000, «до £10k» = H < 10 000 (у `minFee()` NoLimitGoods межа £5 000 включна — для договору варто зафіксувати одне формулювання).
- Поки що функції партнера є в коді, але картки лотів і сторінка результатів ще рахують через `turnkeyGbp()` — переведення UI на `turnkeyGbpFor()/turnkeyBreakdown()` у плані (див. e.1).

`ukVatDeposit` не входить у ціну під ключ: це тимчасово заморожена сума, яку клієнт вносить разом із другим платежем і отримує назад після підтвердження експорту (зазвичай 4–8 тижнів після вивозу). Для лотів з ЄС рядок не показується (VAT за правилами країни — уточнюється під лот).

### d.3. Комерційна модель (умови з переговорів)

| Пункт | Умова |
|---|---|
| Модель | Гібридна: фіксовані платежі + частка маржі з угод |
| Setup (разово) | **$700** — налаштування бренду, домену, каналів заявок, навчання |
| Абонплата | **$200/міс** — хостинг, оновлення лотів кожні 1–4 год, підтримка |
| Наша частка з угоди | **50% маржі імпорту**, але не менше **£150** (лот до £5 000) / **£299** (до £10 000) / **£799** (від £10 000) |
| Експортні документи | **£70** за лот (окремо, у собівартості) |
| UK VAT | 20% на молоток + збір аукціону як **депозит**, повертаємо після експорту |
| Сервісний пакет (огляд, фото/відео, перевірка, супровід) | **100% дистриб'ютору** |
| Оплата клієнта | **20 / 50 / 30** (див. d.5) |
| Доставка UK → UA | **25–35 днів** |
| Джерела | Euro Auctions (Leeds, Dromore), Cheffins, Wilsons, Brightwells, BCA, дилери. **Ritchie Bros — ні.** Назви аукціонів на сайті приховані |

Формула взаєморозрахунків (на кожну закриту угоду):

```
Cost   = H + premium + 70 + transport_fact + duty_fact + excise + VAT_UA_fact + broker_fact   // фактична собівартість
M      = ClientPrice_fact − Cost − ServicePackage            // маржа імпорту
Min(H) = 150, якщо H ≤ 5 000;  299, якщо H < 10 000;  799, якщо H ≥ 10 000   // = minFee(H) у lib/auction-lots.ts
Ours   = max(0.5 × M, Min(H))
Partner= M − Ours + ServicePackage
```

Зв'язок з кодом: на сайті у `turnkey` вже закладено `ourFee(H)` (2,99%/1,99%, з тими самими мінімумами), а зверху — `partnerMargin`. Отже, за оціночної собівартості `M ≈ ourFee(H) + partnerMargin`. Сайт показує орієнтир; взаєморозрахунок — за фактом (інвойси аукціону, перевізника, митна декларація).
Мінімуми £150/£299/£799 у договорі збігаються з `minFee()` — **окремої константи не потрібно**, але межа «до £5k» у коді включна (`≤ 5000`), «до £10k» — невключна (`< 10000`); у договорі сформулювати так само.

### d.4. Приклади (три лоти з UK, H = £4 000 / £8 000 / £25 000), демо-конфіг: маржа 6%, мінімум £400, наша частка 50%

Пораховано кодом (`turnkeyBreakdown(DEMO_TENANT.pricing, …)`). «Від» = збір 5%, нижня доставка, мито 0%, брокер £400; «до» = збір 10%, верхня доставка, мито 5%, брокер £700. Округлено до £1.

| Рядок | Лот 1: міні-екскаватор, H £4 000 | Лот 2: телескопічний, H £8 000 | Лот 3: екскаватор 14 т, H £25 000 |
|---|---|---|---|
| Молоток | 4 000 | 8 000 | 25 000 |
| Збір аукціону 5–10% | 200 – 400 | 400 – 800 | 1 250 – 2 500 |
| Маржа імпорту M = max(6%, £400, Min) | 400 | 480 | 1 500 |
| Експортні документи | 70 | 70 | 70 |
| Доставка UK → UA | 1 200 – 2 500 | 3 000 – 4 500 | 3 500 – 6 000 |
| Розмитнення (ПДВ 20%, мито, брокер) | 1 574 – 2 616 | 2 790 – 4 301 | 6 664 – 9 818 |
| **Разом під ключ (клієнту)** | **7 444 – 9 986** | **14 740 – 18 151** | **37 984 – 44 888** |
| для порівняння: NoLimitGoods напряму | 7 144 – 9 671 | 14 523 – 17 923 | 37 143 – 44 005 |
| Депозит UK VAT 20% × (H + збір), повертається | 840 – 880 | 1 680 – 1 760 | 5 250 – 5 500 |
| Наша частка max(50% × M, Min) | 200 (Min 150) | 299 (Min) | 799 (Min) |
| Частка партнера (+ сервісний пакет 100%) | 200 | 181 | 701 |

Висновок для переговорів: при маржі 6% мінімуми £299/£799 «з'їдають» більшу частину маржі на лотах £5–25k. Щоб партнер мав ≥ 50%, маржа має бути ≈ 7,5% (лот £8k) і ≈ 6,4% (лот £25k) або більше — це рішення партнера, ставиться в `partnerMarginPct`.

### d.5. Графік оплати 20 / 50 / 30 (на прикладі лоту 3, клієнту ≈ £39 000)

| Етап | Коли | % | Сума | Що покриває |
|---|---|---|---|---|
| 1 | До торгів (резерв ставки) | 20% | £7 800 | Гарантія участі; при програші — повернення або перенесення на інший лот |
| 2 | Після виграшу (2–3 робочі дні, строк оплати аукціону) | 50% | £19 500 | Молоток + збір + наша частка + документи; **плюс окремо депозит UK VAT £5 250** |
| 3 | До розмитнення / по прибуттю в Україну (через 25–35 днів) | 30% | £11 700 | Доставка, мито, ПДВ України, брокер, маржа партнера |
| — | Після підтвердження експорту | — | −£5 250 | Повернення депозиту UK VAT |

Точні умови повернення 20% при програші і строки — у договорі з клієнтом (договір клієнта укладає партнер).

---

## e) План робіт, ризики, тестування

### e.1. План по днях (27.11 – 14.12.2026)

| Дата | Задача | Хто | Год |
|---|---|---|---|
| Пт 27.11 | Огляд гілки, `lib/tenants.ts`, middleware, `tenant-server`, `TenantProvider` у `app/layout.tsx`; рішення режим 1/2 | Розробник, Іван | 4 |
| Сб 28.11 | CSS-змінні `--brand-*`, Tailwind `red-*` → змінні; лого/favicon з конфігу | Розробник | 4 |
| Пн 30.11 | `generateMetadata` (title/OG/twitter/canonical) з tenant у `app/layout.tsx`, `app/aukciony/layout.tsx`, лендингах, `rezultaty-aukcioniv` | Розробник | 6 |
| Вт 01.12 | schema.org Organization/Offer, header/footer/trust/CTA, `/privacy` з `company.*` | Розробник | 6 |
| Ср 02.12 | Pixel/GA4/Ads з `analytics`, Meta CAPI з `metaCapiTokenEnv`; приховати назви аукціонів і фільтр `rb-*` для партнерів | Розробник | 5 |
| Чт 03.12 | `/api/lead`: маршрутизація за tenant, Telegram партнера, Sheet, CRM HMAC, повідомлення нам без контактів | Розробник | 7 |
| Пт 04.12 | KV-сховище заявок, `/api/leads/export` CSV; тести на демо | Розробник | 5 |
| Сб 05.12 | `lib/turnkey.ts`: маржа партнера, рядок UK VAT deposit, UI розрахунку на картці лота | Розробник | 5 |
| Пн 07.12 | `scripts/parsers/`: types, run, Euro Auctions, перенесення Cheffins/Brightwells з `scrape-catalogues.mjs` | Розробник | 8 |
| Вт 08.12 | Wilsons, заглушки BCA/дилерів, `archive.json`, статуси active/sold/closed | Розробник | 6 |
| Ср 09.12 | `.github/workflows/parse-lots.yml`, `alert-telegram.mjs`, Blob-публікація, `lib/lots-data.ts` + ISR | Розробник | 6 |
| Чт 10.12 | Анкета партнера отримана; запис у `tenants.ts`, файли `public/tenants/<id>/`, env, Vercel-проєкт, домен/CNAME (запас на DNS) | Розробник, партнер | 4 |
| Пт 11.12 | Повний чек-лист тестування (e.4), правки текстів (Володимир) | Усі | 6 |
| Сб 12.12 | Виправлення, вмикання cron парсера (після погодження), моніторинг 24 год | Розробник | 4 |
| Нд 13.12 | Резерв; фінальна перевірка `grep -i nolimit`, `indexable: true` для проду | Іван | 2 |
| Пн 14.12 | **Запуск пілоту**, навчання менеджера партнера (30 хв), моніторинг заявок | Іван, Володимир | 3 |
| | **Разом** | | **≈ 81 год** |

### e.2. Ризики

| Ризик | Ймовірність / вплив | Пом'якшення |
|---|---|---|
| Блокування парсерів (Cloudflare, 403/429, IP дата-центру) | Висока / середній | Рідші запити, кешування, user-agent справжнього Chrome, VPS/резидентний проксі; fallback на останній валідний фід; алерт |
| Зміна верстки/API аукціонів | Середня / середній | Ізольовані адаптери по джерелах, валідація схеми, «падіння > 50%» не публікується, алерт |
| Non-Circumvention: партнер купує напряму | Середня / високий | Приховані назви аукціонів і посилання на оригінальні лоти; договір зі штрафом; ми не бачимо контактів клієнтів — симетричний захист |
| GDPR / Закон України «Про захист персональних даних» | Середня / високий | Контролер — партнер; DPA між нами і партнером; політика на юрособу партнера; мінімізація (нам — лише дані лота); строк зберігання KV |
| Заборона Ritchie Bros | — / високий (репутаційний, юридичний) | Фільтр `rb-*` для партнерів (і, бажано, перегляд для NoLimitGoods); жодних RB-парсерів |
| Затримка DNS / CNAME у партнера | Середня / середній | Запросити CNAME за 4+ дні до запуску (10.12); запасний URL `*.vercel.app` (noindex) для демо |
| Кеш Vercel (ISR, CDN) показує старі лоти або чужий бренд | Низька–середня / високий для режиму 2 | Режим 1 (ізоляція); у режимі 2 — динамічний рендер, без `unstable_cache` без tenant у ключі; on-demand revalidate після фіду |
| Динамічний рендер (режим 2) і вартість | Середня / середній | Режим 1 для пілоту; моніторинг Function Invocations / Edge Requests у Vercel Usage |
| Витік бренду NoLimitGoods (забутий рядок у компоненті, `__NEXT_DATA__`) | Середня / високий | `grep` по всіх сторінках sitemap (скрипт), рев'ю текстів Володимиром |
| Курс GBP/USD/UAH | Середня / низький | Курс НБУ (`app/api/rates`, `revalidate 3600`), ціни як орієнтир, не оферта |

### e.3. Хто що тестує

| Хто | Зона |
|---|---|
| **Іван** | Техніка: домени, SSL, CNAME; заявка end-to-end (сайт → Telegram/CRM/Sheet/KV → повідомлення нам без контактів); формула ціни на 3 лотах проти таблиці d.4; режим розгортання; основний сайт NoLimitGoods без змін |
| **Агент Володимир** | Тексти: жодного «NoLimitGoods»/Coventry/UK-реквізитів; юрособа партнера в футері, `/privacy`, schema.org; назви аукціонів приховані; українська без помилок |
| **Менеджер партнера** | Заявки: приходять у Telegram/CRM, кнопки WhatsApp/Telegram працюють, номер з префіксом, CSV відкривається в Excel |
| **Маркетолог партнера** | Pixel (Meta Events Manager → Test Events: PageView, Lead з event_id, дедуплікація CAPI), GA4 DebugView, Google Tag Assistant (gtag, Ads conversion), відсутність пікселя NoLimitGoods |

### e.4. Чек-лист тестування

- [ ] `curl -s https://auction.домен.ua/ | grep -ic nolimit` = 0 (і для `/aukciony`, `/rezultaty-aukcioniv`, кожного лендингу, `/privacy`, `/sitemap.xml`, `/robots.txt`)
- [ ] `/catalog`, `/part/x`, `/zapchastyny/x`, `/spectehnika`, `/vidguk` → 307 на `/aukciony`
- [ ] `/` показує аукціонний портал
- [ ] title/description/OG/twitter — бренд партнера; OG-превʼю в Telegram і Facebook — картинка партнера
- [ ] JSON-LD Organization — юрособа партнера (Rich Results Test)
- [ ] Кольори й лого партнера, favicon
- [ ] На картках немає назв аукціонних домів і посилань на сайти аукціонів; немає лотів `rb-*`
- [ ] Розрахунок ціни: рядки збору, маржі партнера, депозиту UK VAT; цифри збігаються з d.4
- [ ] Заявка → Telegram партнера (повна), CRM (підпис валідний), Sheet, KV; нам — коротке без контактів
- [ ] CSV-експорт з токеном; без токена — 401; токен іншого партнера — 401
- [ ] Pixel/GA4/Ads партнера спрацьовують; пікселя NoLimitGoods немає
- [ ] Демо/стейдж: `X-Robots-Tag: noindex`, robots `Disallow: /`; прод — `indexable: true` після приймання
- [ ] Основний сайт `www.nolimitgoods.com`: вигляд, заявки, Telegram-пости, sitemap — без змін; підроблений `x-tenant-id` ігнорується
- [ ] Лоти оновились автоматично (час `updatedAt` у фіді ≤ 4 год), алерт приходить при штучному збої

---

## f) Що отримати від дистриб'ютора (чек-лист)

- [ ] **Домен:** піддомен (напр. `auction.домен.ua`) і доступ до DNS або готовність самостійно додати `CNAME auction → cname.vercel-dns.com` (+ TXT, якщо попросить Vercel)
- [ ] **Лого:** SVG + PNG (для світлого і темного фону), мін. 512 px по ширині
- [ ] **Кольори:** основний HEX (і за бажанням додатковий)
- [ ] **Favicon:** SVG/PNG 512×512 (або дозвіл зробити з лого)
- [ ] **OG-картинка** 1200×630 або дозвіл зробити
- [ ] **Контакти:** телефон, WhatsApp/Viber, Telegram, email, ім'я менеджера
- [ ] **Юрособа:** повна назва, ЄДРПОУ/РНОКПП, ІПН ПДВ (якщо є), юридична адреса, email для запитів щодо персональних даних
- [ ] **Канал заявок:** Telegram-група (додати нашого бота, отримати chat id) та/або CRM (URL вебхука, формат, чи потрібен підпис), Google Sheet (за бажанням)
- [ ] **Аналітика:** Meta Pixel ID (+ токен CAPI через захищений канал), GA4 ID, Google Ads ID
- [ ] **Соцмережі:** Instagram, Facebook, Telegram-канал (якщо є)
- [ ] **Маржа:** бажаний % і мінімум у £ на лот; чи показувати депозит UK VAT окремим рядком
- [ ] Підписані: договір (White Label, Non-Circumvention), DPA, оплата Setup $700

---

## Відкриті рішення для Івана

| # | Питання | Варіанти | Рекомендація |
|---|---|---|---|
| 1 | Де запускати парсер | GitHub Actions (приватний репо — платні хвилини понад ліміт) / VPS $5–10/міс | Пілот — Actions раз на 2–4 год; VPS при блокуваннях |
| 2 | Сховище фіду і заявок | Фід: коміт JSON / Vercel Blob / Postgres. Заявки: Vercel KV (Upstash) / Postgres | Фід — Blob + ISR; заявки — KV |
| 3 | Режим розгортання | 1 (проєкт на партнера) / 2 (один деплой за Host) | 1 для пілоту; 2 — від 5+ партнерів |
| 4 | Хто платить за домен | Партнер (його піддомен, безкоштовно) / ми (новий домен) | Піддомен партнера, наші витрати — 0 |
| 5 | Текст договору Non-Circumvention і DPA | Строк, штраф, сфера (аукціони, перевізники, клієнти) | Юрист UK + UA; строк договору + 24 міс |
| 6 | Визначення «маржі імпорту» | M = ціна клієнту − фактична собівартість (d.3) / M = лише наш `ourFee` | Перше; зафіксувати в договорі з прикладом d.4 |
| 7 | Ritchie Bros на основному сайті | Лишити `rb-*` лише для NoLimitGoods / прибрати всюди | Перевірити юридично; для партнерів — прибрано |
| 8 | Окремий Telegram-бот на партнера чи спільний | Спільний `TELEGRAM_BOT_TOKEN` / бот партнера | Спільний для пілоту (ім'я бота нейтральне, без NoLimitGoods) |

---

## Рішення і перевірка 26.11.2026

**Рішення Івана**
- **Маржа імпорту** — як домовлено з агентом Володимиром Кулінічем: наша частка = 50% маржі імпорту або мінімум £150 / £299 / £799, що більше (так уже рахує `importMargin()` у `lib/turnkey.ts`).
- **Заявки зберігаємо окремо для кожного партнера:** окремий Telegram-бот, окрема таблиця на кшталт нашої «NoLimitGoods Leads» (Google Sheet) і окремий Excel/CSV-експорт.
- **Non-Circumvention і DPA** — потрібні (тексти готує юрист).
- **Де запускати парсер** — на рекомендацію розробника (див. c.4); Vercel для парсера не використовуємо.

**Перевірка джерел наживо (26.11.2026)**
| Джерело | Стан | Примітка |
|---|---|---|
| Euro Auctions | працює | потрібен Chromium (без нього 0 лотів) |
| Cheffins | працює | виправлено розбір списку аукціонів і карток auctionmarts (таймер, продані, US-дата) |
| Wilsons | **вимкнено** | Barracuda: `WEB_SCRAPING_BLOCKED` — сайт прямо забороняє збір. Не обходимо; увімкнути після дозволу або фіду/API від Wilsons |
| Brightwells | **вимкнено** | Cloudflare 403. Не обходимо; увімкнути після дозволу або фіду |
| BCA, дилери | заглушки | — |
