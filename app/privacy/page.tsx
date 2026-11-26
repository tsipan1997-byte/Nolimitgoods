import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT } from '@/lib/site-config';
import { getTenant } from '@/lib/tenant-server';
import type { Tenant } from '@/lib/tenants';

// WHITE LABEL: політика конфіденційності на юрособу партнера.
// Для NoLimitGoods (isDefault) рендериться оригінальний текст без змін (NoLimitGoodsPrivacy нижче),
// щоб HTML лишився символ у символ. Для партнера — PartnerPrivacy з даними з lib/tenants.ts.
export function generateMetadata(): Metadata {
  const t = getTenant();
  return {
    title: `Політика конфіденційності | ${t.brand.nameLegal}`,
    description: `Політика конфіденційності та використання cookie ${t.company.legalNameFull} (${t.company.numberLabel}: ${t.company.number}).`,
  };
}

export default function PrivacyPage() {
  const t = getTenant();
  if (!t.isDefault) return <PartnerPrivacy t={t} />;
  return <NoLimitGoodsPrivacy />;
}

// Оригінальна політика NoLimitGoods — НЕ змінювати без потреби (впливає на основний сайт).
function NoLimitGoodsPrivacy() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-block text-sm text-slate-400 hover:text-white mb-8 underline underline-offset-4"
        >
          ← На головну / Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Політика конфіденційності
        </h1>
        <p className="text-sm text-slate-500 mb-10">Оновлено: 21 листопада 2026 / Last updated: 21 November 2026</p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Хто відповідає за ваші дані</h2>
            <p>
              Контролер персональних даних: <strong className="text-white">NoLimitGoods Limited</strong>,
              зареєстрована в Англії та Уельсі, Company No: 13146899, адреса: 374 Hipswell Highway, Coventry,
              CV2 5FR, United Kingdom. Email для питань щодо даних:{' '}
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4 text-white">
                {CONTACT.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Які дані ми збираємо</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Дані із запиту: каталожні номери та опис деталей, кількість, країна доставки, коментар, а також
                контакт, який ви вказали (телефон, Telegram, Viber або email).
              </li>
              <li>
                Листування в месенджерах (WhatsApp, Telegram, Viber), коли ви пишете нам напряму.
              </li>
              <li>
                Технічні дані та cookie: IP-адреса, тип пристрою і браузера, сторінки, які ви переглядали,
                джерело переходу (наприклад, рекламне оголошення). Вони збираються за допомогою піксель Meta
                (Facebook) та Google Ads, лише якщо ви дали на це згоду.
              </li>
              <li>
                Дані для вимірювання реклами без cookie: коли ви надсилаєте запит або натискаєте кнопку
                месенджера чи телефону, наш сервер повідомляє Meta про цю дію (див. розділ 5).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Для чого ми використовуємо дані</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Щоб обробити ваш запит, перевірити наявність деталей, розрахувати вартість і звʼязатися з вами.</li>
              <li>Щоб оформити замовлення, поставку та супровідні документи, якщо ви вирішите купувати.</li>
              <li>
                Щоб вимірювати ефективність реклами та показувати релевантну рекламу (через cookie — лише за
                вашою згодою; без cookie — лише факт заявки чи кліку, див. розділ 5).
              </li>
              <li>Щоб виконувати вимоги законодавства (облік, податки, експортні документи).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Правові підстави</h2>
            <p>
              Обробка запиту та замовлення ґрунтується на необхідності для укладення й виконання договору та на
              нашому законному інтересі відповідати на звернення. Cookie та рекламні піксель працюють лише на
              підставі вашої згоди, яку можна відкликати будь-коли. Повідомлення Meta про заявку чи клік з
              нашого сервера (без cookie) ґрунтується на нашому законному інтересі вимірювати, чи приводить
              реклама звернення; ви можете заперечити проти цього, написавши нам. Дотримання законодавства ґрунтується на
              юридичному обовʼязку.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Cookie та піксель</h2>
            <p className="mb-2">
              Під час першого візиту ми показуємо банер. До вашої згоди піксель Meta та Google Ads не збирають
              дані про ваші відвідування. Якщо ви натиснули «Прийняти», вони можуть збирати інформацію про
              перегляди сторінок та дії на сайті (наприклад, відправку запиту або клік по кнопці месенджера).
            </p>
            <p>
              Змінити вибір можна будь-коли через посилання «Налаштування cookie» у футері сайту. Також ви
              можете видалити cookie в налаштуваннях браузера та керувати рекламними вподобаннями в
              налаштуваннях вашого акаунта Meta і Google.
            </p>
            <p className="mt-2">
              Незалежно від cookie, коли ви надсилаєте запит через форму або натискаєте кнопку Telegram,
              WhatsApp, Viber, телефону чи email, наш сервер передає Meta (Conversions API) лише факт цієї дії:
              тип події, сторінку, IP-адресу, тип браузера, ідентифікатор рекламного кліку (якщо ви прийшли з
              реклами Meta) і, для заявок, ваш телефон або email у захешованому вигляді (SHA-256, необоротне
              перетворення). Ми не записуємо для цього жодних cookie на ваш пристрій. Meta використовує ці дані,
              щоб порахувати, скільки звернень дала реклама. Щоб ми не передавали ваші дані таким чином,
              напишіть нам на email, вказаний нижче.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Кому ми передаємо дані</h2>
            <p className="mb-2">Ми не продаємо ваші дані. Вони можуть оброблятися нашими постачальниками послуг:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Meta Platforms та Google (реклама і вимірювання: через cookie — лише за згодою; факт заявки чи кліку — див. розділ 5);</li>
              <li>хостинг-провайдер сайту (Vercel) та сервіси зберігання даних;</li>
              <li>сервіси звʼязку та внутрішніх сповіщень (Telegram, WhatsApp, Viber, email);</li>
              <li>
                постачальники запчастин та логістичні партнери (наприклад, служби доставки), у межах, потрібних
                для виконання вашого замовлення.
              </li>
            </ul>
            <p className="mt-2">
              Деякі з цих сервісів розташовані за межами Великобританії. У такому разі ми покладаємося на
              передбачені законом механізми захисту передачі даних.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">7. Скільки ми зберігаємо дані</h2>
            <p>
              Ми зберігаємо дані не довше, ніж потрібно для цілей, описаних вище, і відповідно до вимог
              законодавства щодо бухгалтерських та експортних документів.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">8. Ваші права</h2>
            <p className="mb-2">
              Відповідно до UK GDPR ви маєте право: отримати доступ до своїх даних, виправити їх, видалити,
              обмежити обробку, заперечити проти обробки, отримати копію даних у зручному форматі та відкликати
              згоду. Щоб скористатися правами, напишіть нам на{' '}
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4 text-white">
                {CONTACT.email}
              </a>
              .
            </p>
            <p>
              Ви також можете подати скаргу до наглядового органу Великобританії: Information Commissioner’s
              Office (ICO), ico.org.uk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">9. Зміни до політики</h2>
            <p>
              Ми можемо оновлювати цю політику. Актуальна версія завжди доступна на цій сторінці з датою
              оновлення.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">Summary in English</h2>
            <p>
              NoLimitGoods Limited (Company No: 13146899, 374 Hipswell Highway, Coventry, CV2 5FR, UK) is the data
              controller. We collect the contact details and parts enquiry information you submit, and, only with
              your consent, cookie and pixel data (Meta and Google Ads) to measure and improve advertising. Without
              using cookies, our server also tells Meta (Conversions API) when you submit an enquiry or tap a
              messenger, phone or email button: the event type, page, IP address, browser type, the ad click ID if
              you came from a Meta ad and, for enquiries, your phone or email in hashed (SHA-256) form. This is
              based on our legitimate interest in measuring which ads bring enquiries; you can object by emailing
              us. We do
              not sell your data. Service providers may process it on our behalf (hosting, messaging, advertising
              platforms, logistics). You have rights under UK GDPR, including access, correction, deletion and
              withdrawal of consent. You can change your cookie choice any time via “Налаштування cookie” in the
              site footer. Contact:{' '}
              <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4 text-white">
                {CONTACT.email}
              </a>
              . You may complain to the ICO (ico.org.uk).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Політика для партнера (дистриб'ютора): юрособа, юрисдикція, email — з конфігу.
// Розділи про Meta Pixel / Google Ads / GA4 показуються лише якщо в t.analytics є відповідні ID.
// ---------------------------------------------------------------------------
function PartnerPrivacy({ t }: { t: Tenant }) {
  const c = t.company;
  const email = c.privacyEmail || t.contact.email;
  const hasMeta = !!t.analytics.metaPixelId;
  const hasGoogleAds = !!t.analytics.googleAdsId;
  const hasGa4 = !!t.analytics.ga4Id;
  const hasAnalytics = hasMeta || hasGoogleAds || hasGa4;
  // Перелік підключених сервісів аналітики/реклами для текстів
  const toolsUk = [hasMeta && 'піксель Meta (Facebook)', hasGoogleAds && 'Google Ads', hasGa4 && 'Google Analytics']
    .filter(Boolean)
    .join(', ');
  const toolsEn = [hasMeta && 'Meta Pixel', hasGoogleAds && 'Google Ads', hasGa4 && 'Google Analytics'].filter(Boolean).join(', ');
  const vendorsUk = [hasMeta && 'Meta Platforms', (hasGoogleAds || hasGa4) && 'Google'].filter(Boolean).join(' та ');
  // Права суб'єкта даних і наглядовий орган — залежно від країни юрособи
  const isUk = c.countryCode === 'GB';
  const isUa = c.countryCode === 'UA';
  const lawUk = isUk
    ? 'Відповідно до UK GDPR'
    : isUa
      ? 'Відповідно до Закону України «Про захист персональних даних»'
      : 'Відповідно до чинного законодавства про захист персональних даних';
  const authorityUk = isUk
    ? 'Information Commissioner’s Office (ICO), ico.org.uk'
    : isUa
      ? 'Уповноваженого Верховної Ради України з прав людини (ombudsman.gov.ua)'
      : 'наглядового органу з питань захисту персональних даних у вашій країні';
  const lawEn = isUk ? 'under UK GDPR' : isUa ? 'under the Law of Ukraine “On Personal Data Protection”' : 'under applicable data protection law';
  const authorityEn = isUk
    ? 'the ICO (ico.org.uk)'
    : isUa
      ? 'the Ukrainian Parliament Commissioner for Human Rights (ombudsman.gov.ua)'
      : 'your local data protection authority';
  const regUk = `${c.numberLabel}: ${c.number}`;
  const requestUk = t.features.parts
    ? 'каталожні номери та опис деталей або техніка чи лот, що вас цікавить'
    : 'лот або техніка, що вас цікавить';
  const requestEn = t.features.parts ? 'parts or machinery enquiry information' : 'the lot or machinery enquiry information';
  let n = 0;
  const num = () => ++n;
  const mail = (
    <a href={`mailto:${email}`} className="underline underline-offset-4 text-white">
      {email}
    </a>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link href="/" className="inline-block text-sm text-slate-400 hover:text-white mb-8 underline underline-offset-4">
          ← На головну / Back to home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Політика конфіденційності</h1>
        <p className="text-sm text-slate-500 mb-10">Оновлено: 21 листопада 2026 / Last updated: 21 November 2026</p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Хто відповідає за ваші дані</h2>
            <p>
              Контролер персональних даних: <strong className="text-white">{c.legalNameFull}</strong>, зареєстрована в{' '}
              {c.jurisdictionUk}, {regUk}
              {c.vat ? `, VAT/ІПН: ${c.vat}` : ''}, адреса: {c.address}. Email для питань щодо даних: {mail}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Які дані ми збираємо</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Дані із запиту: {requestUk}, країна доставки, коментар, а також контакт, який ви вказали (телефон,
                Telegram, Viber або email).
              </li>
              <li>Листування в месенджерах (WhatsApp, Telegram, Viber), коли ви пишете нам напряму.</li>
              {hasAnalytics ? (
                <li>
                  Технічні дані та cookie: IP-адреса, тип пристрою і браузера, сторінки, які ви переглядали, джерело
                  переходу (наприклад, рекламне оголошення). Вони збираються за допомогою {toolsUk}, лише якщо ви дали
                  на це згоду.
                </li>
              ) : (
                <li>
                  Технічні дані, потрібні для роботи сайту: IP-адреса, тип пристрою і браузера (журнали сервера). Ми не
                  використовуємо рекламні пікселі та аналітичні cookie.
                </li>
              )}
              {hasMeta && (
                <li>
                  Дані для вимірювання реклами без cookie: коли ви надсилаєте запит або натискаєте кнопку месенджера чи
                  телефону, наш сервер повідомляє Meta про цю дію (див. розділ «Cookie та пікселі»).
                </li>
              )}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Для чого ми використовуємо дані</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Щоб обробити ваш запит, перевірити наявність, розрахувати вартість і звʼязатися з вами.</li>
              <li>Щоб оформити замовлення, купівлю, доставку та супровідні документи, якщо ви вирішите купувати.</li>
              {hasAnalytics && (
                <li>
                  Щоб вимірювати ефективність реклами та відвідуваність сайту (через cookie — лише за вашою згодою
                  {hasMeta ? '; без cookie — лише факт заявки чи кліку' : ''}).
                </li>
              )}
              <li>Щоб виконувати вимоги законодавства (облік, податки, митні та експортні документи).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Правові підстави</h2>
            <p>
              Обробка запиту та замовлення ґрунтується на необхідності для укладення й виконання договору та на нашому
              законному інтересі відповідати на звернення.
              {hasAnalytics ? ' Cookie та рекламні пікселі працюють лише на підставі вашої згоди, яку можна відкликати будь-коли.' : ''}
              {hasMeta
                ? ' Повідомлення Meta про заявку чи клік з нашого сервера (без cookie) ґрунтується на нашому законному інтересі вимірювати, чи приводить реклама звернення; ви можете заперечити проти цього, написавши нам.'
                : ''}{' '}
              Дотримання законодавства ґрунтується на юридичному обовʼязку.
            </p>
          </section>

          {hasAnalytics && (
            <section>
              <h2 className="text-xl font-bold text-white mb-2">{num()}. Cookie та пікселі</h2>
              <p className="mb-2">
                Під час першого візиту ми показуємо банер. До вашої згоди {toolsUk} не збирають дані про ваші
                відвідування. Якщо ви натиснули «Прийняти», вони можуть збирати інформацію про перегляди сторінок та
                дії на сайті (наприклад, відправку запиту або клік по кнопці месенджера).
              </p>
              <p>
                Змінити вибір можна будь-коли через посилання «Налаштування cookie» у футері сайту. Також ви можете
                видалити cookie в налаштуваннях браузера та керувати рекламними вподобаннями в налаштуваннях вашого
                акаунта {vendorsUk}.
              </p>
              {hasMeta && (
                <p className="mt-2">
                  Незалежно від cookie, коли ви надсилаєте запит через форму або натискаєте кнопку Telegram, WhatsApp,
                  Viber, телефону чи email, наш сервер передає Meta (Conversions API) лише факт цієї дії: тип події,
                  сторінку, IP-адресу, тип браузера, ідентифікатор рекламного кліку (якщо ви прийшли з реклами Meta)
                  і, для заявок, ваш телефон або email у захешованому вигляді (SHA-256). Щоб ми не передавали ваші
                  дані таким чином, напишіть нам на email, вказаний нижче.
                </p>
              )}
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Кому ми передаємо дані</h2>
            <p className="mb-2">Ми не продаємо ваші дані. Вони можуть оброблятися нашими постачальниками послуг:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              {hasAnalytics && <li>{vendorsUk} (реклама і вимірювання — лише в межах, описаних вище);</li>}
              <li>хостинг-провайдер сайту (Vercel) та сервіси зберігання даних;</li>
              <li>сервіси звʼязку та внутрішніх сповіщень (Telegram, WhatsApp, Viber, email);</li>
              <li>
                британський партнер-експортер — для організації купівлі на аукціоні та експорту з Великої Британії
                передаються лише технічні дані лота (номер лота, опис техніки), без ваших контактних даних;
              </li>
              <li>
                аукціонні доми, постачальники та логістичні партнери (наприклад, перевізники і митні брокери) — у
                межах, потрібних для виконання вашого замовлення.
              </li>
            </ul>
            <p className="mt-2">
              Деякі з цих сервісів розташовані в інших країнах. У такому разі ми покладаємося на передбачені законом
              механізми захисту передачі даних.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Скільки ми зберігаємо дані</h2>
            <p>
              Ми зберігаємо дані не довше, ніж потрібно для цілей, описаних вище, і відповідно до вимог законодавства
              щодо бухгалтерських, митних та експортних документів.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Ваші права</h2>
            <p className="mb-2">
              {lawUk} ви маєте право: отримати доступ до своїх даних, виправити їх, видалити, обмежити обробку,
              заперечити проти обробки, отримати копію даних і відкликати згоду. Щоб скористатися правами, напишіть
              нам на {mail}.
            </p>
            <p>Ви також можете подати скаргу до {authorityUk}.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">{num()}. Зміни до політики</h2>
            <p>Ми можемо оновлювати цю політику. Актуальна версія завжди доступна на цій сторінці з датою оновлення.</p>
          </section>

          <section className="pt-6 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-2">Summary in English</h2>
            <p>
              {c.legalNameFull} ({regUk}, {c.address}), registered in {c.jurisdictionEn}, is the data controller. We
              collect the contact details and {requestEn} you submit
              {hasAnalytics
                ? `, and, only with your consent, cookie and pixel data (${toolsEn}) to measure and improve advertising`
                : '; we do not use advertising pixels or analytics cookies'}
              .
              {hasMeta
                ? ' Without using cookies, our server also tells Meta (Conversions API) when you submit an enquiry or tap a messenger, phone or email button; you can object by emailing us.'
                : ''}{' '}
              We do not sell your data. Service providers may process it on our behalf (hosting, messaging,
              {hasAnalytics ? ' advertising platforms,' : ''} auction houses, logistics). To arrange the purchase and
              export from the UK, technical lot data (lot number, machine description) is shared with our UK export
              partner, without your contact details. You have rights {lawEn}, including access, correction, deletion
              and withdrawal of consent. Contact: {mail}. You may complain to {authorityEn}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
