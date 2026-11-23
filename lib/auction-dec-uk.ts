// Лоти з грудневих аукціонів Великої Британії (2026): Wilsons Auctions (Ньюкасл),
// Malcolm Harrison (Прис, Шропшир) і Morris Leslie (Еррол, Шотландія).
// Зібрано 23.11.2026 з каталогів аукціонів: лише техніка з фото (без навісного, генераторів,
// причепів, легковиків і фургонів). Каталоги ще поповнюються, номери лотів частково не присвоєні.
// Wilsons Белфаст (8 грудня) і Портадаун (3 грудня): у каталогах поки немає техніки з фото.
// Malcolm Harrison, онлайн-торги 11 грудня: каталог ще не опубліковано.
// Ставки тут не зберігаються.

import type { AuctionInfo, AuctionLot } from './auction-lots';

export const DEC_UK_AUCTIONS: AuctionInfo[] = [
  {
    id: 'wilsons-newcastle-dec',
    house: 'Wilsons Auctions',
    name: 'HGV, Plant & Commercial Vehicle Auction',
    place: 'Ньюкасл, Англія',
    dates: '9 грудня 2026',
    format: 'Живі торги + онлайн-ставки',
    totalLots: 21,
    unreserved: false,
    url: 'https://www.wilsonsauctions.com/auctions/hgv-plant-commercial-vehicle-auction-6340',
  },
  {
    id: 'mh-prees-dec',
    house: 'Malcolm Harrison',
    name: 'Prees Plant & Agricultural Auction (Ring 1) + Truck & Trailer (Ring 2)',
    place: 'Прис, Шропшир, Англія',
    dates: '12 грудня 2026',
    format: 'Живі торги + онлайн-ставки',
    totalLots: 206,
    unreserved: false,
    url: 'https://auctions.malcolmharrison.co.uk/auctions/catalog/id/448',
  },
  {
    id: 'ml-errol-dec',
    house: 'Morris Leslie',
    name: 'Plant & Commercial',
    place: 'Еррол, Шотландія',
    dates: '9 грудня 2026',
    format: 'Живі торги + онлайн-ставки',
    totalLots: 23,
    unreserved: false,
    url: 'https://auction.morrisleslie.com/auction/216',
  },
];

type Raw = {
  lot?: string; item: string; cat: AuctionLot['category']; title: string; original: string;
  year: number | null; hours?: number | null; miles?: number | null; specs: string; img: string;
  unused?: boolean; location?: string; path?: string;
};

const MI = 1.609;
const km = (miles: number) => Math.round(miles * MI);

// ---------- Wilsons Auctions, Ньюкасл, 9 грудня ----------
const W_PLACE = 'Ньюкасл, Англія';
const W_BASE = 'https://www.wilsonsauctions.com/auctions/hgv-plant-commercial-vehicle-auction-6340/lots/';
const W_IMG = 'https://assets.wilsonsauctions.com///lots_';

