// BCA (British Car Auctions) — ЗАГЛУШКА. Вимкнено (enabled:false).
// TODO: BCA продає LCV/пікапи лише зареєстрованим трейдерам; каталог за логіном (bca.co.uk/trade).
//  - потрібен трейдерський акаунт або партнерський фід BCA → обговорити з Іваном;
//  - після доступу: список розпродажів Commercial Vehicles + лоти з пікапами (категорія 'pickups'/'trucks').
import { defineSource } from '../lib/source.mjs';

export default defineSource({
  id: 'bca',
  house: 'BCA',
  name: 'BCA — комерційний транспорт (заглушка)',
  enabled: false,
  needsBrowser: false,
  currency: 'GBP',
  baseUrl: 'https://www.bca.co.uk',
  async run(ctx) {
    ctx.log.warn('BCA ще не реалізовано (потрібен трейдерський доступ)');
    throw new Error('not implemented: BCA потребує трейдерського доступу');
  },
});
