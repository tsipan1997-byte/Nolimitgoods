// Пікапи, позашляховики і вантажівки з аукціону Euro Auctions у Лідсі (25 листопада 2026).
// Зібрано 18.11.2026 з каталогу аукціону. Ставки змінюються — актуальну називає менеджер.
// Формат рядка: [категорія, ID лота, шлях до фото, назва англ., опис англ.]

import type { AuctionLot } from './auction-lots';

type Raw = ['pickups' | 'trucks', string, string, string, string];

const RAW: Raw[] = [
  ['pickups', '140571533', '140571533/c051ed6b93624576a2c3b55c80bd8f26', '2026 Toyota Hilux Invincible', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors (Meter Reading: 87 Miles)'],
  ['pickups', '140544858', '140544858/6f4cd7bf4cd64ac095720f585567db1b', '2024 Toyota Hilux Invincible X', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors (Meter Reading: 42848 Miles)'],
  ['pickups', '140567396', '140567396/2a72c8ed4df74b4c8b170a871b272a1e', '2023 Toyota Hilux Invincible X', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Reverse Camera, Parking Sensors, Canopy'],
  ['pickups', '140570585', '140570585/7546f61ac6974eac8ccb4d212047612d', '2023 Toyota Hilux Active', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Parking Sensors, Truckman Canopy'],
  ['pickups', '140572449', '140572449/fe17b83bdce144aca6275f007eff9813', '2023 Toyota Hilux', '4WD Auto Crew Cab Pickup, Cruise Control, Climate Control, Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter (Meter Reading: 22972 Miles)'],
  ['pickups', '140567733', '140567733/8986a54e9dc140e98f738774ae2401a7', '2022 Toyota Hilux Active', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Pro Top Canopy'],
  ['pickups', '140573529', '140573529/617435b66fb548d6a02a2d61f70d5040', '2019 Toyota Hilux Invincible X', '4WD Auto Crew Cab Pickup, Cruise Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Aeroklas Canopy (Category S Insurance Loss)'],
  ['pickups', '140577111', '140577111/a341ba058c0149318d76751cdc6b7907', '2019 Toyota Hilux Invincible', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Reverse Camera'],
  ['pickups', '140576917', '140576917/1a80df211ca542ad99457d0d841c0214', '2018 Toyota Hilux', '4WD 6 Speed Crew Cab Pickup, Reverse Camera, Pro Top Canopy (Category N Insurance Loss)'],
  ['pickups', '140574254', '140574254/138caeb395d74b09bbb731f8b7ced541', '2017 Toyota Hilux Invincible', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140566979', '140566979/24182c1591cc465d95032e9e48639120', '2016 Toyota Hilux Invincible', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Sat Nav, Full Leather Heated Seats, Reverse Camera, Parking Sensors'],
  ['pickups', '140575951', '140575951/c45463b7f8ae4d61ac787747755c2c68', '2015 Toyota Hilux', '4WD 5 Speed Crew Cab Pickup'],
  ['pickups', '140574449', '140574449/26087251355041e0847ea6c21b35bb38', '2013 Toyota Hilux Invincible', '4WD 5 Speed Crew Cab Pickup, Cruise Control, Canopy'],
  ['pickups', '140576825', '140576825/41442dae950c40a5a56887d0fdf2b650', '2012 Toyota Hilux', '4WD 5 Speed Crew Cab Pickup, Canopy'],
  ['pickups', '140576913', '140576913/94b8ec81cb6345159a6c7d862c64ce25', '2010 Toyota Hilux Invincible', '4WD 5 Speed Crew Cab Pickup, Cruise Control'],
  ['pickups', '140570379', '140570379/bdcea89542f54a319e1868249cdcbbba', '2008 Toyota Hilux', '4WD 5 Speed Pickup'],
  ['pickups', '140576826', '140576826/7cfa53453df84d71965e90da69c5e157', '2005 Toyota Hilux D4D', '4WD 5 Speed Crew Cab Pickup'],
  ['pickups', '140568545', '140568545/201067a4c3af489dafae93c648f16e9a', '2023 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Half Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Truckman Canopy'],
  ['pickups', '140567428', '140567428/d7d0b67bd36347db9b3639945f21b52a', '2021 Ford Ranger', '4WD Auto Crew Cab Pickup, Cruise Control, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors (Engine Fault)'],
  ['pickups', '140569529', '140569529/7565c3bdd6ce4d65bacfd0ff57904aa6', '2020 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140569522', '140569522/1b95bfddf9a1493fa9cca9b5cae8f03a', '2020 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Reverse Camera, Parking Sensors, Roller Shutter (Parts Missing)'],
  ['pickups', '140576285', '140576285/e87c36e901144a12a3754ab3763cee4d', '2019 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Half Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140577045', '140577045/370e480d5dee47be946b37903ac873b7', '2019 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Climate Control, Half Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Truckman Canopy'],
  ['pickups', '140577060', '140577060/1a5627826b244dcbbb364224db071704', '2019 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Half Leather Electric Heated Seats, Reverse Camera, Parking Sensors'],
  ['pickups', '140567855', '140567855/661c105f0a774aa2a086ae8fb3cf17b8', '2019 Ford Ranger', '4WD 6 Speed Pickup, Cruise Control (Non Runner)'],
  ['pickups', '140568905', '140568905/0e64c0264f954f43938eca69e274605b', '2018 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Reverse Camera, Parking Sensors, Aeroklas Canopy (Non Runner & No Key)'],
  ['pickups', '140566941', '140566941/ee166ddf39d54122aee578a0a06a1377', '2017 Ford Ranger Wildtrak', '4WD Auto Crew Cab Pickup, Cruise Control, Climate Control, Reverse Camera, Parking Sensors, Roller Shutter (Non Runner)'],
  ['pickups', '140574159', '140574159/3de8d67d5d1d459c9f54013eb274df62', '2017 Ford Ranger', '4WD 6 Speed Pickup (Engine Issues)'],
  ['pickups', '140567219', '140567219/686b37cb14144aa0a38f0072d67f1c46', '2016 Ford Ranger', '4WD 6 Speed Pickup, Canopy'],
  ['pickups', '140572094', '140572094/6a9a2a52106a43df9977d33847c56a57', '2015 Ford Ranger 2.2', '4WD 6 Speed Crew Cab Pickup, Cruise Control'],
  ['pickups', '140569937', '140569937/c077e9bbcdc14ecc8903c71cddccc98d', '2014 Ford Ranger', '6 Speed Pickup'],
  ['pickups', '140573421', '140573421/ebf13f920499444caa964c42e06b6ff7', '2005 Ford Ranger', '4WD 5 Speed Crew Cab Pickup'],
  ['pickups', '140574470', '140574470/5508e8a425144247ae2ff673ea1a16b7', '2020 Mitsubishi L200 Warrior', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Reverse Camera, Pro Top Canopy'],
  ['pickups', '140566751', '140566751/de15e2dbc3434007a6cb9f20c1a4cdf9', '2019 Mitsubishi L200 Barbarian', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Truckman Canopy'],
  ['pickups', '140570922', '140570922/27bfd5ce14f74186a49a6b70d69e1a71', '2019 Mitsubishi L200 4Life', '4WD 6 Speed Pickup'],
  ['pickups', '140570341', '140570341/4337b211d31a4bf89854c747747176f9', '2018 Mitsubishi L200', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Hard Top'],
  ['pickups', '140568128', '140568128/7b2b9286caf845bcb11c2359384b3ede', '2018 Mitsubishi L200 4Life', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Roller Shutter'],
  ['pickups', '140569858', '140569858/d681c514b2ce4126b0e87b2b19dcb988', '2018 Mitsubishi L200 4Life', '4WD 6 Speed King Cab Pickup, Tipping Body'],
  ['pickups', '140574520', '140574520/be0b11793a8a450f980b98524e1c717d', '2022 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, 360 Camera, Parking Sensors, Truckman Canopy'],
  ['pickups', '140571584', '140571584/c70601e27b8647839a0f674a86a87a80', '2021 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, 360 Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140571585', '140571585/369f308895d8472e952dd55f67875f38', '2021 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140575305', '140575305/e1cde3bfae2343b3bf01d722f43785f0', '2021 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, 360 Camera, Parking Sensors, Truckman Canopy'],
  ['pickups', '140575360', '140575360/820fcb3248fd4a7d8cd8d43624168b57', '2021 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, 360 Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140576995', '140576995/45fe8eab987a41d0b720c4e199302dc9', '2021 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140570352', '140570352/26af189f335244f7ba8844b80dce1b6a', '2019 Nissan Navara', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Roller Shutter'],
  ['pickups', '140574304', '140574304/6b4929893ce94f30a9ff9c4c97b9e10b', '2012 Nissan Navara', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Full Leather Electric Heated Seats, Truckman Canopy (Category N Insurance Loss)'],
  ['pickups', '140575008', '140575008/ac7de306b11a4c1282817bb648fc8392', '2012 Nissan Navara', '4WD Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Canopy'],
  ['pickups', '140573729', '140573729/05d579af28d84e239ce8ff993a12b8bb', '2008 Nissan Navara', '4WD 6 Speed King Cab Pickup, Cruise Control, Climate Control'],
  ['pickups', '140569935', '140569935/3fa28b687dad4f35b0437222902d4eea', '2022 Isuzu D-Max', '4WD Auto Crew Cab Pickup, Cruise Control, Electric Heated Seats, Parking Sensors, Roller Shutter'],
  ['pickups', '140566944', '140566944/45df84bc409a44329079546974a551e8', '2021 Isuzu D-Max V-Cross', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Truckman Canopy'],
  ['pickups', '140576707', '140576707/f0c294dcc0784829898a9c6442046c86', '2017 Isuzu D-Max', '4WD 6 Speed King Cab Pickup, Reverse Camera, Strongs Canopy'],
  ['pickups', '140568360', '140568360/16f3718b11bf447d9df3382d8d60d250', '2016 Isuzu D-Max', '4WD 6 Speed Crew Cab Pickup, Cruise Control, Full Leather Electric Heated Seats, N&J Canopy (DVLA Scrapped Marker)'],
  ['pickups', '140576862', '140576862/bc052998809c4ac8ada282ae63270f61', '2016 Isuzu D-Max', '4WD 6 Speed King Cab Pickup, Pro Top Canopy'],
  ['pickups', '140575741', '140575741/9decf5d9006f423eaad8fad267650f85', '2015 Isuzu D-Max', '4WD 6 Speed King Cab Pickup'],
  ['pickups', '140554278', '140554278/8a79a7bc58374b0a8286511b69445d60', '2024 Volkswagen Amarok', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Full Leather Electric Heated Seats, 360 Camera, Parking Sensors, Mountain Top Roller Shutter (Meter Reading: 49719 Miles)'],
  ['pickups', '140576867', '140576867/f218db8308494357b8247bafc4c0d43f', '2020 Volkswagen Amarok V6 TDI 4Motion', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Full Leather Electric Heated Seats, Reverse Camera, Parking Sensors, Mountain Top Roller Shutter'],
  ['pickups', '140572826', '140572826/098451fd471746a598124885f281822c', '2015 Volkswagen Amarok TDI Bluemotion', '4WD Auto Crew Cab Pickup, Sat Nav, Climate Control, Full Leather Heated Seats, Parking Sensors, Hard Top'],
  ['pickups', '140574122', '140574122/acacd7b1ebf0403db770578862a3a81f', '2019 Mercedes X250D 4Matic', '4WD Auto Crew Cab Pickup, Cruise Control, Sat Nav, Climate Control, Reverse Camera, Parking Sensors, Roller Shutter'],
  ['pickups', '140567706', '140567706/3ed3eb3e5f2d49468de360e1f92d4a5d', '2026 Land Rover Defender 90', 'D250 MHEV 4WD Auto, Cruise Control, Sat Nav, Climate Control, Half Leather Heated Seats, 360 Camera, Parking Sensors (Meter Reading: 3577 Miles)'],
  ['pickups', '140573114', '140573114/380d03fd39694fcf95aadc0b4cfe5775', '2023 Land Rover Defender 90', 'D250 MHEV 4WD Auto, Cruise Control, Sat Nav, Climate Control, Half Leather Heated Seats, 360 Camera, Parking Sensors'],
  ['trucks', '140567362', '140567362/7a222f5c89de46b9a417d143f8659f52', '2024 DAF XD410', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Digital Wing Mirror System, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140571038', '140571038/337ebd59dd7c43a1aa5dcf9f089a4fdb', '2021 Scania G450XT', '8x4 Tipper Lorry, Abba Body, Easy Sheet, 3 Way Camera, Automatic Gearbox'],
  ['trucks', '140571040', '140571040/04a832845e154468a86911563ba38c16', '2021 Scania G450XT', '8x4 Tipper Lorry, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140571967', '140571967/0718ebe124364fe2a65d781097d678e8', '2021 Scania P410XT', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, 3 Way Camera, Automatic Gearbox'],
  ['trucks', '140572030', '140572030/eb1b9de50eab4057826bcb5d9cab0e28', '2021 Scania P410XT', '8x4 Tipper Lorry, Steel Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140571158', '140571158/e1edbdfbb7fa4f008b4d6c0d15d3dd8d', '2021 MAN TGS 35.430', '8x4 Tipper Lorry, Boweld Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140574872', '140574872/b5d8babf3ef743528ce3143378bf0f0c', '2019 Volvo FMX', 'Euro 6, 8x4 Tipper Lorry, Thompsons Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140574873', '140574873/79449c63f6b04d11b97600f8af69611f', '2019 Volvo FMX 460', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140573454', '140573454/5961340a11584067b73276e5ff018565', '2019 Volvo FMX420', '8x4 Tipper Lorry, Boweld Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '100379573', '100379573/709a169c4b464df88d83ce58183639c9', '2019 Scania P410XT', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Reverse Camera, On Board Weigh Scales, Automatic Gearbox'],
  ['trucks', '140574156', '140574156/b973cad04a684ec6bcb23e3451bca685', '2019 Scania P410XT', '8x4 Tipper Lorry, Wilcox Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140574499', '140574499/ecf5a6f7400e4284ba2e3d36e2425d58', '2019 Scania P410XT', '8x4 Tipper Lorry, Insulated Wilcox Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140568687', '140568687/3775f3d4d5ec416b9c599bd317d8fc41', '2019 DAF CF450', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Reverse Camera, Manual Gearbox'],
  ['trucks', '140567189', '140567189/2389b49058064fa28a414787a998ac9f', '2018 DAF CF450', '8x4 Tipper Grab Lorry, Kelberg Body, Palfinger M125L Hydraulic Crane, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140576864', '140576864/96b807783c604846a4f8c14794876e8c', '2018 DAF CF 450', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140575523', '140575523/236c4bb5413a4fe48b9112e786425b77', '2018 Volvo FM420', 'Euro 6, 8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140576818', '140576818/a5dc6eb2a1424294b7c839a5b1ee06bf', '2018 Scania P410', '8x4 Tipper Lorry, Charlton Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140576691', '140576691/6bcdda9ae6b048fdb033fb4e5086433f', '2018 Mercedes 3240', '8x4 Tipper Lorry, Abba Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140571308', '140571308/11038a5ec79a4fb5870174e2ba104000', '2017 Volvo FMX420', 'Euro 6, 8x4 Tipper Lorry, Wilcox Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140571309', '140571309/06ed22cf1b154ab2b05069b117cb67e4', '2017 Volvo FMX420', 'Euro 6, 8x4 Tipper Lorry, Wilcox Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140572721', '140572721/a1c93d5fbdac4f0d9ac1392d45053fe9', '2017 Volvo FMX420', 'Euro 6, 8x4 Tipper Lorry, Thompsons Body, Easy Sheet, 3 Way Camera, Automatic Gearbox'],
  ['trucks', '140572727', '140572727/eda24bb045684641b4432ff97345ddd5', '2017 Volvo FMX420', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, 3 Way Camera, Automatic Gearbox'],
  ['trucks', '140573929', '140573929/3032239332c9401abd93004ab9bd839d', '2017 Volvo FM420', '8x4 Tipper Lorry, Thompsons Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140572335', '140572335/2230d56a159d4e93b56155338225207b', '2016 Volvo FM410', 'Euro 6, 8x4 Tipper Lorry, Steel Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140577040', '140577040/434eda75ae63410087fef83917e5aede', '2016 Volvo FMX 420', '8x4 Tipper Lorry, Steel Body, Easy Sheet, 360 Camera, Automatic Gearbox'],
  ['trucks', '140574446', '140574446/bb9b2aee4cb64d4398a4644365d2cdee', '2015 Scania P450', '8x4 Tipper Lorry, Boweld Body, Easy Sheet, Reverse Camera, Manual Gearbox'],
  ['trucks', '140572338', '140572338/74b8678a9e52462386e68b0b29ace244', '2014 Volvo FMX410', '8x4 Tipper Lorry, Boweld Body, Easy Sheet, Reverse Camera, Automatic Gearbox'],
  ['trucks', '140570742', '140570742/4ec53f4927d145a782976aec08956f17', '2011 Scania P360', '8x4 Tipper Grab Lorry, Bickford Body, Palfinger M125L Hydraulic Crane, Reverse Camera, Manual Gearbox'],
];

// Переклад типових фраз з каталогу
const PHRASES: [RegExp, string][] = [
  [/D250 MHEV 4WD Auto/i, 'дизель D250 mild-hybrid, 4WD, автомат'],
  [/4WD Auto/i, '4WD, автомат'],
  [/4WD (\d) Speed/i, '4WD, $1-ст. механіка'],
  [/(\d) Speed/i, '$1-ст. механіка'],
  [/Crew Cab Pickup/i, 'подвійна кабіна'],
  [/King Cab Pickup/i, 'полуторна кабіна'],
  [/Crew Cab/i, 'подвійна кабіна'],
  [/\bPickup\b/i, 'пікап'],
  [/Full Leather Electric Heated Seats|Full Leather Heated Seats|Half Leather Electric Heated Seats|Half Leather Heated Seats|Electric Heated Seats|Heated Seats/i, 'шкіра / підігрів сидінь'],
  [/Climate Control/i, 'клімат-контроль'],
  [/Cruise Control/i, 'круїз-контроль'],
  [/Sat Nav/i, 'навігація'],
  [/360 Camera/i, 'камера 360°'],
  [/3 Way Camera/i, '3 камери'],
  [/Reverse Camera/i, 'камера заднього виду'],
  [/Parking Sensors/i, 'парктроніки'],
  [/Roller Shutter|Mountain Top Roller Shutter/i, 'ролета на кузов'],
  [/Canopy|Hard Top/i, 'кунг на кузов'],
  [/Tipping Body/i, 'самоскидний кузов'],
  [/8x4 Tipper Grab Lorry/i, 'самоскид 8x4 з грейфером'],
  [/8x4 Tipper Lorry/i, 'самоскид 8x4'],
  [/Palfinger M125L Hydraulic Crane/i, 'кран-маніпулятор Palfinger M125L'],
  [/Easy Sheet/i, 'тент кузова'],
  [/Automatic Gearbox/i, 'АКПП'],
  [/Manual Gearbox/i, 'механіка'],
  [/On Board Weigh Scales/i, 'бортові ваги'],
  [/Euro 6/i, 'Євро-6'],
];

const DROP = /Body$|Digital Wing Mirror|Insulated/i;

function translate(desc: string): { specs: string; miles: number | null; inoperable: boolean; damaged: string | null } {
  const miles = Number((desc.match(/Meter Reading: (\d+) Miles/) || [])[1]) || null;
  const inoperable = /Non Runner|Engine Fault|Engine Issues|Parts Missing|Scrapped/i.test(desc);
  const cat = desc.match(/Category ([SN]) Insurance Loss/);
  const damaged = cat ? `після ДТП (страхова категорія ${cat[1]})` : null;
  const flags: string[] = [];
  if (/Non Runner/i.test(desc)) flags.push('не на ходу');
  if (/No Key/i.test(desc)) flags.push('без ключа');
  if (/Engine Fault|Engine Issues/i.test(desc)) flags.push('несправний двигун');
  if (/Parts Missing/i.test(desc)) flags.push('бракує деталей');
  if (/Scrapped/i.test(desc)) flags.push('позначка DVLA «утилізовано» — на запчастини');
  const parts = desc
    .replace(/\([^)]*\)/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && !DROP.test(s))
    .map((s) => {
      let out = s;
      for (const [re, ua] of PHRASES) out = out.replace(re, ua);
      return out
        .replace(/\b(Truckman|Aeroklas|Pro Top|Strongs|N&J|Mountain Top)\s*/g, '')
        .replace(/([а-яіїє.])\s+(подвійна|полуторна|пікап)/g, '$1, $2')
        .replace(/\s+/g, ' ')
        .trim();
    });
  const uniq = parts.filter((p, i) => parts.indexOf(p) === i);
  return { specs: [...flags, ...(damaged ? [damaged] : []), ...uniq].join(', '), miles, inoperable, damaged };
}

// Живі торги в Лідсі: пікапи й вантажівки йдуть у перший день, 25 листопада
const LEEDS_DAY1 = Date.UTC(2026, 10, 25, 8, 0, 0);

const ALL_VEHICLE_LOTS: AuctionLot[] = RAW.map(([category, item, img, original, desc]) => {
  const year = Number(original.slice(0, 4)) || null;
  const model = original.replace(/^\d{4}\s+/, '');
  const t = translate(desc);
  const kind = category === 'trucks' ? (/Grab/.test(desc) ? 'Самоскид з краном' : 'Самоскид') : /Defender/.test(model) ? 'Позашляховик' : 'Пікап';
  return {
    auction: 'ea-leeds-nov',
    lot: '',
    item,
    title: `${kind} ${model}`,
    original: `${original} — ${desc}`,
    category,
    year,
    hours: null,
    miles: t.miles ? Math.round(t.miles * 1.609) : null,
    specs: t.specs,
    unused: false,
    inoperable: t.inoperable,
    location: 'Лідс, Англія',
    endsAt: LEEDS_DAY1,
    live: true,
    img: `https://images.euroauctionslive.com/auction-1050/${img}.jpeg`,
    url: `https://www.euroauctions.com/en/equipment-search/product/${item}/0/`,
  };
});

// Пікапи в Україні беруть переважно на фронт: потрібні старі й недорогі (до 2017 р. включно)
// або биті / несправні — під відновлення чи на запчастини. Нові праворульні не показуємо,
// крім одного для прикладу ціни.
export const PICKUP_MAX_YEAR = 2017;
const SHOWCASE_PICKUPS = new Set(['140544858']); // 2024 Toyota Hilux Invincible X
const DAMAGED = /Category [SN]|Non Runner|Engine Fault|Engine Issues|Parts Missing|Scrapped/i;

// Фільтр застосовується до лотів усіх аукціонів (див. AUCTION_LOTS)
export const keepPickup = (l: AuctionLot): boolean =>
  l.category !== 'pickups' ||
  SHOWCASE_PICKUPS.has(l.item) ||
  (l.year ?? 0) <= PICKUP_MAX_YEAR ||
  l.inoperable ||
  DAMAGED.test(l.original) ||
  DAMAGED.test(l.specs ?? '');

export const VEHICLE_LOTS: AuctionLot[] = ALL_VEHICLE_LOTS.filter(keepPickup);