const WILSONS: Raw[] = [
  { item: '553752', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 100E19K', original: '2014 Iveco Eurocargo 100e19k Tipper', year: 2014, miles: 67645, specs: 'від міської ради (NEPO), пробіг 67 645 км', img: 'asset-487772%2F17954351381084697415115102990122.jpg_5546963' },
  { item: '553754', cat: 'trucks', title: 'Вантажівка з гаковим підйомником Iveco Eurocargo 100E18K', original: '2013 Iveco Eurocargo 100e18k Hook Lift', year: 2013, miles: 62438, specs: 'мультиліфт, від міської ради (NEPO), пробіг 62 438 км', img: 'asset-487774%2F17954350456457862618771343758142.jpg_5963402' },
  { item: '555451', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 100E18K', original: '2013 Iveco Eurocargo 100e18k Tipper', year: 2013, miles: 69576, specs: 'від міської ради (NEPO), пробіг 69 576 км', img: 'asset-488279%2F17954350893092345655578075691109.jpg_6048482' },
  { item: '556252', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 100E18K', original: '2013 Iveco Eurocargo 100e18k Tipper', year: 2013, miles: 77445, specs: 'від міської ради (NEPO), пробіг 77 445 км', img: '1795165342%2F17951652536457645262629470971983.jpg_6022122' },
  { item: '555452', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E16K', original: '2015 Iveco Eurocargo 75e16k Tipper', year: 2015, miles: 108599, specs: '7,5 т, від міської ради (NEPO), пробіг 108 599 км', img: 'asset-488290%2F17954352190357590255429351989466.jpg_6139760' },
  { item: '555455', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E16K', original: '2015 Iveco Eurocargo 75e16k Tipper', year: 2015, miles: 104900, specs: '7,5 т, від міської ради (NEPO), пробіг 104 900 км', img: 'asset-488002%2F17954351790633678727422628945954.jpg_5726855' },
  { item: '556251', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E16K', original: '2015 Iveco Eurocargo 75e16k Tipper S-A', year: 2015, miles: km(97648), specs: '7,5 т, від міської ради (NEPO), пробіг 97 648 миль', img: '1795186674%2F17951865584816654197298999413266.jpg_5207508' },
  { item: '556856', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E16K', original: '2015 Iveco Eurocargo 75e16k Tipper S-A', year: 2015, miles: 93782, specs: '7,5 т, від міської ради (NEPO), пробіг 93 782 км', img: '1795176149%2F17951760599227446741065223025295.jpg_5275270' },
  { item: '556857', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E16K', original: '2015 Iveco Eurocargo 75e16k Tipper S-A', year: 2015, miles: 71748, specs: '7,5 т, від міської ради (NEPO), пробіг 71 748 км', img: '1795176270%2F17951761752722765899307834221276.jpg_5364191' },
  { item: '555454', cat: 'trucks', title: 'Самоскид Iveco Daily 65C17', original: '2015 Iveco Daily 65c17 Tipper', year: 2015, miles: 90186, specs: '6,5 т, від міської ради (NEPO), пробіг 90 186 км', img: 'asset-487986%2F17954402129775744406035633247641.jpg_5241812' },
  { item: '556253', cat: 'trucks', title: 'Самоскид Iveco Daily 65C17', original: '2015 Iveco Daily 65c17 Tipper', year: 2015, miles: 73911, specs: '6,5 т, від міської ради (NEPO), пробіг 73 911 км', img: '1795165458%2F17951653658394935323549401032667.jpg_5804296' },
  { item: '557709', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 2630L', original: '2018 Mercedes Econic 2630l RCV', year: 2018, miles: 65602, specs: '26 т, пробіг 65 602 км', img: '1791977634%2F17919775403692769305479554667087.jpg_6127362' },
  { item: '557711', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 2630L 6x2', original: '2018 Mercedes Econic 2630l 6X2 RCV', year: 2018, miles: 61200, specs: '26 т, пробіг 61 200 км', img: '1788353572%2F17883534739302411112578984427642.jpg_5771574' },
  { item: '557707', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 2630L 6x2', original: '2017 Mercedes Econic 2630l RCV 6X2', year: 2017, miles: 81437, specs: '26 т, пробіг 81 437 км', img: '1788358591%2F17883584950212258637445843118684.jpg_6246071' },
  { item: '557708', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 2630L', original: '2017 Mercedes Econic 2630l RCV', year: 2017, miles: 78128, specs: '26 т, пробіг 78 128 км', img: '1791975681%2F17919755537571429341737388453590.jpg_18112555' },
  { item: '557712', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 2630L 6x2', original: '2017 Mercedes Econic 2630l 6X2 RCV', year: 2017, miles: 68274, specs: '26 т, пробіг 68 274 км', img: '1788354931%2F17883548048383852056682348200116.jpg_6372538' },
  { item: '555178', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 1830L', original: '2017 Mercedes Econic 1830l Refuse Disposal', year: 2017, miles: km(166827), specs: '18 т, пробіг 166 827 миль, стоїть у Лондоні', img: 'asset-488634%2F20261119_112347401_iOS.jpg_5410270', location: 'Лондон, Англія' },
  { item: '555181', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 1830L', original: '2016 Mercedes Econic 1830l Refuse Disposal', year: 2016, miles: km(143435), specs: '18 т, пробіг 143 435 миль, стоїть у Лондоні', img: 'asset-488639%2F20261119_112848372_iOS.jpg_4243252', location: 'Лондон, Англія' },
];

// ---------- Malcolm Harrison, Прис, 12 грудня (лоти ще без номерів) ----------
const MH_PLACE = 'Прис, Шропшир, Англія';
const MH_HOST = 'https://auctions.malcolmharrison.co.uk';

// path: 'каталог/лот'; img: шлях у /images/lot/ без суфікса розміру
const MH: Raw[] = [
  // Ring 1: Plant & Agricultural (каталог 448)
  { item: '81090', path: '448', cat: 'excavators', title: 'Бульдозер Komatsu D65PX-18', original: '2021 Komatsu D65PX-18 Dozer', year: 2021, hours: 7074, specs: 'болотний (PX), задня камера', img: '6104/610441' },
  { item: '92610', path: '448', cat: 'excavators', title: 'Фронтальний навантажувач Hitachi ZW220-7', original: '2022 Hitachi ZW220-7 Wheeled Loader', year: 2022, hours: 7494, specs: 'ківш 9 футів, автозмащення, кондиціонер, камера', img: '6162/616247' },
  { item: '93857', path: '448', cat: 'excavators', title: 'Гусеничний екскаватор New Holland E265C, 26 т', original: '2012 New Holland E265C Excavator', year: 2012, hours: 6489, specs: 'швидкозмінна каретка Geith, 4 доп. гідролінії, ківш, кондиціонер, камера', img: '6275/627536' },
  { item: '93922', path: '448', cat: 'excavators', title: 'Гусеничний екскаватор Komatsu PC228USLC-8, 22 т', original: '2013 Komatsu PC228USLC-8 Excavator', year: 2013, hours: 10451, specs: 'мале заднє звисання, 5 доп. гідроліній, каретка Geith, кондиціонер', img: '6286/628629' },
  { item: '89535', path: '448', cat: 'excavators', title: 'Екскаватор Kubota KX080-4, 8 т', original: '2018 Kubota KX080-4 Excavator', year: 2018, hours: 6109, specs: 'гумові гусениці, відвал, 4 доп. гідролінії, автокаретка Geith, кондиціонер', img: '5923/592324' },
  { item: '89536', path: '448', cat: 'excavators', title: 'Екскаватор Kubota KX080-4, 8 т', original: '2018 Kubota KX080-4 Excavator', year: 2018, hours: 6041, specs: 'гумові гусениці, відвал, 4 доп. гідролінії, автокаретка Geith', img: '5926/592699' },
  { item: '89539', path: '448', cat: 'excavators', title: 'Міні-екскаватор Kubota U48-4, 4,8 т', original: '2019 Kubota U48-4 Excavator', year: 2019, hours: 4418, specs: 'гумові гусениці, відвал, 2 доп. гідролінії, автокаретка Geith', img: '5958/595888' },
  { item: '92725', path: '448', cat: 'excavators', title: 'Міні-екскаватор Kubota KX015-4, 1,5 т', original: '2020 Kubota KX015-4 Mini Excavator', year: 2020, hours: 2961, specs: 'гумові гусениці, відвал, 2 доп. гідролінії, ківш для канав', img: '6185/618545' },
  { item: '92798', path: '448', cat: 'excavators', title: 'Міні-екскаватор EPC NM-E12, 1 т, новий', original: '2026 EPC NM-E12 1ton Mini Excavator', year: 2026, hours: 3, specs: 'новий, 3 мотогодини, відвал, ківш', img: '6193/619320', unused: true },
  { item: '92788', path: '448', cat: 'excavators', title: 'Колісний перевантажувач Terex TWH220', original: '2017 Terex TWH220 Wheeled Material Handler', year: 2017, hours: 7500, specs: 'для металобрухту й відходів', img: '6192/619211' },
  { item: '87523', path: '448', cat: 'excavators', title: 'Міні-навантажувач Komatsu SK714-5', original: '2016 Komatsu SK714-5 Skid Steer', year: 2016, hours: null, specs: 'двигун Yanmar, суцільні шини, доп. гідролінії', img: '5777/577711' },
  { item: '92812', path: '448', cat: 'excavators', title: 'Думпер Mecalac TA6s з поворотним кузовом, 6 т', original: '2022 Mecalac TA6s Swivel Dumper', year: 2022, hours: null, specs: 'каркас ROPS, камера', img: '6197/619730' },
  { item: '92813', path: '448', cat: 'excavators', title: 'Думпер Mecalac TA6s з поворотним кузовом, 6 т', original: '2022 Mecalac TA6s Swivel Tip Dumper', year: 2022, hours: 766, specs: 'каркас ROPS, камера, немає ключа', img: '6197/619751' },
  { item: '92371', path: '448', cat: 'excavators', title: 'Думпер JCB 6TST з поворотним кузовом, 6 т', original: '2018 JCB 6TST 6ton Swivel Dumper', year: 2018, hours: 1742, specs: 'каркас ROPS, датчики спереду', img: '6178/617834' },
  { item: '92372', path: '448', cat: 'excavators', title: 'Думпер JCB 6TST з поворотним кузовом, 6 т', original: '2018 JCB 6TST 6ton Swivel Dumper', year: 2018, hours: 1913, specs: 'каркас ROPS, камера спереду', img: '6191/619188' },
  { item: '92401', path: '448', cat: 'excavators', title: 'Каток CAT CB1.7', original: '2022 CAT CB1.7 Roller', year: 2022, hours: 250, specs: 'тандемний, 250 мотогодин', img: '6163/616387' },
  { item: '93843', path: '448', cat: 'excavators', title: 'Ґрунтовий каток JCB VM137', original: 'JCB VM137 Single Drum Compactor Roller', year: null, hours: 36410, specs: 'одновальцевий, 13 т', img: '6273/627370' },
  { item: '90064', path: '448', cat: 'agro', title: 'Трактор Massey Ferguson 135', original: 'Massey Ferguson 135 Tractor', year: null, hours: 1505, specs: 'класичний, задня навіска', img: '5964/596452' },
  // Ring 2: Truck & Trailer (каталог 449)
  { item: '90268', path: '449', cat: 'trucks', title: 'Тягач Volvo FH 540 6x2', original: '2023 Volvo FH540 6x2 Mini Midlift Tractor Unit', year: 2023, miles: 220510, specs: 'автомат, гідравліка для причепа, пробіг 220 510 км', img: '6269/626929' },
  { item: '91534', path: '449', cat: 'trucks', title: 'Тягач DAF XF 480 6x2', original: '2020 DAF XF 480 Midlift Tractor Unit', year: 2020, miles: 482619, specs: 'автомат, спальник на 2 місця, пробіг 482 619 км', img: '6108/610804' },
  { item: '86163', path: '449', cat: 'trucks', title: 'Тягач Scania R580 V8 6x2', original: '2016 Scania R580 V8 6x2 Mini Midlift Tractor Unit', year: 2016, miles: 695938, specs: 'Opticruise, пробіг 695 938 км', img: '5714/571459' },
  { item: '93909', path: '449', cat: 'trucks', title: 'Гаковий мультиліфт Scania P410 8x4', original: '2018 Scania P410 8x4 Hook Loader', year: 2018, miles: 406843, specs: 'обладнання Boughton, пробіг 406 843 км', img: '6284/628421' },
  { item: '93910', path: '449', cat: 'trucks', title: 'Гаковий мультиліфт Scania P410 8x4', original: '2018 Scania P410 8x4 Hook Loader', year: 2018, miles: 425696, specs: 'обладнання Boughton, пробіг 425 696 км', img: '6284/628451' },
  { item: '92649', path: '449', cat: 'trucks', title: 'Гаковий мультиліфт Renault Premium 8x4', original: '2012 Renault Premium L 24WPA8 8x4 Rear Lift Hook Loader', year: 2012, miles: 395494, specs: 'Hiab Multilift XR26S, автомат, пробіг 395 494 км', img: '6174/617466' },
  { item: '93027', path: '449', cat: 'trucks', title: 'Рефрижератор DAF CF 330 6x4', original: '2017 DAF CF 330 6x4 Fridge Body Rigid', year: 2017, miles: 618504, specs: 'холодильна установка Carrier, гідроборт, пробіг 618 504 км', img: '6210/621050' },
  { item: '92830', path: '449', cat: 'trucks', title: 'Бортова вантажівка Mercedes-Benz Econic 2629 6x2', original: '2012 Mercedes Econic 2629 6x2 Mid Steer Dropside Rigid', year: 2012, miles: 138713, specs: 'гідроборт, пробіг 138 713 км', img: '6199/619975' },
  { item: '85782', path: '449', cat: 'trucks', title: 'Скіповоз Volvo FL250 з телескопічними стрілами', original: '2018 Volvo FL250 4x2 Telescopic Skip Loader', year: 2018, miles: 184927, specs: 'Multilift, пробіг 184 927 км, сервісна історія Volvo', img: '5671/567191' },
  { item: '90186', path: '449', cat: 'trucks', title: 'Скіповоз Mercedes-Benz Atego 1223 з телескопічними стрілами', original: '2020 Mercedes Atego 1223 4x2 Telescopic Skip Loader', year: 2020, miles: 336260, specs: 'обладнання VDL 2018, пробіг 336 260 км', img: '5957/595787' },
  { item: '87588', path: '449', cat: 'trucks', title: 'Скіповоз DAF LF 250 з телескопічними стрілами', original: '2016 DAF LF 250 4x2 Telescopic Skip Loader', year: 2016, miles: 537769, specs: 'обладнання VDL, пробіг 537 769 км', img: '5840/584035' },
  { item: '93056', path: '449', cat: 'trucks', title: 'Скіповоз DAF LF 45.160 з телескопічними стрілами', original: '2012 DAF LF 45.160 4x2 Telescopic Skip Loader', year: 2012, miles: 787826, specs: 'механіка, пробіг 787 826 км', img: '6224/622438' },
  { item: '92699', path: '449', cat: 'trucks', title: 'Скіповоз DAF LF45 150', original: '2005 DAF LF45 150 4x2 Skip Loader', year: 2005, miles: 549520, specs: 'механіка, пробіг 549 520 км', img: '6194/619472' },
  { item: '92018', path: '449', cat: 'trucks', title: 'Скіповоз Mitsubishi Fuso Canter', original: '2013 Mitsubishi Fuso Canter 4x2 Skip Loader', year: 2013, miles: km(179872), specs: 'обладнання Trio, пробіг 179 872 милі', img: '6125/612511' },
  { item: '88301', path: '449', cat: 'trucks', title: 'Вакуумна машина DAF LF45', original: '2013 DAF FA LF45 4x2 Mini Vacuum Tanker', year: 2013, miles: 280427, specs: 'вакуумне обладнання Rapide, пробіг 280 427 км', img: '5834/583435' },
  { item: '88245', path: '449', cat: 'trucks', title: 'Бортова вантажівка MAN TGL 10.180, 7,5 т', original: '2018 MAN TGA 10.180 7.5 ton 7m 4x2 Flat Rigid', year: 2018, miles: 842107, specs: 'платформа 7 м, автомат, пробіг 842 107 км', img: '5852/585234' },
  { item: '88249', path: '449', cat: 'trucks', title: 'Бортова вантажівка MAN TGL 10.180, 7,5 т', original: '2018 MAN TGA 10.180 7.5 ton 7m 4x2 Flat Rigid', year: 2018, miles: 740918, specs: 'платформа 7 м, автомат, пробіг 740 918 км', img: '5843/584345' },
  { item: '88374', path: '449', cat: 'trucks', title: 'Бортова вантажівка Renault D Wide', original: '2015 Renault D Wide 4x2 Flat Bed Rigid', year: 2015, miles: 296013, specs: 'платформа, автомат, пробіг 296 013 км', img: '5838/583808' },
  { item: '92017', path: '449', cat: 'trucks', title: 'Самоскид Iveco Eurocargo 75E', original: '2013 Iveco 75E 4x2 Dropside Tipper', year: 2013, miles: null, specs: 'бортовий самоскид, автомат, фаркоп', img: '6124/612485' },
  { item: '93948', path: '449', cat: 'trucks', title: 'Міні-мультиліфт Ford Transit', original: '2016 Ford Transit 4x2 Mini Hook Loader', year: 2016, miles: km(111582), specs: 'гаковий підйомник MHF, пробіг 111 582 милі', img: '6290/629022' },
  { item: '91885', path: '449', cat: 'trucks', title: 'Евакуатор техніки DAF LF45 150 з бобровим хвостом', original: '2003 DAF LF45 150 4x2 Beavertail Rigid', year: 2003, miles: 408186, specs: 'алюмінієві трапи, лебідка, пробіг 408 186 км', img: '6117/611728' },
  { item: '92020', path: '449', cat: 'trucks', title: 'Евакуатор Renault Midlum з платформою', original: '2006 Renault 42AEA10 4x2 Flat Bed Rigid', year: 2006, miles: 188005, specs: 'лебідка, трапи, пробіг 188 005 км', img: '6125/612547' },
  { item: '93893', path: '449', cat: 'pickups', title: 'Пікап Ford Ranger Wildtrak 4x4', original: '2021 Ford Ranger 4x4', year: 2021, miles: km(80295), specs: 'автомат, Wildtrak, пробіг 80 295 миль', img: '6280/628037' },
];

const slug = (s: string) => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Morris Leslie, Еррол, 9 грудня ----------
const ML_PLACE = 'Еррол, Шотландія';
const ML_IMG = 'https://9ox6dfzqd6.execute-api.eu-west-1.amazonaws.com/prod/buckets/morrisleslie-production-s3-public/keys/motorvehicle/';

const ML: Raw[] = [
  { lot: '1500', item: 'gp4ubgq9e8lho4ftqq0lfevpt', cat: 'excavators', title: 'Фронтальний навантажувач JCB 457 HT', original: '2016 JCB 457 HT T4F Wheeled Loader', year: 2016, hours: 4614, specs: 'від міської ради, мотогодини не гарантовані', img: '11695/images/resized/1794825263_Xc51uO' },
  { lot: '1501', item: 'sawiyrj3vwtc78ic1utkhqctr', cat: 'excavators', title: 'Думпер Terex TA9, 9 т', original: '2015 Terex TA9 Dumper', year: 2015, hours: null, specs: 'від компанії', img: '11777/images/resized/1795083175_UUq23u' },
  { lot: '1502', item: 'tidr0p70pdjvq5ckcsmhj4eum', cat: 'excavators', title: 'Думпер Wacker Neuson 9001, 9 т', original: '2015 Wacker Neuson 9001 Dumper', year: 2015, hours: null, specs: 'від компанії', img: '11778/images/resized/1795082144_nOQG92' },
  { lot: '1503', item: 'eyqxqvzj5ewxclubvqfp7ce0d', cat: 'excavators', title: 'Думпер Thwaites 3 т з поворотним кузовом', original: '2005 Thwaites 3T Hi-Swivel Dumper', year: 2005, hours: null, specs: 'високе вивантаження', img: '10265/resized/1788363583_zp82n0' },
  { lot: '1506', item: 'kbla7ucq62dh4xdmwdt88ghhe', cat: 'excavators', title: 'Думпер Terex PT3000, 3 т', original: 'Terex PT3000 3 Ton Dumper', year: null, hours: 2585, specs: 'від прокатної компанії', img: '11276/resized/1792673505_iFZpUS' },
  { item: 'odho37udz4aghscqytuhc0cch', cat: 'excavators', title: 'Пневмоколісний каток Bomag', original: '2011 Bomag Pneumatic Tyred Roller', year: 2011, hours: null, specs: 'від міської ради', img: '11776/images/resized/1795441447_GZoDCe' },
  { lot: '1602', item: 'uxfur6mkposrwzqxiryelicts', cat: 'trucks', title: 'Піскорозкидач Mercedes-Benz Arocs 3333 6x4', original: '2016 Mercedes-Benz Arocs 3333 6x4 Gritter', year: 2016, miles: null, specs: 'кріплення під снігоочисний відвал, від міської ради', img: '11831/images/resized/1795181055_m4hHTU' },
  { lot: '1601', item: 'f49bvvhb6drfsa2cgt8f8c5q4', cat: 'trucks', title: 'Самоскид MAN TGM з маніпулятором', original: '2018 MAN TG-M Tipper with Crane', year: 2018, miles: 118864, specs: 'кріплення під відвал, від міської ради, пробіг 118 864 км', img: '11709/images/resized/1794828849_RAXBKO' },
  { lot: '1631', item: 'grt7zzmgfwzfuibemqns2cjyy', cat: 'trucks', title: 'Піскорозкидач Volvo FE 6x2', original: '2019 Volvo FE Gritter', year: 2019, miles: 148489, specs: 'кузов Cuthbertson, від міської ради, пробіг 148 489 км', img: '6739/images/resized/1773914165_DMQ5ru' },
  { lot: '1600', item: 'bnslfsypmywggnpejg94xomvi', cat: 'trucks', title: 'Машина для ямкового ремонту DAF LF', original: '2016 DAF LF Road Repair Truck', year: 2016, miles: 67336, specs: 'бункер для асфальту, від міської ради, пробіг 67 336 км', img: '11701/images/resized/1794827619_scUp5j' },
  { item: 'laoarlu3hstug2wqsei0qvrot', cat: 'trucks', title: 'Сміттєвоз Mercedes-Benz Econic 6x2', original: '2019 Mercedes-Benz Econic Refuse Truck', year: 2019, miles: null, specs: 'від міської ради', img: '11771/images/resized/1795440556_pKxnJD' },
  { lot: '1610', item: 'skfkmgrh2bnmov2yqnzvq7srf', cat: 'trucks', title: 'Вантажівка Mercedes-Benz Atego', original: '2020 Mercedes-Benz Atego', year: 2020, miles: 162415, specs: 'від держустанови, пробіг 162 415 км', img: '10287/images/resized/1788944367_x7UMFO' },
  { lot: '1606', item: 'im0bw6geow2miotavudluwgnj', cat: 'trucks', title: 'Фургон-вантажівка Mercedes-Benz Atego', original: '2015 Mercedes-Benz Atego Box Body', year: 2015, miles: 306718, specs: 'промтоварний кузов, від міської ради, пробіг 306 718 км', img: '9270/images/resized/1783414172_aWv6of' },
  { lot: '1615', item: 'uushklxq5qp2omt6hxdsy4ciz', cat: 'trucks', title: 'Сміттєвоз Iveco Daily 70C18', original: '2019 Iveco Daily 70C18 Auto Refuse Truck', year: 2019, miles: 188888, specs: '7 т, автомат, від міської ради, пробіг 188 888 км', img: '9406/images/resized/1784195242_TcfxRt' },
];

const base = (r: Raw) => ({
  item: r.item,
  title: r.title,
  original: r.original,
  category: r.cat,
  year: r.year,
  hours: r.hours ?? null,
  miles: r.miles ?? null,
  specs: r.specs,
  unused: !!r.unused,
  inoperable: false,
  live: true,
});

export const DEC_UK_LOTS: AuctionLot[] = [
  ...WILSONS.map((r) => ({
    ...base(r),
    auction: 'wilsons-newcastle-dec',
    lot: r.lot ?? '',
    location: r.location ?? W_PLACE,
    endsAt: Date.UTC(2026, 11, 9, 10, 0),
    img: `${W_IMG}${r.img}/1000x800.jpeg`,
    url: W_BASE + r.item,
  })),
  ...MH.map((r) => ({
    ...base(r),
    auction: 'mh-prees-dec',
    lot: r.lot ?? '',
    location: r.location ?? MH_PLACE,
    endsAt: Date.UTC(2026, 11, 12, 10, 0),
    img: `${MH_HOST}/images/lot/${r.img}_9.jpg`,
    url: `${MH_HOST}/lot-details/index/catalog/${r.path}/lot/${r.item}/${slug(r.original)}`,
  })),
  ...ML.map((r) => ({
    ...base(r),
    auction: 'ml-errol-dec',
    lot: r.lot ?? '',
    location: r.location ?? ML_PLACE,
    endsAt: Date.UTC(2026, 11, 9, 10, 0),
    img: `${ML_IMG}${r.img}---1024-768-crop.jpg`,
    url: `https://auction.morrisleslie.com/vehicle/${r.item}`,
  })),
];
