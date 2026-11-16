// Інтерактивні схеми: точки на картинці (x, y у відсотках від ширини/висоти).
// catalogId — якщо деталь є в каталозі, показуємо її ціну й кнопку «Додати в запит».
// Без catalogId — показуємо «ціна на запит» і кнопку, що підставляє назву у форму.

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  uk: string;
  en: string;
  descUk: string;
  descEn: string;
  catalogId?: string;
}

export interface Diagram {
  id: string;
  titleUk: string;
  titleEn: string;
  image: string;
  width: number;
  height: number;
  machineUk: string;
  machineEn: string;
  hotspots: Hotspot[];
}

export const JCB_444_ENGINE: Diagram = {
  id: 'jcb-444-engine',
  titleUk: 'Двигун JCB Dieselmax 444 (4.4 л)',
  titleEn: 'JCB Dieselmax 444 engine (4.4 L)',
  image: '/images/jcb-444-engine-diagram.jpg',
  width: 1024,
  height: 1535,
  machineUk: 'Двигун JCB 444',
  machineEn: 'JCB 444 engine',
  hotspots: [
    { id: 'turbo', x: 14, y: 15, uk: 'Турбокомпресор', en: 'Turbocharger', descUk: 'Нагнітає повітря в циліндри, дає потужність під навантаженням.', descEn: 'Boosts intake air for power under load.', catalogId: 'jcb-762932-turbo' },
    { id: 'intake', x: 42, y: 10, uk: 'Впускний колектор', en: 'Intake manifold', descUk: 'Розподіляє очищене повітря по циліндрах.', descEn: 'Distributes clean air to the cylinders.' },
    { id: 'valve-cover', x: 58, y: 16, uk: 'Клапанна кришка', en: 'Valve cover', descUk: 'Закриває клапанний механізм, часто міняють прокладку.', descEn: 'Covers the valve train; gasket is a common replacement.' },
    { id: 'rail', x: 86, y: 19, uk: 'Паливна рампа і форсунки', en: 'Common rail & injectors', descUk: 'Подають паливо під високим тиском.', descEn: 'High-pressure fuel injection.' },
    { id: 'egr', x: 15, y: 29, uk: 'Охолоджувач EGR', en: 'EGR cooler', descUk: 'Охолоджує відпрацьовані гази для системи рециркуляції.', descEn: 'Cools exhaust gas for recirculation.' },
    { id: 'head', x: 45, y: 29, uk: 'Головка блоку циліндрів (ГБЦ)', en: 'Cylinder head', descUk: 'Клапани, розподільний вал, клапанний механізм.', descEn: 'Valves, camshaft and valve train.' },
    { id: 'camshaft', x: 80, y: 33, uk: 'Розподільний вал', en: 'Camshaft', descUk: 'Керує відкриттям клапанів.', descEn: 'Controls valve timing.' },
    { id: 'head-gasket', x: 40, y: 42, uk: 'Прокладка ГБЦ', en: 'Head gasket', descUk: 'Герметизує камеру згоряння між блоком і головкою.', descEn: 'Seals the combustion chamber.', catalogId: 'jcb-320-02709' },
    { id: 'piston', x: 70, y: 47, uk: 'Поршень і шатун', en: 'Piston & conrod', descUk: 'Перетворюють тиск згоряння на рух.', descEn: 'Convert combustion force to motion.' },
    { id: 'block', x: 40, y: 57, uk: 'Блок циліндрів', en: 'Engine block', descUk: 'Основа двигуна: циліндри, поршні, колінвал.', descEn: 'Houses cylinders, pistons and crankshaft.' },
    { id: 'oil-pump', x: 83, y: 59, uk: 'Масляний насос', en: 'Oil pump', descUk: 'Подає масло до всіх вузлів двигуна.', descEn: 'Circulates engine oil.' },
    { id: 'timing', x: 11, y: 73, uk: 'Привід ГРМ', en: 'Timing drive', descUk: 'Синхронізує колінчастий і розподільний вали.', descEn: 'Synchronises crankshaft and camshaft.' },
    { id: 'crank', x: 49, y: 70, uk: 'Колінчастий вал', en: 'Crankshaft', descUk: 'Перетворює рух поршнів на обертання.', descEn: 'Turns piston motion into rotation.' },
    { id: 'flywheel', x: 79, y: 71, uk: 'Маховик', en: 'Flywheel', descUk: 'Згладжує обертання, з ним працює стартер.', descEn: 'Smooths rotation; starter engages it.' },
    { id: 'alternator', x: 9, y: 88, uk: 'Генератор', en: 'Alternator', descUk: 'Заряджає акумулятор і живить електрику.', descEn: 'Charges the battery, powers electrics.', catalogId: 'jcb-320-08610' },
    { id: 'starter', x: 24, y: 88, uk: 'Стартер', en: 'Starter motor', descUk: 'Прокручує двигун під час запуску.', descEn: 'Cranks the engine at start.', catalogId: 'jcb-320-09346' },
    { id: 'sump', x: 51, y: 85, uk: 'Масляний піддон', en: 'Oil sump', descUk: 'Резервуар для моторного масла.', descEn: 'Holds the engine oil.' },
    { id: 'oil-filter', x: 71, y: 87, uk: 'Масляний фільтр', en: 'Oil filter', descUk: 'Очищує масло. Міняється на кожному ТО.', descEn: 'Cleans engine oil; changed at every service.', catalogId: 'jcb-lf17556' },
    { id: 'water-pump', x: 88, y: 84, uk: 'Водяна помпа', en: 'Water pump', descUk: 'Гонить охолоджувальну рідину по системі.', descEn: 'Circulates coolant.', catalogId: 'jcb-320-b4568' },
  ],
};
