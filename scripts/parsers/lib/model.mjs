// Нормалізована модель лота й аукціону. Поля сумісні з AuctionLot / AuctionInfo з lib/auction-lots.ts
// плюс службові поля парсера (source, house, sourceId, status, currency, ціни, мітки часу).

/** @typedef {'energy'|'breakers'|'attachments'|'excavators'|'telehandlers'|'agro'|'pickups'|'trucks'} AuctionCategory */
/** @typedef {'active'|'sold'|'closed'} LotStatus */

/**
 * @typedef {Object} NormalizedLot
 * @property {string} auction      id аукціону, напр. 'ea-leeds-2026-11'
 * @property {string} lot          номер лота ('' якщо ще не присвоєно)
 * @property {string} item         ID позиції на сайті аукціону
 * @property {string} title        назва українською (поки — словник типу техніки + оригінал)
 * @property {string} original     оригінальна назва
 * @property {AuctionCategory|null} category  null = не під попит, відкидається при злитті
 * @property {number|null} year
 * @property {number|null} hours
 * @property {number|null} miles   пробіг у КМ (так історично в AuctionLot)
 * @property {string} specs
 * @property {boolean} unused
 * @property {boolean} inoperable
 * @property {string} location
 * @property {number|null} endsAt  мс UTC (закриття лота або день живих торгів)
 * @property {boolean} live
 * @property {string} img
 * @property {string[]} [gallery]
 * @property {string} url
 * @property {string} source       id джерела ('euroauctions', 'wilsons', ...)
 * @property {string} house        'Euro Auctions', 'Wilsons Auctions', ...
 * @property {string} sourceId     `${source}:${item}` — стабільний ключ
 * @property {LotStatus} status
 * @property {'GBP'|'EUR'} currency
 * @property {number|null} [currentBid]
 * @property {number|null} [bids]
 * @property {number|null} [soldPrice]
 * @property {string} firstSeenAt  ISO
 * @property {string} lastSeenAt   ISO
 * @property {string} scrapedAt    ISO
 */

/**
 * @typedef {Object} NormalizedAuction
 * @property {string} id
 * @property {string} house
 * @property {string} name
 * @property {string} place
 * @property {string} dates        людський рядок українською, напр. '25–28 листопада 2026'
 * @property {string} format       'Живі торги + онлайн-ставки' | 'Онлайн-торги з таймером'
 * @property {number} totalLots
 * @property {boolean} unreserved
 * @property {string} url
 * @property {'GBP'|'EUR'} currency
 * @property {string} [source]
 * @property {number|null} [startsAt]  мс UTC
 * @property {number|null} [endsAt]    мс UTC
 */

export const CATEGORIES = ['energy', 'breakers', 'attachments', 'excavators', 'telehandlers', 'agro', 'pickups', 'trucks'];

// Не під попит / не вивозимо: легкові, фургони, мото, вінтаж, дрібний інструмент, запчастини.
const EXCLUDE = [
  /\bvans?\b/i, /\bpanel van\b/i, /\bminibus\b/i, /\bsaloon\b/i, /\bhatchback\b/i, /\bestate car\b/i, /\bmotor ?(bike|cycle)\b/i,
  /\bcaravan\b/i, /\bmotorhome\b/i, /\bvintage\b/i, /\bclassic\b/i, /\bautomobilia\b/i, /\bpetroliana\b/i, /\bmodel\s+(tractor|truck)\b/i,
  /\btoy\b/i, /\bpedal\b/i, /\bspares?\s+(only|box)\b/i, /\bbox of\b/i, /\bpallet of\b/i, /\bquantity of\b/i, /\bqty of\b/i,
  /\bpower ?washer\b/i, /\bhand tools?\b/i, /\bstrimmer\b/i, /\blawn ?mower\b/i, /\bride[- ]on mower\b/i, /\bgolf\b/i,
  /\bshipping container\b/i, /\bportacabin\b/i, /\bwelfare unit\b/i, /\boffice\b/i, /\bfurniture\b/i,
];

