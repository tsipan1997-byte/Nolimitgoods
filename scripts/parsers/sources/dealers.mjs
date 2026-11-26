// Дилери (сток техніки дилерів: JCB-дилери, Kubota, б/в майданчики) — ЗАГЛУШКА. Вимкнено (enabled:false).
// TODO: визначити з Іваном перелік дилерів і формат (XML/CSV-фід, сторінка стоку, Mascus/MachineryTrader-профіль).
//  - кожен дилер — окремий об'єкт у DEALERS нижче з url і парсером картки;
//  - лоти дилерів не мають endsAt → endsAt:null, live:false, status 'active', доки позиція є у стоку.
import { defineSource } from '../lib/source.mjs';

const DEALERS = []; // { id, name, url, place }

export default defineSource({
  id: 'dealers',
  house: 'Dealers',
  name: 'Сток дилерів (заглушка)',
  enabled: false,
  needsBrowser: false,
  currency: 'GBP',
  baseUrl: '',
  async run(ctx) {
    if (!DEALERS.length) throw new Error('not implemented: список дилерів порожній');
    return { auctions: [], lots: [] };
  },
});
