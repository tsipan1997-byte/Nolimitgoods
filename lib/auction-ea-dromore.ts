// Лоти з аукціону Euro Auctions у Дроморі (Північна Ірландія, Велика Британія), 11–12 грудня 2026.
// Зібрано 23.11.2026 з каталогу аукціону (2101 позиція): лише техніка з фото під попит в Україні —
// екскаватори, навантажувачі, думпери, катки, телескопічні навантажувачі, трактори, пікапи, вантажівки.
// Номери лотів аукціон ще не присвоїв, тому lot порожній, а item — ID позиції на сайті.
// Живі торги: заявку з лімітом треба дати напередодні. Ставки тут не зберігаються.

import type { AuctionInfo, AuctionLot } from './auction-lots';

const AUCTION = 'ea-dromore-dec';
const DAY1 = Date.UTC(2026, 11, 11, 10, 0); // 11.12.2026, 10:00 за Лондоном
const DAY2 = Date.UTC(2026, 11, 12, 10, 0); // 12.12.2026, 10:00 за Лондоном
const IMG = 'https://images.euroauctionslive.com/auction-1059/';
const BASE = 'https://www.euroauctions.com/en/equipment-search/product/';

export const EA_DROMORE_AUCTION: AuctionInfo = {
  id: AUCTION,
  house: 'Euro Auctions',
  name: 'Dromore - 11th & 12th December 2026',
  place: 'Дромор, Північна Ірландія',
  dates: '11–12 грудня 2026',
  format: 'Живі торги + онлайн-ставки',
  totalLots: 2101,
  unreserved: true,
  url: 'https://www.euroauctions.com/en/auctions/dromore-11th-12th-december-2026',
};

type Raw = {
  item: string; day: 1 | 2; cat: AuctionLot['category']; path: string; title: string; original: string;
  year: number | null; hours?: number | null; km?: number | null; specs: string; img: string;
  unused?: boolean; inoperable?: boolean;
};

const EX = 'excavators/';
const MINI = 'excavators/mini-excavators';
const MICRO = 'excavators/micro-excavators';
const TELE = 'telescopic-handlers/telehandlers';
const TRAC = 'tractors/tractors';
const CTRAC = 'tractors/compact-tractors';
const PICK = 'commercial-vehicles/pick-up-trucks';
const TIP = 'commercial-vehicles/tipper-trucks';
const CV = 'commercial-vehicles/';

