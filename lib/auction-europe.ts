// Лоти з європейських майданчиків Ritchie Bros (Нідерланди, Іспанія), підібрані під конкретний запит:
// дизельні компресори високого тиску (20–24 бар, 20–25 м³/хв).
// Зібрано 23.11.2026 з каталогу Ritchie Bros. Ставки тут не зберігаються. Ціни на цих майданчиках — у євро.

import type { AuctionInfo, AuctionLot } from './auction-lots';

const CDN = 'https://cdn.ironpla.net/i/';
const photos = (dir: string, ids: string[]) => ids.map((id) => `${CDN}${dir}/${id}.jpg`);

export const EUROPE_AUCTIONS: AuctionInfo[] = [
  {
    id: 'rb-ocana-nov',
    house: 'Ritchie Bros',
    name: 'Spain Timed Auction',
    place: 'Оканья, Іспанія',
    dates: '25 листопада 2026',
    format: 'Онлайн-торги з таймером',
    totalLots: 0,
    unreserved: true,
    url: 'https://www.rbauction.com/pdp/2011-ingersoll-rand-xhp900wcat-air-compressor/16292336',
    currency: 'EUR',
  },
  {
    id: 'rb-benelux-dec',
    house: 'Ritchie Bros',
    name: 'Benelux Timed Auction',
    place: 'Зевенберген, Нідерланди',
    dates: '2 грудня 2026',
    format: 'Онлайн-торги з таймером',
    totalLots: 0,
    unreserved: true,
    url: 'https://www.rbauction.com/pdp/2021-compair-dlt2703-20-m3-min-mobile-air-compressor/15890025',
    currency: 'EUR',
  },
];

const DLT2703 = photos('22987/743', [
  '62717f47-39e3-4e09-a6cd-fc4fd7249d57', '7d0d6f70-9018-43f1-8303-c22ca451f270', '741270de-e320-4f9c-8930-208d2c786fe3',
  '67a61657-9fb2-4a86-8c28-554de9ce8f68', 'a0aa1009-4711-49e6-8a7e-f43667c1fbd5', '66f7083b-ce48-4106-8ba0-50743d632dff',
  '0b23ad81-7aaa-4d10-8242-2546e941aec7', 'be201a8c-8097-4159-a3e5-ea7f8b7a19bf', '80ddf495-369b-48a3-a111-d61a41861f71',
  '30182680-43cc-415c-8c0e-5e53fb772b42', '902edbd7-2732-4af6-97f4-45bf54eec55b', '248820c3-e615-4875-bc68-59f1aa3096d3',
  '70bbcfd8-9248-492c-a8fb-014ac06542e3', '23c2140b-dd79-4a18-84b4-de333a0ced3d', '9d495d71-bace-43df-b024-44b7d8d32796',
  '468f899e-d267-4874-ade3-87a2717f02fe', '81492673-a252-4765-a721-b651a4a5867b', '3f7dae38-8558-40d7-8924-09c6d836ac54',
  'd19d17e9-eb29-4143-9e7b-2fd1359e09a5', 'd124f9d2-bab6-4454-ae5c-00cdcc66cabb', '522492d8-a7e5-4a4c-89ec-05aba8ec209a',
  '64109d7f-ab97-49af-b2fe-0dc0fc6b32f8', 'b473f531-0e12-40a2-8b17-541421143f58', '06e3b39d-d37f-4300-a222-3c5605bc1480',
  'bf776293-be4f-4b67-a968-6958b4b3e1a3', 'cde70025-bb8d-48fa-a54f-d18bae4deba6',
]);

