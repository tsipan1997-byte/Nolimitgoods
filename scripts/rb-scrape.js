// Run in the browser on a https://www.rbauction.co.uk page (javascript_exec).
// Set AUCTION to the event slug, e.g. 'maltby-gbr-2026255'. Results land in window.__prices
// as { "<lot>": {bid, bids} }; window.__pfinished becomes true when done (≈2–3 min for 1,200 lots).
// Then read: JSON.stringify(window.__prices)
const AUCTION = window.__AUCTION || 'maltby-gbr-2026255';
window.__prices = {}; window.__pfinished = false; window.__perr = [];
(async () => {
  for (let from = 0; from < 3000; from += 60) {
    try {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-3000px;width:1300px;height:2000px';
      f.src = `/heavy-equipment-auctions/${AUCTION}?from=${from}`;
      document.body.appendChild(f);
      await new Promise((r) => (f.onload = r));
      let cards = [];
      for (let k = 0; k < 20; k++) {
        await new Promise((r) => setTimeout(r, 1000));
        cards = [...f.contentDocument.querySelectorAll('a[href*="/pdp/"]')];
        if (cards.length >= 5 && /£[\d,]+/.test(f.contentDocument.body.innerText)) break;
      }
      const before = Object.keys(window.__prices).length;
      const seen = new Set();
      for (const a of cards) {
        let c = a;
        for (let i = 0; i < 8 && c && !/^Lot \d+/.test(c.innerText || ''); i++) c = c.parentElement;
        if (!c) continue;
        const t = c.innerText;
        const lot = (t.match(/Lot (\d+)/) || [])[1];
        if (!lot || seen.has(lot)) continue;
        seen.add(lot);
        const bid = (t.match(/£([\d,]+)/) || [])[1];
        const bids = (t.match(/(\d+) bids?/) || [])[1];
        window.__prices[lot] = { bid: bid ? +bid.replace(/,/g, '') : null, bids: bids ? +bids : 0 };
      }
      f.remove();
      if (cards.length === 0 || Object.keys(window.__prices).length === before) break; // past the last page
    } catch (e) { window.__perr.push(from + ': ' + e.message); }
  }
  window.__pfinished = true;
})();
