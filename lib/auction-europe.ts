// Пересувні дизельні компресори 10–24 бар з аукціонів Ritchie Bros (Іспанія, Нідерланди, Франція)
// і Euro Auctions (Дормаген, Лідс). Зібрано 23.11.2026 з каталогів аукціонів. Ставки тут не зберігаються.
// Ціни на європейських майданчиках — у євро, у Лідсі — у фунтах. Сторінка: /kompresory-z-yevropy

import type { AuctionInfo, AuctionLot } from './auction-lots';

const CDN = 'https://cdn.ironpla.net/i/';
const photos = (dir: string, ids: string[]) => ids.map((id) => `${CDN}${dir}/${id}.jpg`);
const EA = 'https://images.euroauctionslive.com/';
const eaPhotos = (dir: string, item: string, ids: string[]) => ids.map((id) => `${EA}${dir}/${item}/${id}.jpeg`);

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
  {
    id: 'rb-france-dec',
    house: 'Ritchie Bros',
    name: 'France Timed Auction',
    place: 'Авіньйон і Ніволя-Вермель, Франція',
    dates: '3 грудня 2026',
    format: 'Онлайн-торги з таймером',
    totalLots: 0,
    unreserved: true,
    url: 'https://www.rbauction.com/pdp/2018-kaeser-m250-25-m3-min-compresseur-a-air-1-essieu-s-a-air-compressor/16237725',
    currency: 'EUR',
  },
  {
    id: 'ea-dormagen-dec',
    house: 'Euro Auctions',
    name: 'Dormagen Auction',
    place: 'Дормаген, Німеччина',
    dates: '2–4 грудня 2026',
    format: 'Живі торги + онлайн-ставки',
    totalLots: 5210,
    unreserved: true,
    url: 'https://www.euroauctions.com/en/equipment-search/product/200320504/0/misc/compressors/doosan-14-115-600cfm',
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
    engine: 'Caterpillar, 6 циліндрів (потужність уточнюємо за табличкою)',
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
    engine: 'Cummins QSB6.7, 224 кВт (305 к.с.)',
    img: DLT2703[0],
    gallery: DLT2703,
    url: 'https://www.rbauction.com/pdp/2021-compair-dlt2703-20-m3-min-mobile-air-compressor/15890025',
  },
];

const M250 = photos('23484/979', [
  '3c598877-ab32-44be-8eb4-cbaf7aac24c1', '6198ea1a-d35b-4ad3-8afb-8e94477b305a', '0d816b75-5bbf-40de-909f-b49268fe44b0', '3aba810c-b2b9-4303-a141-e37c8ca091b6',
  'e8b8b9b0-6df5-4f31-927a-ec977a02b51b', '12c62604-55bd-498c-aef0-02f258a51bd8', 'b7c10881-537d-4041-9f27-76c963b24cd3', 'e3a3f293-3a88-4593-b3a1-ab90a1133602',
  '68af863e-06c8-4e98-a775-50f79e750e11', '3d116709-b367-40b8-aab7-87b24ca18195', '25ce5538-d917-426d-a878-6ee8646181c0', '523a5fe7-d636-41bf-86a6-357a8909d312',
  '1f26b6ba-8db7-4678-9e5c-512aea278d4f', '1dfb0edf-84b4-4187-9cec-17854e92432a', '9b48c559-877f-4680-b839-9a88d0ae7b33', '691df9f6-bb2a-4c97-b507-814e0d74dd6f',
  '23f169fb-b707-44ea-982d-d86ceda02e3a', '5d225cb0-ecef-4bc3-b9d4-8aa356111899', 'f8e79558-0558-4515-b647-24880f4bfff5', 'ae53c26f-fd16-4415-ac90-6e46261e63f0',
  '6e178c29-dee0-4d08-b80c-baee4c5341df', 'f021bdb5-ac48-4f74-abb7-a908216a92ba', '344a5d09-36cc-4f21-9c1e-d9d592cfe3de', '383356a2-13b4-4729-811a-f023fb0af428',
  'e15b9449-093a-45fc-a12e-ff45a6e24312',
]);

