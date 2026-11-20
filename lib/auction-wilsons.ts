// Лоти з аукціону Wilsons Auctions у Белфасті (Північна Ірландія, Велика Британія), 24 листопада 2026.
// Зібрано 20.11.2026 з каталогу аукціону: техніка, пікапи й навісне під попит в Україні (фургони не брали).
// Живі торги: заявку з лімітом треба дати напередодні. Ставки тут не зберігаються.

import type { AuctionLot } from './auction-lots';

const AUCTION = 'wilsons-belfast-nov';
const DAY = Date.UTC(2026, 10, 24, 11, 0); // 24.11.2026, 11:00 за Лондоном
const BASE = 'https://www.wilsonsauctions.com/auctions/plant-machinery-commercial-auction-6275/lots/';
const IMG = 'https://assets.wilsonsauctions.com///lots_';

type Raw = {
  lot: string; item: string; cat: AuctionLot['category']; title: string; original: string;
  year: number | null; hours?: number | null; miles?: number | null; specs: string; img: string;
  unused?: boolean; location?: string;
};

const RAW: Raw[] = [
  { lot: '75', item: '551122', cat: 'pickups', title: 'Пікап Toyota Hilux Invincible X 2.8 D-4D', original: '2024 Toyota Hilux Invincible X 2.8 D-4D', year: 2024, miles: 104685, specs: 'пробіг 65 049 миль, оцінка аукціону ≈ £27 000', img: 'asset-484001%2FGeneralImages-3_image.jpg_219293' },
  { lot: '7', item: '548714', cat: 'pickups', title: 'Пікап Ford Ranger Wildtrak 4x4 автомат', original: '2023 Ford Ranger Wildtrak Ecoblue 4X4 A', year: 2023, miles: 34250, specs: 'пробіг 21 282 милі, оцінка аукціону ≈ £18 775', img: 'asset-373101%2FGeneralImages-5_image.jpg_184098' },
  { lot: '18', item: '540274', cat: 'pickups', title: 'Позашляховик Land Rover Defender 110 Hard Top', original: '2014 Land Rover Defender 110 Hard TOP TD', year: 2014, miles: 91450, specs: 'пробіг 56 825 миль, оцінка аукціону ≈ £12 075', img: 'asset-477640%2Fimage.jpg_3977196' },
  { lot: '21', item: '544491', cat: 'pickups', title: 'Позашляховик Land Rover Defender 110 Hard Top', original: '2014 Land Rover Defender 110 Hard TOP TD', year: 2014, miles: 179710, specs: 'пробіг 111 667 миль, оцінка аукціону ≈ £8 925', img: 'asset-481398%2Fimage.jpg_3181960' },
  { lot: '28', item: '541153', cat: 'pickups', title: 'Пікап Isuzu D-Max Twin Turbo', original: '2016 Isuzu D-Max E/C Twin Turbo TD', year: 2016, miles: 205900, specs: 'полуторна кабіна, пробіг 127 940 миль, оцінка аукціону ≈ £4 400', img: 'asset-479070%2Fimage.jpg_3650496' },
  { lot: '38', item: '547927', cat: 'pickups', title: 'Пікап Isuzu D-Max Twin Turbo', original: '2016 Isuzu D-Max E/C Twin Turbo TD', year: 2016, miles: null, specs: 'полуторна кабіна', img: '1794831692-1794831687098442131973278998751.jpg_184290' },
  { lot: '151', item: '554112', cat: 'excavators', title: 'Гусеничний екскаватор Komatsu PC130-7, 13 т', original: '2005 Komatsu PC130-7 13 Tonne Excavator', year: 2005, hours: 6385, specs: 'від держагенції Rivers Agency, збір аукціону 40%', img: 'asset-488061%2F03ffc92a-91f8-4ab9-aef1-55194b70cacf.jpg_382517', location: 'Портадаун, Північна Ірландія' },
  { lot: '155', item: '547110', cat: 'excavators', title: 'Міні-екскаватор Kubota U27-4, гідролінія під гідромолот', original: '2016 Kubota U27-4 Rubber Tracked Piped For Hammer', year: 2016, hours: 2291, specs: 'гумові гусениці, 3 ковші, гідромолот, від NI Water', img: '1794557858-image.jpg_3900247' },
  { lot: '144', item: '548061', cat: 'excavators', title: 'Міні-екскаватор Hauyee HY20, новий', original: '2026 Hauyee HY20 Mini Excavator', year: 2026, hours: null, specs: 'новий, 2 т', img: '1794581406-17945813957796485586074397113285.jpg_4885260', unused: true },
  { lot: '110', item: '549289', cat: 'excavators', title: 'Міні-думпер Sinolink WD500, 0,5 т, новий', original: 'New Sinolink WD500 Petrol Ride On 1/2 Tonne Dumper', year: null, hours: null, specs: 'бензиновий, новий', img: '1793699657-17936996481344989436725761308010.jpg_4815000', unused: true },
  { lot: '156', item: '555621', cat: 'breakers', title: 'Гідромолот Stelco 1,3 т', original: '2020 1.3 Tonne Stelco Rock Hammer Attachment', year: 2020, hours: null, specs: 'для екскаваторів 13–20 т', img: '1795177797-17951776983941581347121280441354.jpg_7181660' },
  { lot: '104', item: '549280', cat: 'attachments', title: 'Грейферний ківш Strickland 6 футів, новий', original: "Unused Strickland 6' Re-Handling Grab Bucket", year: null, hours: null, specs: 'під JCB, не використовувався', img: '1792400834-17924008224875074248345959312471.jpg_5083104', unused: true },
  { lot: '105', item: '549282', cat: 'attachments', title: 'Захват для колод MDE з ротатором', original: '2019 MDE 3 Point Tree Clamp Attachment c/w Rotating Head', year: 2019, hours: null, specs: 'під JCB, поворотна голова', img: '1792401841-17924018353745568848289291030774.jpg_6543811' },
  { lot: '109', item: '554309', cat: 'trucks', title: 'Вантажівка-евакуатор техніки Iveco Tector 75E17 з бобровим хвостом', original: '2002 Iveco Cargo Tector 75e17s Beaver Tail Machinery', year: 2002, miles: 211630, specs: 'платформа для перевезення техніки, пробіг 211 630 км', img: 'asset-488186%2F17950991911451374252157942639489.jpg_3892732' },
  { lot: '135', item: '549285', cat: 'trucks', title: 'Автовишка Iveco Eurocargo 75E16', original: '2010 Iveco Eurocargo 75e16s With Personnel Lift', year: 2010, miles: 61909, specs: 'підйомник з люлькою, пробіг 61 909 км', img: 'asset-468080%2Fimage.jpg_2834523' },
  { lot: '150', item: '546566', cat: 'energy', title: 'Пересувний компресор Ingersoll Rand', original: '2001 Ingersoll Rand Towable Air Compressor', year: 2001, hours: null, specs: 'дизельний, на причепі', img: '1794496276-17944962683214330559787417983612.jpg_5172040' },
];

export const WILSONS_LOTS: AuctionLot[] = RAW.map((r) => ({
  auction: AUCTION,
  lot: r.lot,
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
  location: r.location ?? 'Белфаст, Північна Ірландія',
  endsAt: DAY,
  live: true,
  img: `${IMG}${r.img}/1000x800.jpeg`,
  url: BASE + r.item,
}));
