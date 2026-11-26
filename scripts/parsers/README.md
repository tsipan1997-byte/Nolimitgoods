# Автопарсер лотів аукціонів

Збирає лоти з аукціонів техніки у Великій Британії та ЄС, відбирає те, на що є попит в Україні,
і складає один фід `out/lots.json` для сайту. Статуси лотів (`active` → `closed`/`sold`) ведуться між запусками,
а закриті лоти, старші за 30 днів, переносяться в `out/archive.json`. Так накопичуються результати аукціонів.

> Ritchie Bros / IronPlanet сюди **не додаємо**: вони забороняють вивезення техніки в Україну.
> Runner додатково відкидає ці доми (`BANNED_HOUSES` у `sources/index.mjs`).

## Структура

```
scripts/parsers/
  run.mjs               CLI: запуск джерел → out/<source>.json, out/lots.json, out/archive.json
  alert-telegram.mjs    перевірка фіду і сповіщення в Telegram (без змінних середовища нічого не надсилає, лише друкує текст)
  publish-blob.mjs      публікація фіду у Vercel Blob (варіант Б)
  test.mjs              офлайн-тести (node:test) на фікстурах
  package.json          окремі залежності для CI/VPS: cheerio, undici, playwright (optional)
  lib/
    source.mjs          інтерфейс джерела (JSDoc) + defineSource()
    model.mjs           NormalizedLot / NormalizedAuction, normalizeLot/validateLot, категорії, дати (Лондон → UTC)
    http.mjs            fetch з ретраями, таймаутом, нейтральним UA, проксі, офлайн-режимом і записом фікстур
    extract.mjs         cheerio-помічники, пошук вбудованого JSON і «масивів лотів» у довільному JSON
    browser.mjs         лінивий headless Chromium (Playwright) + перехоплення XHR JSON
    runner.mjs          запуск одного джерела: нормалізація, валідація
    merge.mjs           злиття з попереднім lots.json, статуси, архів
  sources/
    euroauctions.mjs    Euro Auctions (Лідс, Дромор, Сарагоса…), fetch + запасний шлях через браузер
    wilsons.mjs         Wilsons Auctions (Plant & Machinery), fetch + запасний шлях через браузер
    cheffins.mjs        Cheffins (каталоги cheffins.auctionmarts.com), список через fetch, каталоги через браузер
    brightwells.mjs     Brightwells (відкритий API api.brightwells.com), лише fetch
    bca.mjs             заглушка (enabled:false), потрібен трейдерський доступ
    dealers.mjs         заглушка (enabled:false), сток дилерів
    index.mjs           реєстр джерел
  fixtures/<source>/    збережені відповіді сайтів + manifest.json (для --offline і тестів)
  out/                  результати (у git не потрапляє)
```

## Інтерфейс джерела

Кожне джерело описується так: `defineSource({ id, house, name, enabled, needsBrowser, browserFallback, currency, baseUrl, listAuctions(ctx), listLots(auction, ctx) })`
(або `run(ctx) → { auctions, lots }`). Джерело повертає сирі поля, а нормалізує їх runner через `normalizeLot`.

`ctx` містить:
- `fetchHtml(url, {method, body, headers})` і `fetchJson(...)`: 3 ретраї з експоненційною паузою, таймаут 30 с, пауза 400 мс між запитами до сайту.
  UA нейтральний, як у звичайного Chrome (назви нашого сайту в ньому немає). 4xx не ретраїться. Якщо проксі заборонив хост (403/407 на CONNECT),
  джерело зупиняється одразу.
- `log`: `info/warn/error/debug` (`--verbose` вмикає debug).
- `limit`: скільки лотів ще можна взяти.
- `getBrowser()`: лінивий headless Chromium. Повертає `null`, якщо стоїть `--no-browser`, Playwright не встановлено або запуск офлайн.
- `offline`, `now`.

## Запуск локально