// Порядок важливий: спершу основна машина, потім навісне (бо "excavator c/w hammer" — це екскаватор).
/** @type {[AuctionCategory, RegExp, string][]} [категорія, регулярка, українська назва типу] */
// Спершу — навісне «для екскаватора» і причепи: інакше "Breaker to suit 20 Ton Excavator" стане екскаватором.
const FOR_MACHINE = /\b(to suit|suits?|suitable for|for|fits?)\s+(an?\s+)?([\d.\s-]+\s*(t|ton|tonne)s?\s+)?(mini[- ]?)?(excavators?|diggers?|telehandlers?|loaders?|skid ?steers?|machines?|jcb|cat|kubota)\b|\b(excavator|digger)\s+(grab|bucket|attachment|rake|shear|breaker|hammer)s?\b|\bmounted digger attachment\b|\bexcavator mounted\b/i;
/** @type {[AuctionCategory, RegExp, string][]} */
const PRE = [
  ['agro', /\b(grain|bale|monocoque|silage|blower|muck|livestock|agri\w*)\b.*\btrailers?\b|\btrailers?\b.*\b(grain chute|bale)\b/i, 'Причіп'],
  ['trucks', /\btrailers?\b(?!.*\b(towable|trailer[- ]mounted)\b)/i, 'Причіп'],
  ['attachments', /\bfront loader\b|\b(wood ?)?chipper\b|\bpotato lifter\b/i, 'Навісне обладнання'],
];
const PRE_FOR = [
  ['breakers', /\bbreakers?\b|\bhammers?\b/i, 'Гідромолот'],
  ['attachments', /./, 'Навісне обладнання'],
];

