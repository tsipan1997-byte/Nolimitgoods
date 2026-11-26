// Лінивий запуск headless Chromium через Playwright — лише для джерел, яким він справді потрібен.
// Playwright шукаємо: у scripts/parsers/node_modules, у корені проєкту, у глобальних модулях (NODE_PATH).

import { createRequire } from 'node:module';

export function loadPlaywright() {
  const req = createRequire(import.meta.url);
  for (const name of ['playwright', 'playwright-core']) {
    try { return req(name); } catch { /* далі */ }
  }
  return null;
}

/** @returns {{get: () => Promise<any|null>, close: () => Promise<void>}} */
export function browserPool({ allowed, log }) {
  let browser = null;
  let tried = false;
  return {
    async get() {
      if (!allowed) return null;
      if (browser || tried) return browser;
      tried = true;
      const pw = loadPlaywright();
      if (!pw) { log.warn('playwright не знайдено — браузерні джерела/запасні шляхи вимкнені'); return null; }
      const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
      browser = await pw.chromium.launch({ headless: true, ...(proxy ? { proxy: { server: proxy } } : {}) });
      log.info('headless chromium запущено');
      return browser;
    },
    async close() { if (browser) await browser.close().catch(() => {}); browser = null; },
  };
}

/**
 * Відкриває сторінку в браузері й збирає всі JSON-відповіді XHR/fetch (щоб знайти API сайту).
 * @returns {Promise<{html:string, json:{url:string, data:any}[]}>}
 */
export async function sniffPage(browser, url, { waitMs = 6000, scroll = true, log } = {}) {
  const ctx = await browser.newContext({ locale: 'en-GB', viewport: { width: 1300, height: 900 } });
  const page = await ctx.newPage();
  const json = [];
  page.on('response', async (r) => {
    try {
      if (!/json/.test(r.headers()['content-type'] || '')) return;
      json.push({ url: r.url(), method: r.request().method(), postData: r.request().postData() || null, data: await r.json() });
    } catch { /* тіло недоступне */ }
  });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(waitMs);
    if (scroll) await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } });
    await page.waitForTimeout(1500);
    const html = await page.content();
    for (const j of json) log?.debug?.(`XHR JSON: ${j.method} ${j.url}`);
    return { html, json };
  } finally {
    await ctx.close().catch(() => {});
  }
}