З кореня репозиторію (у корені вже є `cheerio`; Playwright береться з `scripts/parsers/node_modules`, з кореня або з глобальних модулів):

```bash
node scripts/parsers/run.mjs                                   # усі ввімкнені джерела
node scripts/parsers/run.mjs --source=euroauctions,wilsons --limit=50
node scripts/parsers/run.mjs --source=brightwells --no-browser --verbose
node scripts/parsers/run.mjs --offline=scripts/parsers/fixtures  # без мережі, з фікстур
node scripts/parsers/run.mjs --save=scripts/parsers/fixtures --limit=20 --source=wilsons  # записати реальні відповіді як фікстури
node scripts/parsers/run.mjs --publish=lib/lots-feed.json       # після злиття скопіювати фід для сайту
node scripts/parsers/test.mjs                                   # тести (офлайн, ~1 с)
node scripts/parsers/alert-telegram.mjs                         # перевірка out/lots.json, dry-run без змінних
```

Прапори `run.mjs`:

| прапор | що робить |
|---|---|
| `--source=a,b` | лише ці джерела (можна запустити й вимкнені, напр. `bca`) |
| `--limit=N` | не більше N лотів з кожного джерела (і менше запитів) |
| `--offline=<dir>` | читати відповіді з `<dir>/<source>/manifest.json` замість мережі |
| `--save=<dir>` | записувати реальні відповіді в `<dir>/<source>/` (так оновлюють фікстури) |
| `--publish=<path>` | скопіювати злитий `lots.json` у вказаний файл (напр. `lib/lots-feed.json`) |
| `--strict` | exit 1, якщо впало хоч одне джерело (без нього exit 1 лише коли впали всі) |
| `--no-browser` | не запускати Chromium; браузерні джерела й запасні шляхи вимикаються |
| `--out=<dir>` | інша тека результатів (за замовчуванням `scripts/parsers/out`) |
| `--now=<ISO>` | «поточний» час (для тестів і відтворення) |
| `--timeout=<ms>` | максимальний час на одне джерело (за замовчуванням 15 хв) |
| `--verbose` | debug-лог |

Exit codes: `0` усе добре або впала лише частина джерел; `1` впали всі джерела (або хоч одне при `--strict`); `2` невідоме джерело.

**Проксі.** Якщо задано `HTTPS_PROXY` (хмарні сесії, корпоративна мережа), на Node ≥ 22.21 `run.mjs` сам перезапускає себе з `NODE_USE_ENV_PROXY=1`.
На Node 20 використовується `undici.EnvHttpProxyAgent` з `scripts/parsers/node_modules` (`npm install --prefix scripts/parsers`). Перевірка TLS не вимикається.

## Формат `out/lots.json` (і `lib/lots-feed.json`)

```jsonc
{
  "generatedAt": "2026-11-26T09:00:00.000Z",
  "sources": {                      // стан кожного джерела за останній запуск, у якому воно брало участь
    "euroauctions": { "ok": true, "count": 8, "durationMs": 651, "at": "2026-11-26T09:00:00.000Z" },
    "wilsons": { "ok": false, "count": 0, "error": "HTTP 403 ... (Cloudflare)", "durationMs": 1200, "at": "..." }
  },
  "auctions": [                     // AuctionInfo + службові поля
    { "id": "ea-leeds-2026-11", "house": "Euro Auctions", "name": "Leeds Auction", "place": "Келлінгтон біля Лідса, Англія",
      "dates": "25–28 листопада 2026", "format": "Живі торги + онлайн-ставки", "totalLots": 9479, "unreserved": true,
      "url": "https://www.euroauctions.com/en/auctions/leeds-25th-26th-27th-28th-november-2026", "currency": "GBP",
      "source": "euroauctions", "startsAt": 1795600800000, "endsAt": 1795860000000 }
  ],
  "lots": [                         // AuctionLot + службові поля; category завжди не null (null-лоти відкинуто при злитті)
    { "auction": "ea-leeds-2026-11", "lot": "", "item": "140566690",
      "title": "Гусеничний екскаватор Hitachi ZX210LC-6", "original": "2021 Hitachi ZX210LC-6 — 700mm Pads, CV, QH, Piped",
      "category": "excavators", "year": 2021, "hours": 5210, "miles": null, "specs": "", "unused": false, "inoperable": false,
      "location": "Келлінгтон біля Лідса, Англія", "endsAt": 1795687200000, "live": true,
      "img": "https://images.euroauctionslive.com/auction-1050/140566690/1ba5….jpeg", "gallery": ["…"],   // gallery лише якщо фото > 1
      "url": "https://www.euroauctions.com/en/equipment-search/product/140566690/0/…",
      "source": "euroauctions", "house": "Euro Auctions", "sourceId": "euroauctions:140566690",
      "status": "active", "currency": "GBP", "currentBid": null, "bids": null, "soldPrice": null,
      "firstSeenAt": "…", "lastSeenAt": "…", "scrapedAt": "…", "closedAt": "…"  // closedAt лише в closed/sold
    }
  ]
}
```