const RULES = [
  ['telehandlers', /\btele(scopic)?[ -]?handlers?\b|\btelescopic loader\b|\btelestar\b|\bloadall\b|\bmanitou\s+m[tl][x]?\s?\d|\bmerlo\b|\bjcb\s+5\d\d[- ]\d+|\bcat\s+th\d|\bdieci\b/i, 'Телескопічний навантажувач'],
  ['excavators', /\bmini[- ]?excavator|\bmicro[- ]?excavator|\bmini digger\b/i, 'Міні-екскаватор'],
  ['excavators', /\bwheeled excavator|\bwheel excavator\b/i, 'Колісний екскаватор'],
  ['excavators', /\bexcavators?\b|\bdigger\b/i, 'Гусеничний екскаватор'],
  ['excavators', /\bbackhoe|\b3cx\b|\b4cx\b/i, 'Екскаватор-навантажувач'],
  ['excavators', /\bskid[- ]?steer|\bcompact track loader|\btracked loader/i, 'Міні-навантажувач'],
  ['excavators', /\bwheel(ed)? loader|\bloading shovel\b/i, 'Фронтальний навантажувач'],
  ['excavators', /\b(bull)?dozer\b|\bcrawler tractor\b/i, 'Бульдозер'],
  ['excavators', /\barticulated dump ?truck|\badt\b|\bmoxy\b|\bbell b\d|\bvolvo a\d\d/i, 'Шарнірний самоскид'],
  ['excavators', /\bdumpers?\b/i, 'Думпер'],
  ['excavators', /\bfork ?lifts?\b|\brough terrain forklift|\bmaterial handler\b/i, 'Навантажувач'],
  ['agro', /\b(cambridge|land|ring|flat|grass|crosskill)\s+(rollers?|rolls)\b|\bridger\b|\bbed former\b|\bplanter\b|\bclod separator\b|\bdestoner\b|\bheader\b|\bpress\b(?=.*\b(front|mounted|flexi))|\bcrumbler\b|\binjector\b|\b(bed|potato|beet) lifter\b|\belevator\b(?!.*\b(lift|platform))|\bpress,|\brear press\b|\bweeder\b|\bhoe\b(?!.*backhoe)/i, 'Сільгосптехніка'],
  ['excavators', /\b(road |vibratory |twin drum |single drum )?rollers?\b(?!.*\bshutter)/i, 'Каток'],
  ['excavators', /\bgraders?\b/i, 'Грейдер'],
  ['agro', /\bcombine\b|\bharvester\b|\bforage\b|\bbaler\b|\bsprayer\b|\bdrill\b(?!.*\bbit)|\bplough\b|\bcultivator\b|\bharrow\b|\bspreader\b|\bforwarder\b|\bmulcher\b|\bmower conditioner\b|\bdisc mower\b|\btedder\b|\brake\b|\bwrapper\b|\bsubsoiler\b|\btopper\b|\bflail\b|\btelescopic loader\b(?=.*\bagri)/i, 'Сільгосптехніка'],
  ['agro', /\btractors?\b(?!\s+unit)|\bfastrac\b/i, 'Трактор'],
  ['pickups', /\bpick[- ]?ups?\b|\bhilux\b|\branger\b|\bl200\b|\bnavara\b|\bd-?max\b|\bamarok\b|\bdefender\b|\bland cruiser\b|\butv\b|\butility vehicle\b|\bgator\b|\bkawasaki mule\b|\bmule\s+\d|\brange rover\b|\bfreelander\b|\bdiscovery\b(?=.*\bland rover|\btd)|\b4x4\b|\bdouble cab\b|\bdual cab\b|\bking cab\b|\bclub cab\b/i, 'Пікап'],
  ['energy', /\bgenerators?\b|\bgen ?set\b|\b\d+\s?kva\b|\bcompressors?\b|\blighting towers?\b|\bwelder generator\b|\btransformer\b|\bsolar\b|\bbattery storage\b/i, 'Генератор'],
  ['trucks', /\btipper\b|\blorry\b|\btrucks?\b|\btractor unit\b|\bhgv\b|\bbeaver ?tail\b|\bplant (lorry|truck)|\bhook ?loader\b|\bskip loader\b|\bcurtain ?side\b|\bconcrete mixer\b|\b(daf|scania|iveco)\b|\bman tg[slmx]\b|\bvolvo f[hlm]\b|\b(actros|atego|axor|arocs|antos)\b|\brenault (premium|range|midlum|kerax|d wide|\d{3}\s?dxi)\b|\bhino\s+\d|\bmitsubishi canter\b|\bisuzu (n|f)[a-z]{2}\b/i, 'Вантажівка'],
  // Модельні ряди без слова «excavator»/«tractor» у назві (Euro Auctions часто пише лише бренд і модель)
  ['excavators', /\b(hitachi\s+zx|komatsu\s+pc|cat(erpillar)?\s+3\d\d|volvo\s+ec[rw]?\d|doosan\s+dx|develon\s+dx|kobelco\s+sk|case\s+cx|liebherr\s+[ra]\s?\d|hyundai\s+(r|hx)\d|sany\s+sy|takeuchi\s+tb|kubota\s+(u|kx)\d|yanmar\s+(vio|sv|b)\d|bobcat\s+e\d|wacker neuson\s+e[tz]\d|jcb\s+\d{3}\s?(x|lc|xl|nlc|xlc)\b|jcb\s+(js|jz|\d{2,3}c|\d{2,3}z|8\d{3}|19c|hydradig)|liugong\s+9\d|xcmg\s+xe|kato\s+hd|sunward\s+swe|ihi\s+\d{2}|doosan\s+dh|komatsu\s+pw|takeuchi|kubota\s+kx)/i, 'Гусеничний екскаватор'],
  ['excavators', /\b(cat(erpillar)?\s+9\d\d[a-z]?|volvo\s+l\d{2,3}|komatsu\s+wa\d|jcb\s+4[0-9]{2}\b|liebherr\s+l\s?5\d\d|doosan\s+dl|hyundai\s+hl|case\s+\d{3}[a-z]?\s*wheel)/i, 'Фронтальний навантажувач'],
  ['excavators', /\b(cat(erpillar)?\s+d\d[a-z]?|komatsu\s+d\d{2}|liebherr\s+pr\s?\d)/i, 'Бульдозер'],
  ['excavators', /\b(thwaites|terex\s+(ta|hd)\d|ausa\s+d\d|jcb\s+\d+t\s?(hi|st)?)/i, 'Думпер'],
  ['excavators', /\b(bomag\s+bw|hamm\s+(hd|h)\d|dynapac\s+(ca|cc)\d|benford\s+tv)/i, 'Каток'],
  ['agro', /\b(john deere\s+\d{4}|new holland\s+t\d|massey ferguson\s+\d|fendt\s+\d{3}|claas\s+(arion|axion|xerion)|case ih\s+(puma|maxxum|magnum|optum|quadtrac)|deutz[- ]fahr\s+(agrotron|\d)|valtra\s+[nt]\d|kubota\s+m\d|mccormick|zetor|landini|same\s+(explorer|virtus))/i, 'Трактор'],
  ['telehandlers', /\b(manitou\s+(mt|mlt|mrt)|jcb\s+5\d\d|cat\s+th|genie\s+gth|bobcat\s+t[l]\d|kramer\s+\d{3}|claas\s+scorpion|jcb\s+tm\d|new holland\s+lm\d|new holland\s+th|massey ferguson\s+th)/i, 'Телескопічний навантажувач'],
  ['breakers', /\b(rock |hydraulic )?breakers?\b|\b(rock |hydraulic )?hammers?\b/i, 'Гідромолот'],
  ['attachments', /\bgrabs?\b|\bshears?\b|\bpulveri[sz]er\b|\bcrusher bucket\b|\bmuncher\b|\bprocessor\b|\bsorting\b|\bdemolition\b|\btilt ?rotator\b|\bquick ?hitch\b|\bripper\b|\bauger\b|\bbuckets?\b|\bpallet forks\b|\bclamp\b|\bcompactor plate\b|\bscreening bucket\b|\battachment\b/i, 'Навісне обладнання'],
];