const XAHS347 = photos('23546/186', [
  'c49d2a85-10fe-4da0-bb55-0e5b53d95385', '075c902c-26d1-47e0-93b5-73e9fbcc4705', 'd2c45f0b-a405-4051-847c-80c95714956e', 'bb4d439f-b74e-4ec2-80ee-f8fba0ee5aa7',
  '5951a5c9-f86a-4834-aa4c-13b49a156644', 'ed766165-2fd3-4c88-9ff1-0faf0db338d1', 'f4d6e842-b9fb-4827-97fc-be8ec5458a18', '6ff22c57-5428-4f38-bd49-68c71d90c812',
  '1120dc24-8d09-4721-a9a6-9f970c88c5c5', '6779ec96-6189-4913-86aa-25df5dcd5f02', 'c31f3294-8b10-476a-a44c-668b68e47265', '83065e62-2321-4084-8c17-7f5d261fe5f9',
  'f654aef3-a451-471c-9e8f-c96182edf7f5', '0650916a-2fdc-42e5-b244-ee07e6a03c9c', '3f0be6db-7e93-47a7-b4a6-dd5e95782179', '8d03fbff-9e28-4ec3-8992-6243b7c1261c',
  'a576168b-9d5b-45da-bbac-e66cc00b3779', 'ad5825c6-ca31-4e0b-b106-72fd6948e991', '5de85928-b065-4f53-8eae-90532688de48', '6820bb1a-013b-48bd-9873-868106a89742',
  'c58c3d24-23a2-4672-8a19-68825d989ea7', 'c40875a5-51ec-4906-9f9b-57eae07632d5', '5e091293-c5aa-48b4-b94d-c3f8e76f1174', '10b72b29-f0db-484f-95a3-242a8cc46cf2',
  '7c8c8a09-8f24-49eb-91b2-7593783d6540', '24f41180-2773-4725-b2ee-4be577b0b857', '36c28a2a-9bf7-4212-baf1-08720230cb6c', '7fbbbc38-e494-44f0-bea1-74506769c595',
  '58e794ad-fe40-4c2d-ba76-aba9df46f71b', 'a76624b4-fb69-4af5-974e-9a4a5b5c041b', 'f9beb93c-16b4-4c5f-afc1-6741b23c74b6',
]);

const IR10370 = photos('23553/936', [
  'b57ced6f-5211-4850-ad31-52016f11bfb5', '496aac28-5a80-44b4-8917-955c7a1bdebe', 'f2b70a52-b9cf-4292-86ed-1262fae236a1', '812ce455-3f4e-4c6c-ac4d-8290abc87e14',
  '682f2f30-7b32-49a9-b846-78fcd3ae599b', '0d9007e6-c712-4182-80a1-ce47d8b6bbed', 'b3888b0a-a80e-436d-b2eb-61e09daeeeec', 'c86a3c39-c860-4777-8e58-88d8f06741fa',
  '67d58206-a6bb-4514-9d4e-6d5474bae7d4', '60341542-6700-46fa-bc1f-62c9e901977e', '07c2cc6d-85ef-4352-8d4d-4a2629933a31', 'b9c32f65-f6de-4a2f-a5a5-31ce4ed82f2f',
  '1151f2f2-a573-49c6-bd73-5dd73025b0be', 'd1a91bdf-74c3-4255-9a30-01e9221ec898', 'f70bef1f-d851-46fb-bc40-4164ee656886', 'c5ee6983-adf3-4c28-8aaf-be5a0e6cd7af',
  'eb685f13-bbfc-4cb3-ba86-293ebffe3c28', 'fe547cea-3476-404f-b4d7-6da1640901eb', '14b6b18f-b0d8-4dfa-91fd-0336dcce2260', '041ac48b-642d-4cb1-80b0-a13533388b21',
  'd93cd39b-dbde-41f9-b6cc-1bcf190541c9', '00db15ff-5432-4781-8a63-86731476b4fa', '93c10838-a460-4b32-ae55-0cb2099a2da4', '2fd7620a-0097-4be1-a31b-76a2bc9315aa',
  'c5f99507-be63-4b2c-b554-097850341b3c', '0b3f3be7-fcc7-41c1-95f6-17cfb15d4282', 'fc9fbd47-b4e2-439e-96de-dcd09eb34bb9', '1158920d-41cb-49f9-9e64-af28e6b3270d',
  '8a78c00b-51a2-4a41-a041-764b3abddb2a', 'b8b4db11-f853-40b7-88f2-044fc9cb434b', '34043c1d-0685-4928-9f61-1f0a8f92d9c4', '9a2c1080-bc41-4f12-aebb-6922009c12f8',
  'a3dd961a-9c29-48c9-9e95-077731b34e05', 'fc1c8511-bdd4-4811-a6a7-725992024a1e',
]);