- `miles` містить **кілометри**, як і в `AuctionLot` (мілі з сайту множимо на 1,609).
- `endsAt` у мс UTC: для таймерних торгів це час закриття лота, для живих (`live: true`) це день торгів, 10:00 за місцевим часом
  (у Euro Auctions день береться з «Sale Day N»).
- `title` поки складається механічно: український тип техніки за словником і оригінал без року (`makeTitle` у `model.mjs`).
  Повноцінний переклад можна додати окремим кроком.
- Порядок: спершу `active`, далі за `endsAt`.
- `out/<source>.json` має формат `{ source, house, name, ok, error?, startedAt, finishedAt, durationMs, httpRequests, counts:{auctions,lots,matched}, warnings[], auctions[], lots[] }`.
  Тут лишаються **усі** лоти, зокрема з `category: null`, тож видно, що відкинуто.
- `out/archive.json` має формат `{ updatedAt, lots: NormalizedLot[] }`: закриті й продані лоти, старші за 30 днів (результати аукціонів).

### Як рахуються статуси

1. Лот є в каталозі цього запуску: `active`, або `sold`, якщо джерело віддало ціну продажу. `firstSeenAt` береться з попереднього файлу.
2. Лот був `active` у попередньому `lots.json`, джерело відпрацювало успішно, а лота вже немає: `closed`, або `sold`, якщо раніше бачили `soldPrice`.
3. `endsAt + 2 год < now`: `closed`/`sold`, навіть якщо сайт ще показує лот.
4. Джерело впало: його лоти й аукціони з попереднього файлу лишаються як були (крім правила 3). Падіння одного джерела не зачіпає інші.
5. `closed`/`sold` з `endsAt` (або `closedAt`) старшим за 30 днів переносяться в `archive.json`.

### Категорії

`categorize()` у `model.mjs`: регулярки за ключовими словами й модельними рядами (Hitachi ZX, Komatsu PC, JCB 3CX, Manitou MT…).
Спершу перевіряється основна машина, потім навісне. Окремо ловляться випадки на кшталт «Breaker to suit 20 Ton Excavator» (це навісне, а не екскаватор).
Фургони, легкові, вінтаж, інструмент і палети дають `null`. На 837 лотах, уже відібраних вручну в `lib/*.ts`, евристика збігається з ручною категорією
у **91%** випадків; решта здебільшого спірні (причепи, сільгосп-навісне).

## Джерела: як працюють і чи потрібен браузер