// Уточнення назви типу для генераторів/компресорів, навісного тощо
const SUBTYPES = [
  [/\bcompressor/i, 'Компресор'],
  [/\blighting tower/i, 'Освітлювальна вежа'],
  [/\bgrab/i, 'Грейфер'],
  [/\bshear/i, 'Гідроножиці'],
  [/\bpulveri[sz]er|\bmuncher/i, 'Подрібнювач'],
  [/\bcrusher bucket|\bscreening bucket/i, 'Ківш-дробарка'],
  [/\bbucket/i, 'Ківш'],
  [/\bcombine\b/i, 'Комбайн'],
  [/\bbaler\b/i, 'Прес-підбирач'],
  [/\bsprayer\b/i, 'Обприскувач'],
  [/\bforwarder\b/i, 'Форвардер'],
  [/\bplough\b/i, 'Плуг'],
  [/\btipper\b/i, 'Самоскид'],
  [/\bbeaver ?tail|\bplant (lorry|truck)/i, 'Евакуатор техніки'],
  [/\btractor unit\b/i, 'Сідельний тягач'],
  [/\btrailer/i, 'Причіп'],
];

/**
 * Евристика категорії за ключовими словами (англійська назва + опис).
 * @returns {{category: AuctionCategory|null, kind: string}}
 */
export function categorize(text, hint = '') {
  const t = `${text || ''} ${hint || ''}`;
  if (EXCLUDE.some((re) => re.test(t))) return { category: null, kind: '' };
  // спершу лише назва (точніший тип), потім назва + підказка (категорія/шлях на сайті)
  for (const s of hint ? [text || '', t] : [text || '']) {
    const rules = FOR_MACHINE.test(s) ? [...PRE, ...PRE_FOR] : [...PRE, ...RULES];
    for (const [category, re, kind] of rules) {
      if (!re.test(s)) continue;
      const sub = SUBTYPES.find(([r]) => r.test(text || ''));
      // підтип беремо лише якщо він не суперечить категорії (наприклад, "excavator c/w bucket" лишається екскаватором)
      const subOk = sub && (category === 'energy' || category === 'attachments' || (category === 'agro' && kind === 'Сільгосптехніка') || category === 'trucks');
      return { category, kind: subOk ? sub[1] : kind };
    }
  }
  return { category: null, kind: '' };
}