const NHP10425 = photos('23454/510', [
  'b8165386-a672-45bb-8828-d4731d08df7a', '15ae4cda-d8b1-49a0-8100-31f702d81409', '32488f24-84a8-410f-afb2-ac9d59cb35cb', '82bbcba9-7959-4770-855c-6bb52ace2fe0',
  'd3827ea9-f99f-43b9-947f-04f93130ed3e', '0db06df7-5343-4aef-ad5c-12973bec5e4a', '9287eb48-ca47-4cc9-b3d4-9a6c4e8fcaa7', 'e01cafeb-bd72-4a94-a6c7-525f60272825',
  'ae26028f-defb-4846-b800-b76be5cd8240', '3f84bc9e-a32a-446d-808c-c43028021b64', '4ee3fed9-0771-4632-a418-cd53e303dc73', '9bd0e7dd-c02b-42b4-9d51-07c9d6ea4bc6',
  '836fe37f-4b5a-44c9-a6d3-ebfcc493ac57', '6acde776-b31a-45bb-9d13-f0cf245b1d4b', 'f5a16f70-5f26-44f1-8023-c656cc7f2260', 'fc05b78e-004f-4019-9a09-cbdb00e6e6a1',
  'dba84ff8-0253-4a90-96ee-dd586efe708a', '21799960-835a-41d4-88a9-94a0e854f5b8', 'c259ac06-f621-4a83-a680-124bee1051fc', 'de5d14af-8f7d-4265-bfe2-cdebefe7cd69',
  '8b84e0d4-3641-4951-84cd-815cfae83215', 'a012b6ce-5dc8-4804-b6e1-9f6bc425a95f', '701fc21e-d4f6-4bb1-9363-3bfd65251051', '91450e96-c2bd-4892-bc2b-f861c3026cff',
  '6a084664-0c97-49f5-8610-65a796c4b834', '138ea334-d716-4184-b24f-c767778bd964', '0fdbdb12-f13d-4e5c-b161-c29e27d48642',
]);

