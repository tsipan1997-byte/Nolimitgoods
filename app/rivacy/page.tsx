import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Політика конфіденційності | NoLimitGoods Ltd',
  description:
    'Політика конфіденційності та використання cookie NoLimitGoods Limited (Company No: 13146899).',
};

export default function PrivacyPage() {
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
        <p className="text-sm text-slate-500 mb-10">Оновлено: 28 жовтня 2026 / Last updated: 28 October 2026</p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Хто відповідає за ваші дані</h2>
            <p>
              Контролер персональних даних: <strong className="text-white">NoLimitGoods Limited</strong>,
              зареєстрована в Англії та Уельсі, Company No: 13146899, адреса: 374 Hipsell Highway, Coventry,
              CV2 5FR, United Kingdom. Email для питань щодо даних:{' '}
              <a href="mailto:sales@nolimitgoods.co.uk" className="underline underline-offset-4 text-white">
                sales@nolimitgoods.co.uk
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
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Для чого ми використовуємо дані</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Щоб обробити ваш запит, перевірити наявність деталей, розрахувати вартість і звʼязатися з вами.</li>
              <li>Щоб оформити замовлення, поставку та супровідні документи, якщо ви вирішите купувати.</li>
              <li>
                Щоб вимірювати ефективність реклами та показувати релевантну рекламу (лише за вашою згодою
                на cookie).
              </li>
              <li>Щоб виконувати вимоги законодавства (облік, податки, експортні документи).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Правові підстави</h2>
            <p>
              Обробка запиту та замовлення ґрунтується на необхідності для укладення й виконання договору та на
              нашому законному інтересі відповідати на звернення. Cookie та рекламні піксель працюють лише на
              підставі вашої згоди, яку можна відкликати будь-коли. Дотримання законодавства ґрунтується на
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
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">6. Кому ми передаємо дані</h2>
            <p className="mb-2">Ми не продаємо ваші дані. Вони можуть оброблятися нашими постачальниками послуг:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Meta Platforms та Google (реклама і вимірювання, лише за згодою);</li>
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
              <a href="mailto:sales@nolimitgoods.co.uk" className="underline underline-offset-4 text-white">
                sales@nolimitgoods.co.uk
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
              NoLimitGoods Limited (Company No: 13146899, 374 Hipsell Highway, Coventry, CV2 5FR, UK) is the data
              controller. We collect the contact details and parts enquiry information you submit, and, only with
              your consent, cookie and pixel data (Meta and Google Ads) to measure and improve advertising. We do
              not sell your data. Service providers may process it on our behalf (hosting, messaging, advertising
              platforms, logistics). You have rights under UK GDPR, including access, correction, deletion and
              withdrawal of consent. You can change your cookie choice any time via “Налаштування cookie” in the
              site footer. Contact:{' '}
              <a href="mailto:sales@nolimitgoods.co.uk" className="underline underline-offset-4 text-white">
                sales@nolimitgoods.co.uk
              </a>
              . You may complain to the ICO (ico.org.uk).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