| джерело | без браузера? | як |
|---|---|---|
| Brightwells | так | відкритий API `POST api.brightwells.com/api/1/sales/<id>/lots/data` (той самий, що вже використовує `scripts/auto-bids`) + сторінка відділу для списку розпродажів |
| Euro Auctions | очікувано так | `/en/auctions` → сторінка аукціону (номер каталогу `a=`) → `/en/equipment-search?a=N&page=P`: картки або вбудований JSON. Якщо HTML порожній (дані тягне XHR), використовується Chromium: він перехоплює JSON і пише в лог адресу API, яку потім треба перенести у fetch |
| Wilsons | очікувано так | `/auctions` → техніка за slug (`plant`, `machinery`, `commercial`…) → сторінка аукціону `?page=P`, картки `/lots/<id>`. Запасний шлях через браузер такий самий, як в EA |
| Cheffins | **ні** для каталогів | список на cheffins.co.uk іде звичайним fetch, а `cheffins.auctionmarts.com` (SPA) у старому скрипті рендерився лише в браузері. Тому парсер спершу пробує fetch, а коли карток немає, вмикає headless Chromium з логікою старого `scrape-catalogues.mjs` (гортання по 60, прокрутка заради фото). `needsBrowser: true` |
| BCA, дилери | – | заглушки `enabled:false` з TODO |

Ручний список каталогів Euro Auctions на випадок, якщо сторінка списку зміниться: `EA_AUCTIONS="1050:leeds-25th-26th-27th-28th-november-2026,1059:dromore-11th-12th-december-2026"`.

## Результати реальних запусків

**26.11.2026, хмарна сесія агента:** реальний запуск **не вдався** для жодного джерела. Річ не в сайтах: мережева політика сесії
пропускає лише кілька хостів, і проксі відповів `403 (no rule or network setting allows this host)` на
`www.euroauctions.com`, `www.wilsonsauctions.com`, `www.cheffins.co.uk`, `cheffins.auctionmarts.com`, `www.brightwells.com`, `api.brightwells.com`.
Парсер коректно зупиняє такі джерела з помилкою `хост заблоковано проксі/мережевою політикою`, і в `lots.json` вони потрапляють з `ok:false`.

Тому перевірка поки **офлайн**:
- фікстури в `fixtures/` **реконструйовано**: розмітка повторює структуру, відому з наявних скриптів і URL (адреси карток, фото, API Brightwells),
  а дані лотів справжні, з `lib/*.ts`. Кожен HTML-файл має про це коментар;
- `node scripts/parsers/test.mjs` пройшов 10/10 тестів. Офлайн-запуск усіх 4 джерел дав 8 аукціонів, 28 лотів, з них 23 під попит (5 відкинуто: фургони, палета, інструмент, бетономішалка).

**Що зробити першим реальним запуском** (на ноутбуці, VPS або в Actions):
```bash
node scripts/parsers/run.mjs --source=brightwells,euroauctions,wilsons --limit=30 --verbose --save=scripts/parsers/fixtures
node scripts/parsers/test.mjs   # якщо розмітка відрізняється від реконструйованої, тести покажуть, де саме
```
`--save` перезапише фікстури реальними відповідями (manifest оновиться сам). Після цього асерти в `test.mjs` про конкретні id треба буде звірити.
Найімовірніші місця для правок: селектори карток EA/Wilsons (`anchorCards` за посиланнями `/equipment-search/product/<id>` і `/lots/<id>`) і поля API Brightwells
(`lotFromApi` бере їх через `pick()` з кількома варіантами назв).

## Запуск у GitHub Actions

`.github/workflows/parse-lots.yml`:
- `workflow_dispatch` з полями `sources`, `limit`, `strict`, `browser`, `publish` (`none` | `commit` | `blob`);
- `schedule` (кожні 2 год) **закоментовано**: розкоментувати після погодження Івана;
- ставить лише залежності парсера: `npm install --prefix scripts/parsers` (cheerio, undici, playwright). Lock-файла в репо немає, Next.js не потрібен, тож так швидше;
- `npx playwright install --with-deps chromium` виконується лише при `browser: true` (за замовчуванням так, бо потрібен для Cheffins); браузери кешуються;
- стан між запусками (`scripts/parsers/out`, потрібен для статусів і архіву) зберігається в `actions/cache`, а запасний варіант бере його з `lib/lots-feed.json`;
- результати завантажуються як artifact на 14 днів;
- `alert-telegram.mjs` запускається і після помилки, і після успіху, але надсилає повідомлення лише за наявності проблем (секрети `TELEGRAM_ALERT_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID`);
- публікація: **А** — коміт `lib/lots-feed.json` у гілку (потрібно `contents: write`, Vercel перезбирає сайт);
  **Б** — Vercel Blob через `publish-blob.mjs` (секрет `BLOB_READ_WRITE_TOKEN`, стабільна адреса `lots-feed.json`, сайт читає її без перезбірки).
  Для розкладу режим береться з репозиторної змінної `vars.LOTS_PUBLISH`.