const XATS327_2017 = photos('23546/187', [
  '9ba86cb7-011c-4a39-8d9c-0f3d75a9c96e', '20ff8612-e719-4365-b21e-2ad2c2dcc923', 'd6f894c1-726e-4d84-aafc-14af2236b975', '547940b0-a030-4b45-ab8f-4d3012d49f2b',
  '6d43073f-6a08-415d-8c54-b2005e038b47', 'd8c0e94f-84d6-43c1-85a8-c46ebc83e99d', '25d4ff85-ef2c-4f0c-b743-25b66c7cddf1', 'b6f6490c-a6fe-4a3e-8ff1-e3968573b7bf',
  'd83e8575-aca9-4a37-a99c-70a9a338ec70', 'dae89565-8da7-4bb5-b66a-c6e6daed60b3', 'c6e620bb-7069-4629-a43a-c0d657fe9066', '0a036cfe-c72d-4298-8966-7ecfb7bbbae9',
  'aea969d1-0f6a-44e4-a280-b284f37b3142', 'da4e7269-a747-4f8d-9c1e-c5018e3f5025', '478f0a07-fc28-4c9f-8cc4-43fde8d3f1f6', 'b8e102e2-f867-4830-889b-91b52449f42e',
  'b47de89f-8d93-4420-bf00-cfd2f14121d0', '81bc3834-2195-4e3b-a24e-92f66d635cfc', '599c0bb4-9109-4101-83c7-d6dd907f0ae2', '742834f1-e9ca-41e5-af86-cb2ea310bcb9',
  'eaa8f716-07fa-4657-939c-021be8c19011', '91b67cef-f8fa-4aae-a080-c94751ae45e5', '44a84baf-79fb-4460-8720-5cc8eaca345f', '33a891c4-18d7-427d-b589-14d9f391b8c2',
  '5c4168f3-c785-4321-9635-5604c5fd9bdc', 'ba97708a-fc9d-4c6e-bb6a-e3c842c07fea', '92658e70-bd8b-413a-980b-a556e1fa71e7', 'a8d7ae73-0c4a-4948-b541-a005d630bf14',
  '639ddf99-5b13-426c-a3f6-a3d099ec871a', 'fadbd652-9c55-4249-8e2d-38bdbe1970bc', '17d89013-0d5c-4f15-aceb-7b43cad36eb0', '26f8a95f-de8f-402e-8c70-ed92d588c254',
]);

const XATS327_2018 = photos('23546/188', [
  '7f9b4466-28be-41a4-a356-bdbb2aade1b4', '6e297594-610a-46b7-9679-7c59cb530225', '2a0fe564-dd1e-4897-9da4-f2040646567c', '79048212-c2e2-4fb2-b03e-6b430f0d261b',
  '9610764f-0ee0-4987-8291-356c5c9e9ae3', '3ce24644-b0e3-4213-b25e-553610b5bedf', '91625a8c-b5c9-4d7b-9ba5-1042a10871b5', 'ba859c37-6586-47ea-8f82-7d324f5aa112',
  '2f53d331-2eff-4ed1-aaf7-29332866dba3', 'e8724575-81c0-45ba-a86f-b65baf3a75c3', '0ce5c22d-2e10-40d3-ae06-c1f58fcfcec8', '8a100eb2-35da-4850-a737-29457ff1fe8f',
  'ef2e3e43-fc37-4830-8522-e51fa5c08d4f', '890c14aa-522b-4ddd-851e-9bc511638130', 'e1b23f9c-c632-4973-8cb3-3d7a7e496c14', 'ed61d78e-510f-4ee4-ba24-e713f0d16426',
  'a560a2e4-92d7-4894-affb-6f724d668435', '5877bcc8-0328-4ea6-8ba1-846f2c2dd37d', '836abadf-6178-4170-b7e0-7a7b88661657', '6dec2b6c-6d26-486a-9769-60fac5c7f5be',
  'b4dae5dc-2e23-448e-899c-9accb53291ed', 'def1aab8-8700-4c22-ba19-9878ca64bb22', 'af7fca1b-22a9-4c63-9fc3-26b2ec356cad', 'ac5e9313-a825-495f-a9ee-bd516406ed8f',
  '690ed3a9-6fd9-4e42-9ad2-e91efa2b1ee6', '60509eab-2775-4ba8-99a8-636b2330d91b', '649ef649-cf8c-406c-a3e7-3048f45332c4', '311200b8-df6f-4405-93a6-b88a363858de',
  '4df6ea02-d236-403b-9b4f-ebf0ce44623b', 'c505cb66-15e5-41fd-ab1f-38bfb8a5190c', '510de67b-5a98-4038-b5f3-9c49734b087f', '7e115c28-738e-41d6-ae12-33b95a45382c',
  '78c9d222-ac5e-4062-95bf-0254027ac25a', '35a0a4d9-5cbc-42a0-b3ec-9a6634a1199f', '841d93ee-85d2-4b90-8839-244130559681', 'f1a971ed-309f-41a3-89b3-f37f0bb5e3f5',
  '7b29e168-a488-4ad2-8cae-6c6ebf1c0d60', 'ff293388-f758-4cd0-919e-d10e9bfe264c', '66f83ef5-337c-429e-a21e-b41db2acda11', '2650e1e3-7b09-4bf4-b0c7-ccb75061caa4',
  'acec835e-3b65-4a53-85b0-b0ac4e0b09b4',
]);