const RAW: Raw[] = [
  // Гусеничні та колісні екскаватори
  { item: '140510935', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX350H-7, 35 т, новий', original: 'Unused 2025 Hitachi ZX350H-7', year: 2025, hours: 28, specs: 'не використовувався, башмаки 600 мм, швидкозмінник, гідролінія, 3 камери, кондиціонер', img: '3596d3d3adb242008e7d6b344a2bb0eb', unused: true },
  { item: '100355425', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX120-7, 12 т', original: '2023 Hitachi ZX120-7', year: 2023, hours: 75, specs: 'болотні башмаки 1200 мм, швидкозмінник, дод. гідролінія, 3 камери, кондиціонер', img: '89bbea3098994d41b5e2885f4d6dac18' },
  { item: '100383523', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX130LCN-7, 13 т', original: '2022 Hitachi ZX130LCN-7', year: 2022, specs: 'гумові накладки 700 мм, відвал, швидкозмінник, гідролінія, 3 камери, кондиціонер', img: 'a10faadf72b641aebc27813f40f3af03' },
  { item: '100380624', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Doosan DX235LCR-5, 23 т', original: '2019 Doosan DX235LCR-5', year: 2019, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камера заднього виду, кондиціонер', img: '5ab29144620f4ba99e21f8a9a37c898c' },
  { item: '100371965', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор CAT 308CR, 8 т', original: '2021 CAT 308CR', year: 2021, specs: 'башмаки 450 мм, відвал, швидкозмінник, гідролінія, камера, кондиціонер', img: 'a8aaf931beac40e797b77b089b0323e3' },
  { item: '100381836', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор CAT 313 GC, 13 т', original: '2021 CAT 313 GC', year: 2021, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камери, кондиціонер', img: '6089c629aacc4db88fb2f05d0dcb9b2e' },
  { item: '100383706', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Kobelco SK210LC-10, 21 т', original: '2019 Kobelco SK210LC-10', year: 2019, specs: 'болотні башмаки 1200 мм, швидкозмінник, дод. гідролінія, камери, кондиціонер', img: '9c26faa410374b218b8e889fa9ab8d0e' },
  { item: '100374597', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Sany SY70C, 7 т', original: '2026 Sany SY70C', year: 2026, hours: 51, specs: 'башмаки 600 мм, відвал, швидкозмінник, гідролінія, кондиціонер', img: '6a1546b40162410999efe97162362dc2' },
  { item: '100380874', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX135US-6, 13 т', original: '2017 Hitachi ZX135 US-6', year: 2017, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камера, кондиціонер', img: '150aee08abe44cd3bb97fcacf5ccf2ff' },
  { item: '100366574', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX70-3, 7 т', original: 'Hitachi ZX70-3', year: null, specs: 'башмаки 600 мм, швидкозмінник, камера, кондиціонер', img: '892dcc6a21524f4c8dfaf349d8e17a21' },
  { item: '100372350', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор LiuGong 9075F, 7,5 т', original: '2026 LiuGong 9075F', year: 2026, hours: 50, specs: 'башмаки 600 мм, відвал, швидкозмінник, гідролінія, кондиціонер', img: '6ca09993b365433795d172b62412fd14' },
  { item: '100384408', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор Case CX130D, 13 т', original: '2016 Case CX130D', year: 2016, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камера, кондиціонер', img: '5d2d88ccc0d24676b6c2d7d91cbac881' },
  { item: '100381837', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор Komatsu PC138US-10, 14 т', original: '2016 Komatsu PC138US-10', year: 2016, specs: 'башмаки 700 мм, швидкозмінник, дод. гідролінія, камера, кондиціонер', img: '71ccfe0f3aa34327b97668193970a17d' },
  { item: '100384200', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Komatsu PC210LC-8, 21 т', original: '2012 Komatsu PC210LC-8', year: 2012, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камера, кондиціонер', img: '078a38a62b844852ae37d54b4ab23431' },
  { item: '100378888', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор LiuGong 906F, 6 т, новий', original: 'Unused 2026 LiuGong 906FG4', year: 2026, specs: 'не використовувався, башмаки 400 мм, відвал, швидкозмінник, гідролінія, кондиціонер', img: '8faf1f2bdfc04be0a39908bfb364ec89', unused: true },
  { item: '100383570', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Volvo EC210BLC, 21 т', original: 'Volvo EC210BLC', year: null, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, кондиціонер', img: '37ea1f4a63b34fbdae655f99f8002a69' },
  { item: '100384362', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX70-5A, 7 т', original: 'Hitachi ZX70-5A', year: null, hours: 910, specs: 'башмаки 450 мм, відвал, швидкозмінник, гідролінія, камера, кондиціонер, 2 ковші', img: '2e65d7ad48484a938ae5899b355e3681' },
  { item: '100380599', day: 2, cat: 'excavators', path: EX + '10-ton-excavators', title: 'Гусеничний екскаватор CAT 312CL, 12 т', original: 'CAT 312CL', year: null, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, кондиціонер', img: '1f54a441e3ff4acf88398afcbed26ce4' },
  { item: '100382298', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор XCMG XE60DA, 6 т', original: 'XCMG XE60DA', year: null, hours: 225, specs: 'башмаки 400 мм, відвал', img: '685b504ae38b4ee9888c988f77e9f00d' },
  { item: '100382300', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Takeuchi TB160C, 6 т', original: 'Takeuchi TB160C', year: null, specs: 'башмаки 400 мм, відвал, кондиціонер', img: '0c0312f6d3dd4b0cbfbf89474036db8f' },
  { item: '100382306', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор IHI 60NS, 6 т', original: 'IHI 60NS', year: null, specs: 'башмаки 400 мм, відвал, гідролінія', img: 'ff4bdcc347ef44da9426cdeaa9c9c786' },
  { item: '100382309', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Doosan DH55-V, 5,5 т', original: 'Doosan DH55-V', year: null, specs: 'башмаки 400 мм, відвал, швидкозмінник, гідролінія', img: '04906aaeee3347efa513ba7791d7ae24' },
  { item: '100384194', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Doosan DH55-V, 5,5 т', original: 'Doosan DH55-V', year: null, specs: 'башмаки 400 мм, відвал, гідролінія', img: '15f99e625a5541c4925dc0a92d268545' },
  { item: '100382248', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Takeuchi TB150C, 5 т', original: 'Taketuchi TB150C', year: null, specs: 'башмаки 400 мм, відвал, гідролінія', img: 'd4190cc656084c519dc64a7bd3d29226' },
  { item: '100380628', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Doosan DX85R-3, 8,5 т', original: '2014 Doosan DX85R-3', year: 2014, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, дод. гідролінія, кондиціонер', img: '2878361e3bf6488082c3ee7303da5dbc' },
  { item: '100384197', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Doosan DX300LC, 30 т', original: 'Doosan DX300LC', year: null, specs: 'башмаки 600 мм, швидкозмінник, гідролінія, камера, кондиціонер', img: '81686a9afb5c487f9ca27932217e41fb' },
  { item: '100383505', day: 2, cat: 'excavators', path: EX + 'wheeled-excavators', title: 'Колісний екскаватор Komatsu PW140-7, 14 т', original: '2011 Komatsu PW140-7', year: 2011, specs: 'відвал, аутригери, швидкозмінник, гідролінія, кондиціонер', img: '64f3ed6df09c48f68360d1bedc8da739' },
  { item: '100381020', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Hyundai HX235LCR, 23 т', original: '2017 Hyundai HX235LCR', year: 2017, specs: 'башмаки 700 мм, швидкозмінник, дод. гідролінія, камера, кондиціонер', img: '7c03c66347a74cac8a408e8130d98ad5' },
  { item: '100380936', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX470LCH-5B, 47 т', original: '2014 Hitachi ZX470LCH-5B', year: 2014, specs: 'башмаки 700 мм, швидкозмінник, дод. гідролінія, захист кабіни, камера, кондиціонер', img: '5962c1b150cd47e6a14a872e77d22536' },
  { item: '100382364', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Volvo ECR88D, 9 т', original: '2018 Volvo ECR88D', year: 2018, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, дод. гідролінія, кондиціонер', img: 'b6b7560d8cbe40a39d3112fbf66195d9' },
  { item: '100383034', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Kobelco SK85MSR-7, 8,5 т', original: '2020 Kobelco SK85MSR-7', year: 2020, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, кондиціонер', img: '47ed01d1cfda4bfe93671fb164d7d229' },
  { item: '100380450', day: 2, cat: 'excavators', path: EX + '20-ton-excavators', title: 'Гусеничний екскаватор Hitachi ZX210LC-6, 21 т', original: '2019 Hitachi ZX210LC-6', year: 2019, specs: 'башмаки 700 мм, швидкозмінник, гідролінія, камера, кондиціонер', img: '0eb6301d2dde470da46c5e963327b7b9' },
  { item: '100380694', day: 2, cat: 'excavators', path: EX + '6-ton-excavators', title: 'Гусеничний екскаватор Yanmar Vi075-A, 7,5 т', original: 'Yanmar Vi075-A', year: null, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія', img: '197f75b917084788890616df4a5fe475' },

  // Міні- та мікроекскаватори
  { item: '140516961', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Hitachi ZX26U-6, 2,6 т', original: '2025 Hitachi ZX26U-6 CLR', year: 2025, hours: 257, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, 2 ковші', img: '035a8c9ed0eb4dc096b8150c4118fe51' },
  { item: '100383628', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Hitachi ZX33U-6, 3,3 т', original: '2023 Hitachi ZX33U-6 CLR', year: 2023, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, кондиціонер', img: '25794eb4b5c0493fa467035daaae4a0a' },
  { item: '100371999', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Sany SY35U, 3,5 т, новий', original: 'Unused 2025 Sany SY35U', year: 2025, hours: 5, specs: 'не використовувався, відвал, зміщення стріли, швидкозмінник, дод. гідролінія, кондиціонер', img: '9cd1c8fcf626481598fc16c0da45a966', unused: true },
  { item: '100372483', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор LiuGong 9027F, 2,7 т', original: '2026 LiuGong 9027FZTS', year: 2026, hours: 50, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, кондиціонер', img: '21c0cf61b0514411b9d1600c4492f701' },
  { item: '100374674', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Sany SY26U, 2,6 т', original: '2026 Sany SY26U', year: 2026, hours: 50, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, кондиціонер', img: '6dcc212c759142a280fe85490c4c0971' },
  { item: '100378885', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор LiuGong 9035F, 3,5 т, новий', original: 'Unused 2026 LiuGong 9035FZTSG4', year: 2026, specs: 'не використовувався, відвал, зміщення стріли, швидкозмінник, гідролінія, кондиціонер', img: '0237885657444caf89ecd40bbd386540', unused: true },
  { item: '100384347', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Hitachi ZX26U-5A, 2,6 т', original: '2016 Hitachi ZX26U-5A CR', year: 2016, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія', img: '83141b9b583145b99aa103a68d23b556' },
  { item: '100368275', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор LiuGong 9017F, 1,7 т', original: '2026 LiuGong 9017FZTS', year: 2026, hours: 50, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, розсувна ходова', img: '901e01acf2d0424ba0d1abcfeb368823' },
  { item: '100382066', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор JCB 16C-1, 1,6 т', original: '2022 JCB 16C-1 T3', year: 2022, hours: 897, specs: 'гумові гусениці, відвал, зміщення стріли, гідролінія, розсувна ходова, 3 ковші', img: 'e14fa926e6ff40b88890e18722c549a9' },
  { item: '100382546', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор JCB 16C-1, 1,6 т', original: '2022 JCB 16C-1', year: 2022, hours: 925, specs: 'гумові гусениці, відвал, зміщення стріли, гідролінія, розсувна ходова', img: 'a34af20a3e084b32890432d96d1e3241' },
  { item: '100382540', day: 2, cat: 'excavators', path: MICRO, title: 'Мікроекскаватор JCB 8008 CTS, 0,8 т', original: '2022 JCB 8008 CTS', year: 2022, hours: 878, specs: 'гумові гусениці, відвал, зміщення стріли, гідролінія, розсувна ходова', img: '10e9e2379bfd4025b93fadc7afb4092d' },
  { item: '100382563', day: 2, cat: 'excavators', path: MICRO, title: 'Мікроекскаватор JCB 8008 CT, 0,8 т', original: '2022 JCB 8008 CT', year: 2022, hours: 359, specs: 'гумові гусениці, відвал, зміщення стріли, гідролінія, розсувна ходова', img: '36a99e62477f4c8893445932cd371e13' },
  { item: '100373008', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Hitachi ZX17U-5A, 1,7 т', original: '2022 Hitachi ZX17U-5A', year: 2022, specs: 'гумові гусениці, відвал, зміщення стріли, розсувна ходова', img: '331dc8b898c743479dac3c8c009856bb' },
  { item: '100384349', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Kubota KX016-4, 1,6 т', original: '2020 Kubota KX016-4', year: 2020, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, розсувна ходова', img: 'a09423f262834285b6fdc9e23b0dc0d0' },
  { item: '100383725', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Komatsu PC27MR-2, 2,7 т', original: 'Komatsu PC27MR-2', year: null, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, 2 ковші, грейфер', img: '4fd6ad60d53841049593ae45b8314dbe' },
  { item: '100381687', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Hitachi ZX26U-6, 2,6 т', original: '2020 Hitachi ZX26U-6 CLR', year: 2020, specs: 'гумові гусениці, відвал, зміщення стріли, швидкозмінник, гідролінія, 3 ковші', img: '9165849279ee489e8268d474110fd81a' },
  { item: '100374577', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Takeuchi TB025, 2,5 т', original: 'Takeuchi TB025', year: null, specs: 'гумові гусениці, відвал, зміщення стріли', img: 'ef93edf86e344fe494cfbbcd50ec0f97' },
  { item: '100374591', day: 2, cat: 'excavators', path: MINI, title: 'Міні-екскаватор Takeuchi TB120, 2 т', original: 'Takeuchi TB120', year: null, specs: 'гумові гусениці, відвал, зміщення стріли', img: 'b48ec66fe2134f83916bca0906c7b480' },
  { item: '100374537', day: 2, cat: 'excavators', path: MICRO, title: 'Мікроекскаватор WTS ME15, 1,5 т, новий', original: 'Unused 2026 WTS ME15', year: 2026, specs: 'не використовувався, гумові гусениці, відвал, гідролінія, захват-палець', img: 'df1fdcb7fc684fe1b9c81439e7b6a0ca', unused: true },
  { item: '100375039', day: 2, cat: 'excavators', path: MICRO, title: 'Мікроекскаватор ZL12, 1,2 т, новий', original: 'Unused 2026 ZL ZL12', year: 2026, specs: 'не використовувався, гумові гусениці, відвал, гідролінія', img: '39065bcd86914b6990ddf7385af3e7cb', unused: true },
  { item: '100377515', day: 2, cat: 'excavators', path: MICRO, title: 'Мікроекскаватор Captok CK13CD, 1,3 т, новий', original: 'Unused 2026 Captok CK13CD', year: 2026, specs: 'не використовувався, гумові гусениці, відвал, гідролінія, захват-палець', img: 'c5cec90169724666936a5ee30c9201ac', unused: true },

  // Катки
  { item: '100381822', day: 1, cat: 'excavators', path: 'rollers-compactors/rollers', title: 'Ґрунтовий каток Bomag BW213D-5', original: '2016 Bomag BW213D-5', year: 2016, specs: 'одновальцевий вібраційний, закрита кабіна, камера', img: '52133ddf7b5b4bf9b5ed87ea3604cd63' },
  { item: '100383627', day: 1, cat: 'excavators', path: 'rollers-compactors/rollers', title: 'Асфальтовий каток Hamm HD10 C', original: '2023 Hamm HD10 C', year: 2023, hours: 913, specs: 'двовальцевий вібраційний, дуга безпеки', img: '8e168f756274464097d2c816914e53e3' },
  { item: '100382053', day: 1, cat: 'excavators', path: 'rollers-compactors/rollers', title: 'Асфальтовий каток Mecalac TV1200', original: '2019 Mecalac TV1200', year: 2019, specs: 'двовальцевий, дуга безпеки', img: 'cf58bf6d2a8c48ccaafddde905ef0961' },
  { item: '100382262', day: 1, cat: 'excavators', path: 'rollers-compactors/rollers', title: 'Асфальтовий каток Bomag BW90AD-5', original: '2016 Bomag BW90AD-5', year: 2016, specs: 'двовальцевий вібраційний, дуга безпеки', img: '4cd96c962fa34f8f80afecef186e68b3' },

  // Думпери
  { item: '140526524', day: 1, cat: 'excavators', path: 'dumpers/tracked-dumpers', title: 'Гусеничний думпер IHI IC120', original: '2016 IHI IC120', year: 2016, specs: 'кондиціонер', img: 'ed42473e675944c38869bcfafff15003' },
  { item: '140527053', day: 1, cat: 'excavators', path: 'dumpers/tracked-dumpers', title: 'Гусеничний думпер Hitachi EG70R, поворотний кузов', original: 'Hitachi EG70R', year: null, specs: 'закрита кабіна, кондиціонер', img: '45800077b8b541feb08dc7d29ef93905' },
  { item: '100383032', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Thwaites, 9 т', original: '2020 Thwaites 9 Ton', year: 2020, specs: 'дуга безпеки', img: 'ea226017ad8a4b908011a49ee494d7a6' },
  { item: '100382051', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Wacker Neuson DV60, 6 т, поворотний кузов', original: '2019 Wacker Neuson DV60', year: 2019, specs: 'двостороннє керування Dual View, закрита кабіна, камера', img: '793f672ca26f4a78b710d7a9408652ee' },
  { item: '100375263', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Mecalac TA6, 6 т', original: '2022 Mecalac TA6', year: 2022, hours: 918, specs: 'фронтальна камера, дуга безпеки', img: 'c69c4f682ffe4634b8146db245da1bd6' },
  { item: '140563291', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер JCB 1T-2, 1 т, високе розвантаження', original: '2022 JCB 1T-2S5', year: 2022, hours: 541, specs: 'дуга безпеки', img: 'dd190df9b3854090a6183e88b2f47ac2' },
  { item: '100383743', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Thwaites, 3 т, поворотний кузов', original: '2011 Thwaites 3 Ton Swivel Skip', year: 2011, specs: 'дуга безпеки, без реєстраційних документів', img: '6cb2764ca91c4d2090b398e041f2b0dc' },
  { item: '100383056', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Thwaites, 3 т, поворотний кузов', original: '2021 Thwaites 3 Ton Swivel Skip', year: 2021, specs: 'дуга безпеки', img: '4c991236a36e4896ab18e1a096dac8ee' },
  { item: '100383040', day: 1, cat: 'excavators', path: 'dumpers/site-dumpers', title: 'Думпер Thwaites, 6 т', original: '2021 Thwaites 6 Ton', year: 2021, specs: 'дуга безпеки', img: '0b022dcb58044ce3ad6b9d02c5e2b14e' },
  { item: '100375570', day: 1, cat: 'excavators', path: 'dumpers/tracked-dumpers', title: 'Гусеничний міні-думпер Delano LH1.5T, новий', original: 'Unused 2026 Delano LH1.5T', year: 2026, specs: 'не використовувався, вантажопідйомність 1,5 т', img: '85a5305e2164459da7f7b2720ce1a754', unused: true },

  // Навантажувачі
  { item: '100383572', day: 1, cat: 'excavators', path: 'loaders/wheeled-loaders', title: 'Фронтальний навантажувач JCB 437 HT', original: '2012 JCB 437 HT T4', year: 2012, specs: 'подовжена стріла, швидкозмінник, автозмащення, кондиціонер, ківш', img: 'ce696ff9bc114d4a92c09d3ecfcd6a19' },
  { item: '100375025', day: 1, cat: 'excavators', path: 'loaders/wheeled-loaders', title: 'Фронтальний навантажувач Eachan YC-932, новий', original: 'Unused 2026 Eachan YC-932', year: 2026, specs: 'не використовувався', img: 'f94353b7b3814acdaa8c2c66414c2645', unused: true },
  { item: '100375026', day: 1, cat: 'excavators', path: 'loaders/wheeled-loaders', title: 'Фронтальний навантажувач Eachan YC-930, новий', original: 'Unused 2026 Eachan YC-930', year: 2026, specs: 'не використовувався', img: '9bae8bbc1f994b77bf58dd32d6f261be', unused: true },
  { item: '100375027', day: 1, cat: 'excavators', path: 'loaders/wheeled-loaders', title: 'Фронтальний навантажувач Eachan YC-930, новий', original: 'Unused 2026 Eachan YC-930', year: 2026, specs: 'не використовувався', img: '1e793e4eac5b4935902fb52fa3b61934', unused: true },
  { item: '100380456', day: 2, cat: 'excavators', path: 'loaders/skidsteer-loaders', title: 'Мінінавантажувач New Holland L320', original: '2020 New Holland L320', year: 2020, specs: 'гідролінія, закрита кабіна, ківш', img: 'a333895c8d4c43cdb602b5f4ca210626' },
  { item: '100379781', day: 2, cat: 'excavators', path: 'loaders/skidsteer-loaders', title: 'Мінінавантажувач New Holland L218', original: '2014 New Holland L218', year: 2014, specs: 'гідролінія, ківш', img: '1fc3c71468164fbba4d08acd0971f622' },
  { item: '100382252', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Екскаватор-навантажувач JCB 3CX Compact', original: '2019 JCB 3CX Compact', year: 2019, specs: 'повний привід, усі колеса керовані, гідролінія, швидкозмінник, ківш 3-в-1', img: 'beb24ad1f8154737aba1aab7b4e68a51' },
  { item: '100382255', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Екскаватор-навантажувач JCB 3CX Compact', original: '2016 JCB 3CX', year: 2016, specs: 'повний привід, усі колеса керовані, гідролінія, камера, у комплекті гідромолот', img: '80731c350f794ed0afa126bf4432a515' },
  { item: '100382253', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Екскаватор-навантажувач JCB 3CX Compact', original: '2016 JCB 3CX', year: 2016, specs: 'повний привід, усі колеса керовані, гідролінія, у комплекті гідромолот', img: '010024634af94af1a2f074f3c0d0a0e0' },
  { item: '100382077', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Екскаватор-навантажувач JCB 3CX', original: '2016 JCB 3CX', year: 2016, specs: 'повний привід, усі колеса керовані, гідролінія, швидкозмінник, ківш 4-в-1', img: 'fa2b5a9b93cb4857976be5aad5f40508' },
  { item: '100382256', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Навантажувач JCB 2CX Airmaster', original: '2013 JCB 2CX', year: 2013, specs: 'повний привід, усі колеса керовані, швидкозмінник', img: 'f752221c35074e04990f7117ca516a72' },
  { item: '100382257', day: 1, cat: 'excavators', path: 'loaders/backhoe-loaders', title: 'Екскаватор-навантажувач JCB 2CX Sitemaster', original: '2013 JCB 2CX', year: 2013, specs: 'повний привід, усі колеса керовані, гідролінія, без реєстраційних документів', img: '5b26e93606a24c548b4cfeb93f02b8ac' },

  // Телескопічні навантажувачі
  { item: '100383039', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач JCB 540-140 Hi Viz', original: '2021 JCB 540-140 Hi Viz', year: 2021, specs: 'Powershift, позиціонер вил, кондиціонер, вила', img: '98eeb4f3a345414bac6cb8934810a35d' },
  { item: '100380576', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT630-105', original: '2018 Manitou MLT630-105', year: 2018, specs: 'джойстик, швидкозмінник, гак, камера, кондиціонер, вила', img: '92d0907e0efd41db9f9e876a41fd180f' },
  { item: '100381790', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач JCB 536-60 Agri Plus', original: '2014 JCB 536-60 Agri Plus', year: 2014, specs: 'Powershift, джойстик, швидкозмінник, гак, кондиціонер, ківш', img: '140db5dcd8dd45a781acdb7bc54f65ac' },
  { item: '100380457', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT741-140 V+', original: '2018 Manitou MLT741-140 V+', year: 2018, specs: 'джойстик, швидкозмінник, гак, кондиціонер', img: '8f7a9b1eb22248d683455464babab10a' },
  { item: '100382494', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT741-140 V+', original: '2019 Manitou MLT741-140V+', year: 2019, specs: 'джойстик, швидкозмінник, гак, кондиціонер, вила', img: 'b875393215714e49989a60402fb02836' },
  { item: '100380575', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT630-115', original: '2022 Manitou MLT630-115', year: 2022, specs: 'джойстик, швидкозмінник, гак, кондиціонер, ківш', img: '8899b154f3294bf5a2efc0caaf74e918' },
  { item: '100381019', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MT1840, 18 м', original: '2022 Manitou MT1840', year: 2022, specs: 'вирівнювання рами, позиціонер вил, камера, ківш і вила', img: 'e3830a2a274e414c81770cba30707811' },
  { item: '100380242', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач JCB 538-60 AgriXtra', original: '2021 JCB 538-60AGX', year: 2021, specs: 'Powershift, джойстик, швидкозмінник, гак, кондиціонер', img: '4f07f55448334971a1996abd291699f4' },
  { item: '100380578', day: 1, cat: 'telehandlers', path: TELE, title: 'Шарнірний телескопічний навантажувач JCB TM320S', original: '2018 JCB TM320S', year: 2018, specs: 'джойстик, швидкозмінник, кондиціонер', img: '2ad2a29226584329ad925bd2f7e8b044' },
  { item: '100380579', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач New Holland LM5020', original: '2014 New Holland LM5020', year: 2014, specs: 'джойстик, швидкозмінник, камера, вила', img: '7a6081b6b76e4b20a1ca05cea8476a79' },
  { item: '100381506', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач JCB 532', original: 'JCB 532', year: null, specs: 'швидкозмінник', img: 'aaf07998284d45b6b813cc1404e16a32' },
  { item: '100384361', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT627T', original: 'Manitou MLT627T', year: null, specs: 'джойстик, швидкозмінник, гак, ківш і вила', img: '05393b4b3e0d43d0968c7228871afeb9' },
  { item: '100378533', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT627T', original: 'Manitou MLT627T', year: null, specs: 'джойстик, швидкозмінник, гак, вила', img: '52e9dc3ee76142f29b0a8d78d12a0546' },
  { item: '100382196', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MLT634-120 PS', original: 'Manitou MLT634-120 PS', year: null, specs: 'Powershift, джойстик, швидкозмінник, гак, кондиціонер, ківш і вила', img: '15f668b24fd541ab81370bff1f960025' },
  { item: '100384451', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Dieci ET129', original: 'Dieci ET129', year: null, specs: 'Powershift, вирівнювання рами, бокове зміщення, камера, ківш і вила', img: '3ee99797a5b14828a9ecd7d4e358e9d6' },
  { item: '100379530', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач CAT TH63', original: 'CAT TH63', year: null, specs: 'Powershift, джойстик, вирівнювання рами, швидкозмінник, вила', img: '008cf8a8c58a4ff0b5ab778399c3f44d' },
  { item: '100379531', day: 1, cat: 'telehandlers', path: TELE, title: 'Телескопічний навантажувач Manitou MT1435SL, 14 м', original: 'Manitou MT1435SL', year: null, specs: 'вирівнювання рами, швидкозмінник, вила', img: '8874cbad139f486f87d1d1b9f516fcb0' },
  { item: '100380241', day: 1, cat: 'telehandlers', path: TELE, title: 'Шарнірний телескопічний навантажувач Manitou MLA628', original: 'Manitou MLA628', year: null, specs: 'Powershift, джойстик, швидкозмінник', img: 'b06e9421c0a4419a9b887fcb4635bd8d' },

  // Трактори
  { item: '100383647', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Fendt 716', original: 'Fendt 716', year: null, specs: '4WD, підвіска моста й кабіни, передня навіска і ВВП, 4 гідровиходи, пневмогальма', img: '14a1779e1a3949959ba245813e1714ed' },
  { item: '100380700', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 6480', original: 'Massey Ferguson 6480', year: null, specs: '4WD, підвіска моста й кабіни, пневмогальма, 4 гідровиходи, кондиціонер', img: '1da7ac533c3b4d39a619c3993f19423c' },
  { item: '100380458', day: 1, cat: 'agro', path: TRAC, title: 'Трактор New Holland TD5040 з навантажувачем', original: 'New Holland TD5040', year: null, km: 27091, specs: '4WD, навантажувач NH 730TL, 2 гідровиходи, кондиціонер, лічильник 16 837 миль', img: '2ce18dba9ed240638889a66b657416e0' },
  { item: '100369487', day: 1, cat: 'agro', path: TRAC, title: 'Трактор John Deere 6620', original: 'John Deere 6620', year: null, specs: '4WD, 3 гідровиходи, кондиціонер', img: 'd213e5aec4264a7491111227b3deb390' },
  { item: '100369652', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Fiat 110-90 DT', original: 'Fiat 110-90DT', year: null, specs: '4WD, передні баласти, 3 гідровиходи, гак, кондиціонер', img: '81b2a53366aa41c7949a34416c114112' },
  { item: '100384442', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Lamborghini 1050', original: 'Lamborghini 1050', year: null, specs: '4WD, 4 гідровиходи, кондиціонер', img: 'd457302a56484403a9b2339967cefce6' },
  { item: '100374584', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 3645', original: 'Massey Ferguson 3645', year: null, specs: '4WD, 2 гідровиходи, кондиціонер', img: '99b1d1a84b154538a75f99e52ee95e95' },
  { item: '100363802', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 390 з навантажувачем', original: 'Massey Ferguson 390', year: null, specs: '4WD, фронтальний навантажувач Quicke 640, 2 гідровиходи', img: '412973ef9b1d4f3aaca3ade875f50c1b' },
  { item: '100366068', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 362', original: 'Massey Ferguson 362', year: null, specs: '4WD, 2 гідровиходи', img: 'e1a767250dc347b797cc77b2aecfbb24' },
  { item: '100384446', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 362', original: 'Massey Ferguson 362', year: null, specs: '2WD, 2 гідровиходи', img: '0ee4d185628a4f64a762104476088c0f' },
  { item: '100372148', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Massey Ferguson 135', original: 'Massey Ferguson MF135', year: null, specs: '2WD, гак', img: '5a67ea5db0344ba2a31edcd2c012e667' },
  { item: '100259816', day: 1, cat: 'agro', path: TRAC, title: 'Трактор Ford 6600', original: 'Ford 6600', year: null, specs: '2WD', img: '4832158d82f744c68ab946e976fe9349' },
  { item: '100374586', day: 1, cat: 'agro', path: CTRAC, title: 'Мінітрактор Kubota GT3 з навантажувачем', original: 'Kubota GT3', year: null, hours: 934, specs: '4WD, навантажувач, ґрунтофреза', img: '227e224100264ac6a7bcfa4f897a2364' },
  { item: '100374585', day: 1, cat: 'agro', path: CTRAC, title: 'Мінітрактор Kubota B52 з навантажувачем', original: 'Kubota B52', year: null, hours: 623, specs: '4WD, навантажувач, ґрунтофреза', img: 'ec98dfbf37a9409c848c1c7c167bfc58' },
  { item: '100374580', day: 1, cat: 'agro', path: CTRAC, title: 'Мінітрактор Mitsubishi MT336H', original: 'Mitsubishi MT336H', year: null, specs: '4WD, кабіна, кондиціонер', img: '63a83472fc374122988b2ae9d60a66fd' },
  { item: '100374588', day: 1, cat: 'agro', path: CTRAC, title: 'Гусеничний мінітрактор Yanmar AC18', original: 'Yanmar AC18', year: null, specs: '', img: 'f98536fc5dec449e8de8d6beb90b3e8b' },

  // Пікапи (ціни у Великій Британії + ПДВ для комерційних авто)
  { item: '100381543', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Toyota Hilux Invincible', original: '2026 Toyota Hilux Invincible', year: 2026, km: 375, specs: 'автомат, подвійна кабіна, навігація, камера, пробіг 233 милі, + ПДВ', img: '484caf5a4eb64118bab352c63c6a689a' },
  { item: '100383856', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Toyota Hilux Invincible X', original: '2023 Toyota Hilux Invincible X', year: 2023, specs: '4WD, автомат, подвійна кабіна, шкіра з підігрівом, камера, кунг Truckman, + ПДВ', img: '934b08c0d86a46f4ba4aa616ad0fdddb' },
  { item: '100381430', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Toyota Hilux Icon', original: '2023 Toyota Hilux Icon', year: 2023, specs: 'механіка 6 ст., подвійна кабіна, камера, кондиціонер, + ПДВ', img: 'e486fb826ab341319131a35ce3eb2d89' },
  { item: '100383854', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Ford Ranger Wildtrak', original: '2023 Ford Ranger Wildtrak', year: 2023, specs: '4WD, автомат, подвійна кабіна, шкіра з підігрівом, камера, + ПДВ', img: '76a50d63d37445b2b975ba51cbc5d086' },
  { item: '100383480', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Volkswagen Amarok', original: '2023 Volkswagen Amarok', year: 2023, specs: 'автомат, навігація, підігрів сидінь, камера 360°, кунг, + ПДВ', img: 'b5b9f3e4bf9e4ded8af7bd78586b755d' },
  { item: '100381541', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Volkswagen Amarok', original: '2020 Volkswagen Amarok', year: 2020, specs: '4WD, автомат, подвійна кабіна, шкіра з підігрівом, камера, + ПДВ', img: 'fe50edf0854f40e1b01945158fbd6db7' },
  { item: '100384439', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Mitsubishi L200', original: '2017 Mitsibushi L200', year: 2017, specs: '4WD, автомат, подвійна кабіна, шкіра з підігрівом, камера, хардтоп', img: '979370d000d14f0292586fa472d9a560' },
  { item: '100381542', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Nissan Navara', original: '2017 Nissan Navara', year: 2017, specs: '4WD, механіка 6 ст., подвійна кабіна, шкіра, камера 360°, кунг Alpha, + ПДВ', img: '6a999dd3e46646269297ff5777a01443' },
  { item: '100383574', day: 1, cat: 'pickups', path: PICK, title: 'Пікап Nissan Navara', original: '2016 Nissan Navara', year: 2016, specs: 'автомат, навігація, шкіра з підігрівом, камера 360°, + ПДВ', img: '704e98ae8188474b8870b977e12ae295' },

  // Вантажівки
  { item: '100382243', day: 1, cat: 'trucks', path: CV + 'tractor-units', title: 'Сідловий тягач DAF XF530 6x4', original: '2020 DAF XF530', year: 2020, specs: 'гідравліка для самоскидного напівпричепа, автомат, кондиціонер', img: '24ca41d0f5094bafad8b5e328f5c9b8b' },
  { item: '100382244', day: 1, cat: 'trucks', path: CV + 'tractor-units', title: 'Сідловий тягач DAF XF530 6x2', original: '2020 DAF XF530', year: 2020, specs: 'гідравліка для самоскидного напівпричепа, автомат, кондиціонер', img: 'af3651e2055d49809bc15f40395867a7' },
  { item: '100382258', day: 1, cat: 'trucks', path: CV + 'tractor-units', title: 'Сідловий тягач DAF XF530 6x2', original: '2021 DAF XF530', year: 2021, specs: 'підйомна керована задня вісь, гідравліка самоскиду, автомат, кондиціонер', img: '8b05eaafebb34f32866f720136b85c37' },
  { item: '100382259', day: 1, cat: 'trucks', path: CV + 'tractor-units', title: 'Сідловий тягач DAF XF460 6x2', original: '2016 DAF XF460', year: 2016, specs: 'автомат, кондиціонер, ірландська реєстрація', img: '7717311866c0400bb20482ba1840c2aa' },
  { item: '100382083', day: 1, cat: 'trucks', path: CV + 'tractor-units', title: 'Сідловий тягач Scania R620 8x4', original: '2008 Scania R620', year: 2008, specs: 'два ведучі мости, гідравліка самоскиду, механіка, кондиціонер', img: 'deb39b73d1b649bb81153ef1440df1b2' },
  { item: '100382764', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Hino 700 8x4', original: '2008 Hino 700', year: 2008, specs: 'механіка, кондиціонер, тент кузова', img: '312fe9cf248e4c9ba652770056c17722' },
  { item: '140577018', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Scania P310', original: '2007 Scania P310', year: 2007, specs: 'техогляд до 11/27', img: 'a964f30b143f4dc5a4552812805a3cbb' },
  { item: '100381662', day: 1, cat: 'trucks', path: TIP, title: 'Вантажівка-кормовоз Scania P270 6x4', original: '2006 Scania P270', year: 2006, specs: 'бункер з пневмовивантаженням, утеплений алюмінієвий кузов, механіка', img: 'e21628a9e3b447a89e94b98240c8c127' },
  { item: '100382095', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Iveco 75-160', original: '2017 Iveco 75-160', year: 2017, specs: '4x2, кузов Brit-Tipp з бортами, камера, механіка', img: 'c4eec63b74bd4df5b34a870f76c66d86' },
  { item: '100382097', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Iveco 75-160', original: '2017 Iveco 75-160', year: 2017, specs: '4x2, кузов Brit-Tipp з бортами, камера, механіка', img: 'e11c8164a9a744d3a469d4e23fb6c551' },
  { item: '100382213', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Iveco 75-160 для тріски', original: '2017 Iveco 75-160', year: 2017, specs: '4x2, сталевий кузов для тріски, камера, механіка', img: 'a4954811dfb946e39c0ec7aa9fa5230f' },
  { item: '100382297', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Iveco 75E16', original: '2014 Iveco 75E16 EEV', year: 2014, specs: '4x2, сталевий кузов з бортами, автомат', img: 'f5f1af4d358d4e09a49249d03dfb9a3a' },
  { item: '100380607', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид Isuzu 4x2', original: '2016 Isuzu 4x2 Dropside Tipper Lorry, Automatic Gearbox', year: 2016, specs: 'кузов з бортами, автомат, ірландська реєстрація', img: 'a6c5c7f65d8b42a885369082c409caf6' },
  { item: '100383038', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид DAF LF', original: '2014 DAF LF', year: 2014, specs: '4x2, сталевий кузов з бортами, автомат', img: '5fe63acbf99a4a0f9f0c05f7f40a6eb7' },
  { item: '100383562', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид DAF LF', original: '2014 DAF LF', year: 2014, specs: '4x2, сталевий кузов з бортами, механіка', img: '2c4bc734586447fbb2a462c9cb3cb079' },
  { item: '100382369', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид DAF LF45.160 з термобоксом', original: '2012 DAF LF45.160', year: 2012, specs: '4x2, сталевий кузов, термобокс для асфальту, механіка', img: '0bb0a81a678148c6b0e0e1f55af4c966' },
  { item: '100382292', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид DAF LF45.160', original: '2012 DAF LF45-160', year: 2012, specs: '4x2, сталевий кузов з бортами, автомат, кондиціонер', img: '0eb61ed3cd1c453583929611b3fcbc4e' },
  { item: '100383645', day: 1, cat: 'trucks', path: TIP, title: 'Самоскид DAF LF55.220', original: '2009 DAF LF55.220', year: 2009, specs: '4x2, сталевий кузов з бортами, автомат, кондиціонер', img: '687417592a1a4422945dacf2e45ba5d9' },
  { item: '100382175', day: 1, cat: 'trucks', path: CV + 'flat-bed-trucks', title: 'Бортова вантажівка DAF LF 180 з краном-маніпулятором', original: '2016 DAF LF 180 FA', year: 2016, specs: '4x2, кран Atlas 75.2, камери, механіка', img: '067b1b3178f741739ec62d655ae4cff3' },
  { item: '100382110', day: 1, cat: 'trucks', path: CV + 'flat-bed-trucks', title: 'Бортова вантажівка Renault 240 DXI з краном-маніпулятором', original: '2008 Renault 240DXI', year: 2008, specs: '4x2, кран Fassi F110 з буром, механіка', img: '2a78bcd7bca04ab0a07a6c58282b8d29' },
  { item: '100382260', day: 1, cat: 'trucks', path: CV + 'beavertail-plant-trucks', title: 'Евакуатор техніки Mercedes Axor 8x4 з краном', original: '2008 Mercedes Axor', year: 2008, specs: 'кран HIAB XS477E-6, гідравлічні рампи, камера, механіка, кондиціонер', img: 'c2ee4042f0c34a2db8d39b443edb09ab' },
  { item: '100383629', day: 1, cat: 'trucks', path: CV + 'beavertail-plant-trucks', title: 'Евакуатор техніки Mitsubishi Canter 7C18', original: '2018 Mitsubishi Canter', year: 2018, specs: '4x2, похила платформа, рампи, лебідка, автомат', img: '14e03135a53241739a2576e552278d33' },
  { item: '100383630', day: 1, cat: 'trucks', path: CV + 'beavertail-plant-trucks', title: 'Евакуатор техніки Mitsubishi Canter 7C18', original: '2018 Mitsubishi Canter', year: 2018, specs: '4x2, похила платформа, рампи, лебідка, автомат', img: '09606f3a71404722b11240e0e88c944b' },
  { item: '100382460', day: 1, cat: 'trucks', path: CV + 'curtain-side-trucks', title: 'Тентована вантажівка DAF LF 310 FA', original: '2016 DAF 310FA', year: 2016, specs: 'Euro 6, 4x2, гідроборт, камери, автомат, кондиціонер', img: '27ba4cd6767749e79794ea664d0ea09b' },
  { item: '100384500', day: 1, cat: 'trucks', path: CV + 'curtain-side-trucks', title: 'Тентована вантажівка MAN TGM 18.250', original: '2012 MAN TGM 18-250', year: 2012, specs: '4x2, гідроборт, автомат', img: '70f3f049b3094bab885759410933809f' },
  { item: '100384491', day: 1, cat: 'trucks', path: CV + 'curtain-side-trucks', title: 'Тентована вантажівка Scania P230', original: '2010 Scania P230', year: 2010, specs: '4x2, гідроборт, автомат, кондиціонер', img: 'c0253facbe0c458cb85c3d0ab66f385a' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const EA_DROMORE_LOTS: AuctionLot[] = RAW.map((r) => ({
  auction: AUCTION,
  lot: '', // номери лотів ще не присвоєні
  item: r.item,
  title: r.title,
  original: r.original,
  category: r.cat,
  year: r.year,
  hours: r.hours ?? null,
  miles: r.km ?? null,
  specs: r.specs,
  unused: !!r.unused,
  inoperable: !!r.inoperable,
  location: 'Дромор, Північна Ірландія',
  endsAt: r.day === 2 ? DAY2 : DAY1,
  live: true,
  img: `${IMG}${r.item}/${r.img}.jpeg`,
  url: `${BASE}${r.item}/0/${r.path}/${slug(r.original)}`,
}));