/** Проста «українська» назва: тип техніки + оригінал без року/«Unused». Повноцінний переклад робить людина або LLM пізніше. */
export function makeTitle(original, kind, unused) {
  const clean = String(original || '')
    .replace(/^\s*(unused|new)\s+/i, '')
    .replace(/^\s*(19|20)\d\d\s+/, '')
    .split(/\s+[—–]\s+|\s+-\s+/)[0] // "Hitachi ZX210LC-6 — 700mm Pads, CV…" → "Hitachi ZX210LC-6"
    .replace(/\s+/g, ' ')
    .trim();
  if (!kind) return clean;
  return `${kind} ${clean}${unused ? ', новий' : ''}`.trim();
}

export const toNum = (v) => {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const m = String(v).replace(/[, ]/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

export function parseYear(text) {
  const m = String(text || '').match(/\b(19[5-9]\d|20[0-3]\d)\b/);
  const y = m ? +m[1] : null;
  return y && y <= new Date().getUTCFullYear() + 1 ? y : null;
}

export function parseHours(text) {
  const m = String(text || '').match(/(\d{1,3}(?:[,.\s]\d{3})*|\d+)\s*(?:hrs?|hours|h\b|mth|engine hours)/i)
    || String(text || '').match(/hours?\s*[:\-]?\s*(\d{1,3}(?:[,.]\d{3})*|\d+)/i);
  const n = m ? toNum(m[1].replace(/[.\s]/g, '')) : null;
  return n != null && n < 200000 ? n : null;
}

/** Пробіг у км (у AuctionLot поле miles історично містить кілометри). */
export function parseKm(text) {
  const s = String(text || '');
  let m = s.match(/(\d{1,3}(?:,\d{3})+|\d+)\s*(?:miles|mls|mi)\b/i) || s.match(/mileage\s*[:\-]?\s*(\d{1,3}(?:,\d{3})+|\d+)/i);
  if (m) return Math.round(toNum(m[1]) * 1.609344);
  m = s.match(/(\d{1,3}(?:[,.\s]\d{3})+|\d+)\s*km\b/i);
  return m ? toNum(m[1].replace(/[.\s]/g, '')) : null;
}

export const isUnused = (text) => /^\s*(unused|new)\b|\bunused\b|\bbrand new\b|\bnot used\b/i.test(String(text || ''));
export const isInoperable = (text) =>
  /non[- ]?runner|not running|spares (or|and|\/) repairs?|inoperable|no engine|fire damaged|seized|does not start|won'?t start|engine (fault|damage)/i.test(String(text || ''));

// ---- дати: Лондон/Мадрид → UTC ----
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
const UA_MONTHS_GEN = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

/** Перетворює місцевий час у часовому поясі tz на мс UTC (враховує літній час). */
export function zonedToUtc(y, mo, d, h = 0, mi = 0, tz = 'Europe/London') {
  const guess = Date.UTC(y, mo, d, h, mi);
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(guess)).map((p) => [p.type, p.value]));
  const asLocal = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return guess - (asLocal - guess);
}

/**
 * Розбирає дату з тексту: ISO, "01/12/2026 10:00", "1st December 2026 at 10:00", "Tue 1 Dec 2026 10am".
 * @returns {number|null} мс UTC
 */
