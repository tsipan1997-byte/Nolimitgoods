// HTTP-шар для парсерів: fetch з ретраями, таймаутом, нейтральним User-Agent,
// підтримкою проксі (HTTPS_PROXY), офлайн-режимом (читання збережених відповідей)
// і режимом запису (--save=<dir>) для створення фікстур.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Нейтральний браузерний UA. Назву нашого сайту сюди НЕ додаємо.
export const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let proxyReady = null;
/**
 * Вмикає проксі для глобального fetch, якщо задано HTTPS_PROXY.
 * Node ≥ 22.21 / 24 вміє це сам через NODE_USE_ENV_PROXY=1 (або --use-env-proxy).
 * Для старіших версій пробуємо пакет undici (EnvHttpProxyAgent). Перевірку TLS не вимикаємо ніколи.
 */
export async function setupProxy(log = console) {
  if (proxyReady) return proxyReady;
  proxyReady = (async () => {
    const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
    if (!proxy) return 'none';
    if (process.env.NODE_USE_ENV_PROXY === '1' || process.execArgv.includes('--use-env-proxy')) return 'node-env-proxy';
    try {
      const undici = await import('undici');
      if (undici.EnvHttpProxyAgent && undici.setGlobalDispatcher) {
        undici.setGlobalDispatcher(new undici.EnvHttpProxyAgent());
        return 'undici-env-proxy';
      }
    } catch { /* undici не встановлено */ }
    log.warn?.(`HTTPS_PROXY задано, але проксі для fetch не ввімкнено: запускайте з NODE_USE_ENV_PROXY=1 (Node ≥22.21) або встановіть undici`);
    return 'unconfigured';
  })();
  return proxyReady;
}

/** Ключ запиту для офлайн-маніфесту: "GET https://..." або "POST https://... <sha1(body)>". */
export function requestKey(url, { method = 'GET', body } = {}) {
  const m = method.toUpperCase();
  if (m === 'GET' || body == null) return `${m} ${url}`;
  const h = crypto.createHash('sha1').update(typeof body === 'string' ? body : JSON.stringify(body)).digest('hex').slice(0, 10);
  return `${m} ${url} ${h}`;
}

function fileNameFor(key) {
  const slug = key.replace(/^[A-Z]+ https?:\/\//, '').replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 80).replace(/-+$/, '');
  const h = crypto.createHash('sha1').update(key).digest('hex').slice(0, 8);
  return `${slug}-${h}`;
}

/**
 * Офлайн-сховище: <dir>/manifest.json = { "<ключ запиту>": "<файл>" }.
 * Ключ може закінчуватися на "*" — тоді це префікс (зручно для пагінації: остання сторінка).
 */
export class OfflineStore {
  constructor(dir) {
    this.dir = dir;
    const mf = path.join(dir, 'manifest.json');
    this.manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
  }
  get(key) {
    let file = this.manifest[key];
    if (!file) {
      const pref = Object.keys(this.manifest)
        .filter((k) => k.endsWith('*') && key.startsWith(k.slice(0, -1)))
        .sort((a, b) => b.length - a.length)[0];
      if (pref) file = this.manifest[pref];
    }
    if (!file) return null;
    if (file === 404) return { status: 404, text: '' };
    return { status: 200, text: fs.readFileSync(path.join(this.dir, file), 'utf8') };
  }
}

export class RecordStore {
  constructor(dir) {
    this.dir = dir;
    fs.mkdirSync(dir, { recursive: true });
    const mf = path.join(dir, 'manifest.json');
    this.manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')) : {};
  }
  put(key, text, ext) {
    const file = fileNameFor(key) + ext;
    fs.writeFileSync(path.join(this.dir, file), text);
    this.manifest[key] = file;
    fs.writeFileSync(path.join(this.dir, 'manifest.json'), JSON.stringify(this.manifest, null, 1));
  }
}

export class HttpError extends Error {
  constructor(status, url, body = '') {
    super(`HTTP ${status} ${url}${/cloudflare|cf-ray|just a moment/i.test(body) ? ' (Cloudflare)' : ''}`);
    this.status = status;
    this.url = url;
  }
}

/**
 * Створює fetchText/fetchHtml/fetchJson для одного джерела.
 * @param {{log:any, offline?:OfflineStore|null, record?:RecordStore|null, timeoutMs?:number, retries?:number, delayMs?:number, userAgent?:string}} o
 */
export function createHttp(o) {
  const { log, offline = null, record = null, timeoutMs = 30000, retries = 3, delayMs = 400, userAgent = DEFAULT_UA } = o;
  let last = 0;
  let requests = 0;

  async function fetchText(url, opts = {}) {
    const method = (opts.method || 'GET').toUpperCase();
    const body = opts.body == null ? undefined : typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
    const key = requestKey(url, { method, body });
    requests++;
    if (offline) {
      const hit = offline.get(key);
      if (!hit) throw new HttpError(404, `${url} (немає в офлайн-маніфесті: "${key}")`);
      if (hit.status !== 200) throw new HttpError(hit.status, url);
      return hit.text;
    }
    await setupProxy(log);
    let err;
    for (let attempt = 0; attempt <= retries; attempt++) {
      // ввічлива пауза між запитами до одного сайту
      const wait = last + delayMs - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method,
          body,
          signal: ac.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': userAgent,
            'Accept-Language': 'en-GB,en;q=0.9',
            Accept: opts.accept || 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...(opts.headers || {}),
          },
        });
        const text = await res.text();
        if (!res.ok) {
          const e = new HttpError(res.status, url, text.slice(0, 2000));
          // 4xx (крім 408/429) не ретраїмо — це блок або неправильна адреса
          if (res.status < 500 && res.status !== 408 && res.status !== 429) throw Object.assign(e, { fatal: true });
          throw e;
        }
        if (record) record.put(key, text, /json/.test(res.headers.get('content-type') || '') ? '.json' : '.html');
        return text;
      } catch (e) {
        err = e.name === 'AbortError' ? new Error(`timeout ${timeoutMs}ms ${url}`) : e;
        // глибока причина від undici (напр. "Proxy response (403) !== 200 when HTTP Tunneling")
        const deep = [e.cause, e.cause?.cause].filter(Boolean).map((c) => c.message).join(' / ');
        if (deep && !(err instanceof HttpError)) err = Object.assign(new Error(`${err.message}: ${deep} [${url}]`), { cause: e });
        // 403/407 від проксі = хост заборонений політикою мережі → ретраї марні
        if (/Proxy response \((403|407)\)/.test(deep)) { err.message = `хост заблоковано проксі/мережевою політикою (${deep}) [${url}]`; break; }
        if (e.fatal || attempt === retries) break;
        const back = 1000 * 2 ** attempt;
        log.warn(`retry ${attempt + 1}/${retries} через ${back}ms: ${err.message}`);
        await sleep(back);
      } finally {
        clearTimeout(t);
      }
    }
    throw err;
  }

  return {
    fetchText,
    fetchHtml: (url, opts) => fetchText(url, opts),
    fetchJson: async (url, opts = {}) => {
      const t = await fetchText(url, { accept: 'application/json, text/plain, */*', ...opts });
      try {
        return JSON.parse(t);
      } catch {
        throw new Error(`не JSON у відповіді ${url}: ${t.slice(0, 120)}`);
      }
    },
    stats: () => ({ requests }),
  };
}