Ризик Actions: IP-адреси GitHub (Azure) деякі сайти блокують (Cloudflare/Akamai). Якщо джерело в Actions стабільно дає 403, переносимо його на VPS або домашній ПК, як `scripts/auto-bids`.

## Запуск на VPS (cron)

```bash
git clone … && cd nolimitgoods
npm install --prefix scripts/parsers
npx --prefix scripts/parsers playwright install --with-deps chromium   # лише якщо потрібен Cheffins
crontab -e
# кожні 2 години; стан лишається в scripts/parsers/out між запусками
17 */2 * * * cd /opt/nolimitgoods && git pull -q && node scripts/parsers/run.mjs --publish=lib/lots-feed.json >> /var/log/lots-parser.log 2>&1; \
  TELEGRAM_ALERT_BOT_TOKEN=… TELEGRAM_ALERT_CHAT_ID=… node scripts/parsers/alert-telegram.mjs --max-age-hours=3 >> /var/log/lots-parser.log 2>&1
```
Публікація з VPS: або `git commit/push lib/lots-feed.json`, як у `scripts/auto-bids`, або `BLOB_READ_WRITE_TOKEN=… node scripts/parsers/publish-blob.mjs`
(після `npm install --prefix scripts/parsers --no-save @vercel/blob@1`).

## Обмеження

- Розмітку EA/Wilsons/auctionmarts з цього середовища перевірити не вдалося (див. вище), тому селектори можуть потребувати правок після першого реального запуску.
- Ставки: Brightwells віддає `currentBid`/`countOfBids`. EA і Wilsons показують ставки лише під час торгів або після входу. Cheffins показує їх лише після входу.
- `soldPrice` поки дає тільки Brightwells (якщо API віддає `soldPrice`/`hammerPrice`). Для EA/Wilsons результати торгів окремою сторінкою ще не парсяться (TODO).
- Номери лотів Euro Auctions до торгів часто ще не присвоєні: `lot: ""`, ключ береться з `item`.
- Переклад назв поки словниковий (тип техніки + оригінал).
- Вага (`lib/lot-weights.ts`) і двигун (`engine`) парсер не заповнює.

## Що потрібно від Івана

1. **Де запускати:** GitHub Actions (безкоштовно, але IP можуть блокувати) чи VPS/домашній ПК (стабільніше для Cloudflare-сайтів).
2. **Куди публікувати:** А) коміт `lib/lots-feed.json` (простіше, сайт перезбирається кожні 2 год) чи Б) Vercel Blob (без перезбірки, потрібен `BLOB_READ_WRITE_TOKEN`).
3. **Секрети в GitHub → Settings → Secrets:** `TELEGRAM_ALERT_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` (бот і чат для алертів), за варіанта Б ще `BLOB_READ_WRITE_TOKEN`.
   Репозиторна змінна `LOTS_PUBLISH` (`commit`/`blob`) потрібна для розкладу.
4. **Погодити розклад:** розкоментувати `schedule` у `.github/workflows/parse-lots.yml`.
5. BCA (трейдерський акаунт?) і перелік дилерів для заглушок.
6. Для хмарних сесій Claude: дозволити в мережевих налаштуваннях середовища хости аукціонів (перелік вище), щоб агент міг сам перевіряти парсери.
