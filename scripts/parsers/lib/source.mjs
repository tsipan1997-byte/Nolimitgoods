// Інтерфейс джерела лотів. Кожне джерело — окремий файл у sources/, експортує default defineSource({...}).
//
// Джерело реалізує ДВА методи (runner викликає їх по черзі):
//   listAuctions(ctx)          -> RawAuction[]   (аукціони, що зараз відкриті/майбутні)
//   listLots(auction, ctx)     -> RawLot[]       (лоти одного аукціону; поля див. lib/model.mjs)
// або ОДИН метод run(ctx) -> { auctions, lots } — для джерел, де простіше зібрати все разом.
// Нормалізацію (normalizeLot/normalizeAuction) робить runner, джерело повертає «сирі» поля.

/**
 * @typedef {Object} SourceCtx
 * @property {(url:string, opts?:{method?:string, body?:any, headers?:Record<string,string>}) => Promise<string>} fetchHtml
 * @property {(url:string, opts?:{method?:string, body?:any, headers?:Record<string,string>}) => Promise<any>} fetchJson
 * @property {{info:Function, warn:Function, error:Function, debug:Function}} log
 * @property {number} limit              максимальна кількість лотів з джерела (Infinity = без обмеження)
 * @property {boolean} offline           true = відповіді читаються з офлайн-теки (фікстури)
 * @property {() => Promise<import('playwright').Browser|null>} getBrowser  лінивий запуск headless Chromium; null якщо недоступний/заборонений
 * @property {Date} now
 */

/**
 * @typedef {Object} RawAuction
 * @property {string} id
 * @property {string} name
 * @property {string} place
 * @property {string} [dates]
 * @property {number|null} [startsAt]
 * @property {number|null} [endsAt]
 * @property {boolean} [live]
 * @property {number} [totalLots]
 * @property {boolean} [unreserved]
 * @property {string} url
 * @property {'GBP'|'EUR'} [currency]
 * @property {string} [location]   місце для лотів за замовчуванням (українською)
 * @property {any} [_ref]          службові дані джерела (id каталогу тощо) — у вихід не потрапляють
 */

/**
 * @typedef {Object} Source
 * @property {string} id                 'euroauctions'
 * @property {string} house              'Euro Auctions'
 * @property {string} name               людська назва
 * @property {boolean} enabled           false = заглушка, за замовчуванням не запускається
 * @property {boolean} needsBrowser      true = без Playwright джерело не працює (CI має ставити Chromium)
 * @property {boolean} [browserFallback] true = працює на fetch, браузер лише як запасний шлях
 * @property {'GBP'|'EUR'} currency
 * @property {string} [tz]               часовий пояс дат сайту, за замовчуванням Europe/London
 * @property {string} baseUrl
 * @property {(ctx:SourceCtx) => Promise<RawAuction[]>} [listAuctions]
 * @property {(auction:RawAuction, ctx:SourceCtx) => Promise<any[]>} [listLots]
 * @property {(ctx:SourceCtx) => Promise<{auctions:RawAuction[], lots:any[]}>} [run]
 */

/** @param {Source} s */
export function defineSource(s) {
  if (!s.id || !s.house) throw new Error('source: id і house обовʼязкові');
  if (!s.run && !(s.listAuctions && s.listLots)) throw new Error(`source ${s.id}: потрібен run() або listAuctions()+listLots()`);
  return { enabled: true, needsBrowser: false, browserFallback: false, currency: 'GBP', tz: 'Europe/London', ...s };
}