export function parseDate(text, tz = 'Europe/London') {
  if (text == null || text === '') return null;
  if (typeof text === 'number') return text > 1e12 ? text : text > 1e9 ? text * 1000 : null;
  const s = String(text).trim();
  if (/^\d{4}-\d\d-\d\d(T[\d:.]+)?(Z|[+-]\d\d:?\d\d)$/.test(s)) return Date.parse(s);
  let m = s.match(/^(\d{4})-(\d\d)-(\d\d)(?:[T ](\d\d):(\d\d))?/);
  if (m) return zonedToUtc(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), tz);
  const time = (rest) => {
    const t = (rest || '').match(/(\d{1,2})(?::|\.)(\d\d)\s*(am|pm)?|(\d{1,2})\s*(am|pm)/i);
    if (!t) return [0, 0, false];
    let h = +(t[1] || t[4]);
    const mi = +(t[2] || 0);
    const ap = (t[3] || t[5] || '').toLowerCase();
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    return [h, mi, true];
  };
  m = s.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b(.*)/);
  if (m) {
    const y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
    const [h, mi] = time(m[4]);
    return zonedToUtc(y, +m[2] - 1, +m[1], h, mi, tz);
  }
  m = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([A-Za-z]{3,9})\.?,?\s+(\d{4})(.*)/);
  const mo = m ? MONTHS[m[2].slice(0, 4).toLowerCase()] ?? MONTHS[m[2].slice(0, 3).toLowerCase()] : undefined;
  if (m && mo != null) {
    const [h, mi] = time(m[4]);
    return zonedToUtc(+m[3], mo, +m[1], h, mi, tz);
  }
  m = s.match(/\b([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})(.*)/);
  if (m && MONTHS[m[1].slice(0, 3).toLowerCase()] != null) {
    const [h, mi] = time(m[4]);
    return zonedToUtc(+m[3], MONTHS[m[1].slice(0, 3).toLowerCase()], +m[2], h, mi, tz);
  }
  const p = Date.parse(s);
  return Number.isNaN(p) ? null : p;
}