const D14115 = eaPhotos('auction-1053', '200320504', [
  '6d0c6c5c4fcc4a9f934cf785f33d1c99', '9845fc62a78e4271bf6aec2acbadfebf', '1d21e241d5654ba499a297a6c5db5aa4', 'c63bb5b144aa4e61863a73d9b74110d0',
  '5ca86531d2fa42269cde725f9b52e719', '1f177cc082554c65900d10d692a13427', '8d15f769212341ba97c94f2e85dc54a6', 'cdac3539941f4b8d94b4f7bbc458e299',
  '89f6255107544187a02ec126b7049aef', '60ca604d0c05483691d7e1b57e7bc9f7', '1e2c09f889e041328494c2adc3c60558', 'dcacadae93514b44b2a34a651975884f',
  '01ddb69755344b14be61508f84526679', 'fc8ecd789987473d8c2bf5d00f861867', '776c5f7e0e8d4afcb833bfb53575f2d6', '9bd2bfd34139433999f869151325002e',
  'd66d11843dd64bd2b427e4e38a94bdde', '5e7efc2499b5422c84fed6fac7966e93', '58497ba1dc1d4eb99585c84dabdef1a2', 'd86c7c97e1f64daf99b04fbda43e6c97',
  '4ba572e41aaf444c934d2c183ffd9053', '1c1d2a0e1ee54b83a44a852251706148', 'cc90e9e23ab64256b5ef2a58b5959e31', 'd587a14809b94f9aa45ffd282d13fe5b',
  '6a8e836b327c46ad95e8cb77c31bc698', '54614c3fca9943538a5d9e2fc3e6d380',
]);

const D10174 = eaPhotos('auction-1050', '140569349', [
  '99f6bb0070fa4c96b7e893f62660a4f2', '8a9ff05bfb4542789b9e7072caef7411', '755c38ffa3814ee28c31ef3eb2014532', '75944cd3e7844cf6be646f953a5d45ea',
  '05d2e3d2f51a4de29f9c94abd2299a26', '53bbf1f28861487792ddd57b0d9e1172', '17bd811663b24b23b0093c5106d0cb8d', '494e7d977ba2423984600554f8ca2f8d',
  '890abd22e802427197d72742e46a8d61', 'e5614bb6e85f49729178d183bb00433a', '4a831036acf2476f9062459d06173490', 'f29bb6903093456f982eb1d486e70871',
  '4397fc3365a24af0a9db702ce50c3529', '48fd4513c64142ac95c6882993db8856', '1fc7684e491e4f51be2a730e306d5678', '24788fad76bd4193b1bbc28206d37ffe',
  'd48850e921f247c6889d6f8b1d6cd614', '490668e4781d4731b314ef309537b8b3', '92976306e4e747a4a7239d688828e2dd', 'eda9f0085c964efd8512700a32118363',
  '0810961aae3f45559056e4d70c0a4c77', '0a46642c985c4604ac104f974cb39fb9', '3f0706fdc933446faeaae3ec2c84a486', 'b5957956eeac4892929e91d5d7b4cbf1',
  '15c49236c9be4f26b2c3d1a715b74349', '5d00a823d0a247799588b39ec51fc0ac', 'f347b5ca2b534bd6a481817fd4637b0a', '2f1742d644a44928bd33b43b7235ff1a',
  'd5d8e631e0f24d1f8291daecf063f8b2', 'f97a65aa07244b6cbf58f61f4883dfd8', 'b011938d63eb421a980c83d60da4ebd8', 'a2e66490e81e4990837863fa62538a6a',
]);