const XHP900 = photos('23553/935', [
  '971f78d4-287e-461f-84f2-eee07f9f4659', 'd4771ec3-86fe-4028-a801-a6e2f238c06a', '2786f83f-6589-48d7-95c6-58d9fc2ac58c',
  '982d5a81-4902-4291-b054-4aff73b17ed3', '3e155284-e676-4aed-bbbf-3b06d97129d0', '1b66eaa0-411c-447f-9fa0-da52d9377d63',
  'f3e4c4dd-98e2-4858-9b6c-c9942245ded8', '56169996-cf9f-4a4c-bd16-15aae4769d94', '1a82fb57-7165-422a-b2a8-17b4f5581f1a',
  'afb53ee2-d81d-4f41-bca5-6fe365f51262', 'd94d9432-c352-490d-a898-800174c1c0ba', '09fd0716-7cb9-4045-b098-b3cdb9d85f4e',
  '6aaa9010-09ac-485a-9984-126736ea3b69', 'f68793f1-2727-41a5-a2fa-075f82789e91', '638249be-7527-409a-9892-34a29b577991',
  'ffd847df-1f02-48b5-a680-66ecb01df0c5', '184ddb18-7e5d-40d1-af31-0f0fa8f0e1e9', '4522f104-02bf-4379-819a-cb38089e9075',
  '9712c11a-9e9a-44b9-b4a8-e1354470355c', '2b6180c7-7d0a-41de-b0db-2a483454b515', '72478100-d425-41e7-9038-4ee7551726ed',
  'a462aa80-cd1a-4090-8975-9ef5a5ecd69e', '76380ba5-2b75-49fd-b915-c899cd5138d1', 'af26efc6-94b1-489a-92d1-5d82be307009',
  'bece4521-0a98-42ac-9680-40223e2a1926', '5cf6cd6a-ce27-4ad6-95f6-a98f9a7b828c', 'cdc36c25-c80b-4839-b262-6a4f46b82a94',
  '48b09ddd-48c2-4606-98e1-5621ce1949c0', 'a4cff7e7-01b2-4507-900d-f996f3a21b41', '7e37944c-8618-4da9-a869-c79c720fb6a9',
  'ae7352ce-c026-48ec-b7f8-a9d5720a0d7f', 'b8cd96c9-3da1-42c7-8e7f-14949b897360', 'b713ff33-670c-4aed-bb0b-14b315073444',
  'd89f6a10-0fde-44e3-8b4c-f1f5199f0869', '74c35dc9-aba7-443f-a024-88dcdff8bf3f',
]);

export const EUROPE_LOTS: AuctionLot[] = [
  {
    auction: 'rb-ocana-nov',
    lot: '36',
    item: '16292336',
    title: 'Пересувний компресор Ingersoll Rand XHP 900, 24 бар, ≈25 м³/хв',
    original: '2011 Ingersoll Rand XHP900WCAT Air Compressor',
    category: 'energy',
    year: 2011,
    hours: null,
    specs:
      'дизельний гвинтовий компресор високого тиску на причепі: робочий тиск 24 бар, продуктивність близько 25 м³/хв (900 cfm), двигун Caterpillar, 6 циліндрів. На огляді аукціону двигун запускається, компресор набирає тиск. Без реєстраційних документів',
    unused: false,
    inoperable: false,
    location: 'Оканья, Іспанія',
    endsAt: 1795594475000, // 25.11.2026, 08:14 UTC
    live: false,
    img: XHP900[0],
    gallery: XHP900,
    url: 'https://www.rbauction.com/pdp/2011-ingersoll-rand-xhp900wcat-air-compressor/16292336',
  },
  {
    auction: 'rb-benelux-dec',
    lot: '',
    item: '15890025',
    title: 'Пересувний компресор CompAir DLT 2703, 24 бар, 20 м³/хв',
    original: '2021 CompAir DLT2703 20 m3/min Mobile Air Compressor',
    category: 'energy',
    year: 2021,
    hours: 1537,
    specs:
      'дизельний гвинтовий компресор високого тиску на одновісному причепі з інерційним гальмом: робочий тиск 24 бар, продуктивність 20 м³/хв, двигун Cummins, 6 циліндрів (потрібен AdBlue). Є сертифікати CE і COC, перша реєстрація в Німеччині у 2021 році. На огляді аукціону двигун не запускали, тому стан перевіряємо до ставки',
    unused: false,
    inoperable: false,
    location: 'Зевенберген, Нідерланди',
    endsAt: 1796234400000, // 02.12.2026, 18:00 UTC
    live: false,
    img: DLT2703[0],
    gallery: DLT2703,
    url: 'https://www.rbauction.com/pdp/2021-compair-dlt2703-20-m3-min-mobile-air-compressor/15890025',
  },
];