/** "25–28 листопада 2026" з двох мс UTC. */
export function uaDateRange(from, to, tz = 'Europe/London') {
  if (!from) return '';
  const part = (ms) => {
    const f = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(ms)).map((p) => [p.type, p.value]));
    return { d: +f.day, m: +f.month - 1, y: +f.year };
  };
  const a = part(from);
  const b = to ? part(to) : a;
  if (a.y === b.y && a.m === b.m && a.d === b.d) return `${a.d} ${UA_MONTHS_GEN[a.m]} ${a.y}`;
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${UA_MONTHS_GEN[a.m]} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${UA_MONTHS_GEN[a.m]} – ${b.d} ${UA_MONTHS_GEN[b.m]} ${a.y}`;
  return `${a.d} ${UA_MONTHS_GEN[a.m]} ${a.y} – ${b.d} ${UA_MONTHS_GEN[b.m]} ${b.y}`;
}

/** id аукціону: `${prefix}-${slug місця}-${yyyy}-${mm}` → 'ea-leeds-2026-11'. */
export function auctionId(prefix, place, ms, tz = 'Europe/London') {
  const slug = String(place || '').toLowerCase().replace(/['’]s\b/g, 's').normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'sale';
  if (!ms) return `${prefix}-${slug}`;
  const f = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit' }).formatToParts(new Date(ms)).map((p) => [p.type, p.value]));
  return `${prefix}-${slug}-${f.year}-${f.month}`;
}

const str = (v) => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim());
const absUrl = (u, base) => {
  if (!u) return '';
  try { return new URL(String(u), base).href; } catch { return ''; }
};

/**
 * Приводить «сирий» лот від джерела до NormalizedLot. Невідомі поля заповнює евристиками.
 * @param {Partial<NormalizedLot> & {text?:string, description?:string}} raw
 * @param {{source:string, house:string, currency?:'GBP'|'EUR', baseUrl?:string, location?:string, live?:boolean, now?:Date}} meta
 * @returns {NormalizedLot}
 */
export function normalizeLot(raw, meta) {
  const now = (meta.now || new Date()).toISOString();
  const original = str(raw.original);
  const extra = `${str(raw.description)} ${str(raw.text)} ${str(raw.specs)}`;
  const all = `${original} ${extra}`;
  const unused = raw.unused ?? isUnused(original);
  const cat = raw.category !== undefined ? { category: raw.category, kind: raw.kind || categorize(original, raw.categoryHint).kind } : categorize(original, `${raw.categoryHint || ''} ${str(raw.description)}`);
  const item = str(raw.item);
  const gallery = [...new Set((raw.gallery || []).map((g) => absUrl(g, meta.baseUrl)).filter(Boolean))];
  const img = absUrl(raw.img, meta.baseUrl) || gallery[0] || '';
  const status = raw.status || (raw.soldPrice ? 'sold' : 'active');
  /** @type {NormalizedLot} */
  const lot = {
    auction: str(raw.auction),
    lot: str(raw.lot),
    item,
    title: str(raw.title) || makeTitle(original, cat.kind, unused),
    original,
    category: cat.category && CATEGORIES.includes(cat.category) ? cat.category : null,
    year: raw.year ?? parseYear(original) ?? parseYear(extra.match(/\b(year|yom|reg(istered)?)\b[^\d]{0,12}(19|20)\d\d/i)?.[0]),
    hours: raw.hours ?? parseHours(all),
    miles: raw.miles ?? parseKm(all),
    specs: str(raw.specs),
    unused: !!unused,
    inoperable: !!(raw.inoperable ?? isInoperable(all)),
    location: str(raw.location) || meta.location || '',
    endsAt: raw.endsAt ?? null,
    live: !!(raw.live ?? meta.live ?? false),
    img,
    url: absUrl(raw.url, meta.baseUrl),
    source: meta.source,
    house: meta.house,
    sourceId: `${meta.source}:${item}`,
    status,
    currency: raw.currency || meta.currency || 'GBP',
    currentBid: toNum(raw.currentBid),
    bids: toNum(raw.bids),
    soldPrice: toNum(raw.soldPrice),
    firstSeenAt: raw.firstSeenAt || now,
    lastSeenAt: now,
    scrapedAt: now,
  };
  if (gallery.length > 1) lot.gallery = gallery;
  return lot;
}

/** @returns {string[]} список помилок (порожній = валідний) */
export function validateLot(l) {
  const e = [];
  if (!l.source) e.push('source');
  if (!l.item) e.push('item');
  if (!l.auction) e.push('auction');
  if (!l.original) e.push('original');
  if (!l.url || !/^https?:\/\//.test(l.url)) e.push('url');
  if (l.category !== null && !CATEGORIES.includes(l.category)) e.push('category');
  if (l.endsAt != null && !(Number.isFinite(l.endsAt) && l.endsAt > 1e12)) e.push('endsAt');
  if (!['active', 'sold', 'closed'].includes(l.status)) e.push('status');
  if (!['GBP', 'EUR'].includes(l.currency)) e.push('currency');
  if (l.year != null && (l.year < 1950 || l.year > 2035)) e.push('year');
  return e;
}

/**
 * @param {Partial<NormalizedAuction>} a
 * @returns {NormalizedAuction}
 */
export function normalizeAuction(a, meta) {
  return {
    id: str(a.id),
    house: a.house || meta.house,
    name: str(a.name),
    place: str(a.place),
    dates: str(a.dates) || uaDateRange(a.startsAt, a.endsAt, meta.tz),
    format: a.format || (a.live ? 'Живі торги + онлайн-ставки' : 'Онлайн-торги з таймером'),
    totalLots: toNum(a.totalLots) ?? 0,
    unreserved: !!a.unreserved,
    url: a.url || '',
    currency: a.currency || meta.currency || 'GBP',
    source: meta.source,
    startsAt: a.startsAt ?? null,
    endsAt: a.endsAt ?? null,
  };
}
