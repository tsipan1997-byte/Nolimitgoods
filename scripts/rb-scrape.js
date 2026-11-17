// Run in the browser on a https://www.rbauction.co.uk page (javascript_exec).
// Set window.__AUCTION to the event slug, e.g. 'maltby-gbr-2026255'. Results land in window.__prices
// as { "<lot>": {bid, bids} }; window.__pfinished becomes true when done (≈2–3 min for 1,200 lots).
// Then read: JSON.stringify(window.__prices)
// Розбір за текстом сторінки: кожна картка — блок, що починається з «Lot N», далі «£X GBP» і «N bids».
const AUCTION = window.__AUCTION || 'maltby-gbr-2026255';
window.__prices = {}; window.__pfinished = false; window.__perr = [];
function parseLots(t) {
  const out = {};
  for (const seg of t.split(/\n(?=Lot \d+\n)/)) {
    const m = seg.match(/^Lot (\d+)\n/);
    if (!m) continue;
    const bid = (seg.match(/£([\d,]+)\s*\n?GBP/) || [])[1];
    const bids = (seg.match(/(\d+) bids?\b/) || [])[1];
    out[m[1]] = { bid: bid ? +bid.replace(/,/g, '') : null, bids: bids ? +bids : 0 };
  }
  return out;
}
(async () => {
  for (let from = 0; from < 3000; from += 60) {
    try {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-3000px;width:1300px;height:2000px';
      f.src = `/heavy-equipment-auctions/${AUCTION}?from=${from}`;
      document.body.appendChild(f);
      await new Promise((r) => (f.onload = r));
      let txt = '';
      for (let k = 0; k < 20; k++) {
        await new Promise((r) => setTimeout(r, 1000));
        txt = f.contentDocument.body.innerText;
        if ((txt.match(/\nLot \d+\n/g) || []).length >= 5 && /£[\d,]+/.test(txt)) break;
      }
      const before = Object.keys(window.__prices).length;
      Object.assign(window.__prices, parseLots('\n' + txt));
      f.remove();
      if (Object.keys(window.__prices).length === before) break; // past the last page
    } catch (e) { window.__perr.push(from + ': ' + e.message); }
  }
  window.__pfinished = true;
})();