const RB = 'https://www.rbauction.com/pdp/';
const lot = (l: Omit<AuctionLot, 'unused' | 'inoperable' | 'category' | 'img'> & { gallery: string[] }): AuctionLot => ({
  ...l,
  category: 'energy',
  unused: false,
  inoperable: false,
  img: l.gallery[0],
});

EUROPE_LOTS.push(
  lot({
    auction: 'rb-france-dec', lot: '', item: '16237725',
    title: 'Пересувний компресор Kaeser M250, 12 бар, 25 м³/хв',
    original: '2018 Kaeser M250 25 m3/min Mobile Air Compressor',
    year: 2018, hours: 3252,
    specs: 'дизельний гвинтовий компресор на одновісному причепі: робочий тиск 12 бар, продуктивність 25 м³/хв, двигун 6 циліндрів (потрібен AdBlue). На огляді аукціону двигун запускається, компресор набирає тиск. Без документів',
    engine: '6 циліндрів, 215 кВт (290 к.с.)',
    location: 'Авіньйон, Франція', endsAt: 1796310000000, live: false, gallery: M250,
    url: RB + '2018-kaeser-m250-25-m3-min-compresseur-a-air-1-essieu-s-a-air-compressor/16237725',
  }),
  lot({
    auction: 'rb-france-dec', lot: '', item: '16288100',
    title: 'Пересувний компресор Atlas Copco XAHS 347, 12 бар, ≈20 м³/хв',
    original: '2010 Atlas Copco XAHS347CD Air Compressor',
    year: 2010, hours: null,
    specs: 'дизельний гвинтовий компресор на причепі: робочий тиск 12 бар, продуктивність за паспортом моделі 20,4 м³/хв, двигун Caterpillar C7. Аукціон його не запускав. Без документів',
    engine: 'Caterpillar C7, 186 кВт (250 к.с.)',
    location: 'Ніволя-Вермель, Франція', endsAt: 1796310000000, live: false, gallery: XAHS347,
    url: RB + '2010-atlas-copco-xahs347cd-compresseur-a-air-air-compressor/16288100',
  }),
  lot({
    auction: 'ea-dormagen-dec', lot: '', item: '200320504',
    title: 'Пересувний компресор Doosan 14/115, 14 бар, ≈11 м³/хв',
    original: 'Doosan 14/115 600CFM Single Axle Compressor (No Wheels)',
    year: 2009, hours: null,
    specs: 'дизельний гвинтовий компресор: робочий тиск 14 бар, продуктивність за паспортом моделі 11,3 м³/хв (в описі аукціону вказано 600 cfm, перевіряємо за табличкою). Продається без коліс — під встановлення на свій причіп або раму. Рік за серійним номером',
    engine: 'John Deere, 129 кВт (173 к.с.)',
    location: 'Дормаген, Німеччина', endsAt: Date.UTC(2026, 11, 3), live: true, gallery: D14115,
    url: 'https://www.euroauctions.com/en/equipment-search/product/200320504/0/misc/compressors/doosan-14-115-600cfm',
  }),
  lot({
    auction: 'ea-leeds-nov', lot: '6986', item: '140569349',
    title: 'Пересувний компресор Doosan 10/174, 10 бар, ≈17 м³/хв',
    original: '2019 Doosan 10/174 590CFM Single Axle Compressor',
    year: 2019, hours: null,
    specs: 'дизельний гвинтовий компресор на одновісному причепі: робочий тиск 10 бар, продуктивність 17 м³/хв (600 cfm), вага 2,5 т',
    engine: 'Cummins QSB6.7, 168 кВт (225 к.с.)',
    location: 'Лідс, Англія', endsAt: Date.UTC(2026, 10, 27), live: true, gallery: D10174,
    url: 'https://www.euroauctions.com/en/equipment-search/product/140569349/0/misc/compressors/2019-doosan-10-174',
  }),
  lot({
    auction: 'rb-ocana-nov', lot: '35', item: '16292337',
    title: 'Пересувний компресор Ingersoll Rand 10/370, 10 бар, ≈37 м³/хв',
    original: '2011 Ingersoll Rand 10/370 Air Compressor',
    year: 2011, hours: 7015,
    specs: 'великий дизельний гвинтовий компресор на причепі: робочий тиск 10 бар, продуктивність за паспортом моделі 36,8 м³/хв (1300 cfm), двигун Cummins, 6 циліндрів. На огляді аукціону двигун запускається. Без реєстраційних документів',
    engine: 'Cummins QSX15, 380 кВт (510 к.с.)',
    location: 'Оканья, Іспанія', endsAt: 1795594450000, live: false, gallery: IR10370,
    url: RB + '2011-ingersoll-rand-10-370-air-compressor/16292337',
  }),
  lot({
    auction: 'rb-benelux-dec', lot: '', item: '16220470',
    title: 'Пересувний компресор Ingersoll Rand NHP 10/425, 10 бар, ≈42 м³/хв',
    original: '2007 Ingersoll Rand NHP10425 Mobile Air Compressor',
    year: 2007, hours: 3978,
    specs: 'дизельний гвинтовий компресор на причепі з дишлом під петлю: робочий тиск 10,3 бар, продуктивність за паспортом моделі 42,5 м³/хв (1500 cfm). На огляді аукціону двигун не запускали, тому стан перевіряємо до ставки',
    engine: 'Cummins QSX15, ≈440 кВт (600 к.с.)',
    location: 'Зевенберген, Нідерланди', endsAt: 1796223600000, live: false, gallery: NHP10425,
    url: RB + '2007-ingersoll-rand-nhp10425-mobile-air-compressor/16220470',
  }),
  lot({
    auction: 'rb-france-dec', lot: '', item: '16288101',
    title: 'Пересувний компресор Atlas Copco XATS 327, 10 бар, ≈19 м³/хв',
    original: '2017 Atlas Copco XATS327 Air Compressor',
    year: 2017, hours: null,
    specs: 'дизельний гвинтовий компресор на причепі: робочий тиск 10,3 бар, продуктивність близько 19 м³/хв, двигун 4 циліндри (потрібен AdBlue). Аукціон не тестував: акумулятор від’єднаний. Без документів',
    engine: 'Mercedes-Benz, 4 циліндри (потужність уточнюємо за табличкою)',
    location: 'Ніволя-Вермель, Франція', endsAt: 1796310000000, live: false, gallery: XATS327_2017,
    url: RB + '2017-atlas-copco-xats327-compresseur-a-air-air-compressor/16288101',
  }),
  lot({
    auction: 'rb-france-dec', lot: '', item: '16288102',
    title: 'Компресор Atlas Copco XATS 327 на рамі, 10 бар, ≈19 м³/хв',
    original: '2018 Atlas Copco XATS327 Skid-Mounted Air Compressor',
    year: 2018, hours: null,
    specs: 'дизельний гвинтовий компресор на рамі (без причепа): робочий тиск 10,3 бар, продуктивність близько 19 м³/хв, двигун 4 циліндри (потрібен AdBlue). Аукціон не тестував: акумулятор від’єднаний',
    engine: 'Mercedes-Benz, 4 циліндри (потужність уточнюємо за табличкою)',
    location: 'Ніволя-Вермель, Франція', endsAt: 1796310000000, live: false, gallery: XATS327_2018,
    url: RB + '2018-atlas-copco-xats327-skid-mounted-compresseur-a-air-air-compressor/16288102',
  }),
);

// Усі компресори для сторінки /kompresory-z-yevropy
export const COMPRESSOR_ITEMS = new Set(EUROPE_LOTS.map((l) => l.item));
