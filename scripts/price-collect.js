// Збір цін постачальників у вбудованому браузері (кабінети, де вже виконано вхід).
// Запуск через javascript_exec на вкладці потрібного сайту:
//   JCB  (https://parts.jcb.com/uk/...):            window.__MODE = 'jcb';   window.__TERMS = [...пошукові слова]
//   Kramp (https://www.kramp.com/shop-gb/en/...):    window.__MODE = 'kramp'; window.__PNS = [...номери деталей]
// потім вставити цей файл. Результат: window.__out — рядки «номер|ціна|назва» (для Kramp назва порожня),
// window.__done === true після завершення, window.__progress — скільки опрацьовано.
// Читаються лише звичайні сторінки пошуку, як їх бачить людина; жодних закритих API.
(function () {
  const MODE = window.__MODE;
  const items = MODE === 'jcb' ? window.__TERMS || [] : window.__PNS || [];
  window.__out = [];
  window.__done = false;
  window.__progress = 0;
  window.__errors = 0;

  const money = (s) => parseFloat(String(s).replace(/[£,]/g, ''));

  function frameText(url, ready) {
    return new Promise((resolve) => {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-5000px;top:0;width:1200px;height:2000px';
      f.src = url;
      let n = 0;
      const t = setInterval(() => {
        n++;
        let txt = '';
        try {
          txt = (f.contentDocument.querySelector('main') || f.contentDocument.body).innerText;
        } catch (e) {}
        if (ready(txt) || n > 25) {
          clearInterval(t);
          f.remove();
          resolve(txt);
        }
      }, 800);
      document.body.appendChild(f);
    });
  }

  function parseJcb(txt) {
    const L = txt.split('\n').map((s) => s.trim()).filter(Boolean);
    const out = [];
    for (let i = 2; i < L.length - 1; i++) {
      if (/^£[\d,]+\.\d\d$/.test(L[i]) && L[i + 1] === 'Ex. VAT') {
        const pn = L[i - 1];
        const title = L[i - 2];
        if (/^[0-9A-Z]{1,5}[\/-][0-9A-Z\/-]+$/i.test(pn)) out.push(`${pn}|${money(L[i])}|${title.replace(/\|/g, '/')}`);
      }
    }
    return out;
  }

  function parseKramp(txt, pn) {
    const L = txt.split('\n').map((s) => s.trim()).filter(Boolean);
    const want = pn.replace(/[^0-9A-Z]/gi, '').toUpperCase();
    for (let i = 0; i < L.length; i++) {
      if (L[i].replace(/[^0-9A-Z]/gi, '').toUpperCase() !== want) continue;
      for (let j = i + 1; j < Math.min(i + 8, L.length); j++) {
        if (/^£[\d,]+\.\d\d$/.test(L[j])) return `${pn}|${money(L[j])}|`;
      }
    }
    return null;
  }

  (async () => {
    const seen = new Set();
    for (const it of items) {
      try {
        if (MODE === 'jcb') {
          const txt = await frameText('/uk/global-search/' + encodeURIComponent(it), (t) => /Ex\. VAT|0 results|No results/i.test(t));
          for (const line of parseJcb(txt)) {
            const pn = line.split('|')[0];
            if (!seen.has(pn)) {
              seen.add(pn);
              window.__out.push(line);
            }
          }
        } else {
          const txt = await frameText('/shop-gb/en/search/' + encodeURIComponent(it), (t) => /search result|No exact match/i.test(t) && /£|No exact/i.test(t));
          const line = parseKramp(txt, it);
          if (line) window.__out.push(line);
        }
      } catch (e) {
        window.__errors++;
      }
      window.__progress++;
      await new Promise((r) => setTimeout(r, 1200));
    }
    window.__done = true;
  })();
  return `started ${MODE}: ${items.length}`;
})();
