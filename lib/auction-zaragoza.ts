// Екскаватори з аукціону Euro Auctions у Сарагосі (Іспанія), живі торги 10 грудня 2026 (день 1).
// Euro Auctions не входить до Ritchie Bros і не забороняє вивезення в Україну (умови для Іспанії, Німеччини та Великої Британії перевірено 23.11.2026).
// Гусеничні, колісні та міні-екскаватори (68 лотів), до 24 фото на лот. Номери лотів аукціон ще не присвоїв.
// Сторінка: /ekskavatory-z-ispanii

import type { AuctionInfo, AuctionLot } from './auction-lots';

const EA = 'https://images.euroauctionslive.com/auction-1055/';
const photos = (item: string, ids: string[]) => ids.map((id) => `${EA}${item}/${id}.jpeg`);

export const ZARAGOZA_AUCTION: AuctionInfo = {
  id: 'ea-zaragoza-dec',
  house: 'Euro Auctions',
  name: 'Zaragoza Auction',
  place: 'Сарагоса, Іспанія',
  dates: '10–11 грудня 2026',
  format: 'Живі торги + онлайн-ставки',
  totalLots: 2341,
  unreserved: true,
  url: 'https://www.euroauctions.com/en/auctions/zaragoza-10th-11th-december-2026',
  currency: 'EUR',
};

const zgz = (l: Pick<AuctionLot, 'item' | 'title' | 'original' | 'year' | 'hours' | 'specs' | 'unused'> & { gallery: string[] }): AuctionLot => ({
  ...l,
  auction: 'ea-zaragoza-dec',
  lot: '',
  category: 'excavators',
  inoperable: false,
  location: 'Сарагоса, Іспанія',
  endsAt: Date.UTC(2026, 11, 10),
  live: true,
  img: l.gallery[0],
  url: `https://www.euroauctions.com/en/equipment-search/product/${l.item}`,
});

export const ZARAGOZA_LOTS: AuctionLot[] = [
  zgz({
    item: '240091283',
    title: 'Гусеничний екскаватор Hitachi ZX210LC-7',
    original: '2023 Hitachi ZX210LC-7 700mm Pads, CV, QH, Piped, 3Way Cameras, A/C (Copy of Declaration of Conformity Available / Copia de CE Disponible) - HCMDF352V00700170',
    year: 2023, hours: null,
    specs: 'сталеві траки 700 мм, клапани безпеки, швидкозйом, додаткова гідролінія, камери кругового огляду, кондиціонер. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240091283', [
      'bdb6d34ac13c4f60b9ec4a43359ebb80', '6081374fa361470dbb98041c5779789b', 'f9f41ac6141a4722b800eeda00d2d205', '4fef50ea14fa48b59009e3d1c027d8e9', '8ab9e61b1d3e43aba778a909c9d8d50f', '5d5d11eb84e24b1f805b8519cfba1f23', '89c7008530864c9f8a49540b14723fb9', 'dd3f89a017324ee8a70896e81e3a103e', '142726de5a414c5fb80932ca07b003d5', 'a7b1b8c7d82948ff98ede8e61447f6fe', '007ea5b79ccb48e9af03adc953d299e1', '75d264798f184dc1a9594792b4325e39', 'bcd6cbd1bcfc45828861cf48bf90c267', 'ee1148926a5745dca12e5b0579390334', 'b77f6b7028314a0286833f68a2c73328', '4a8180e932c54ee9a4440a5dbd085c4f', '22948196b1414d3abc5e7ab3fde12f51', 'd20d9d36b83044309996cb101e09c859', '0e41df4dc94d43ba98ac16cd77148115', 'a4d08ad32aff4a21ac32ac5f8610a091', '266cd5108fe948569478e5746321a05d', 'b78e5d1b3b1149999c46634ba7a9842b', '6d5ed9ca31724a3dbe6403493fa6dd7a', 'ed0e4a2e19f1486dac357f8258a7ce98',
    ]),
  }),
  zgz({
    item: '240091680',
    title: 'Гусеничний екскаватор Hitachi ZX210LC-7',
    original: '2023 Hitachi ZX210LC-7 600mm Pads, CV, QH, Piped, Aux. Piping, 3Way Camera, A/C (Copy of Declaration of Conformity Available / Copia de CE Disponible) - HCMDF350H00502885',
    year: 2023, hours: null,
    specs: 'сталеві траки 600 мм, клапани безпеки, швидкозйом, додаткова гідролінія, камери кругового огляду, кондиціонер. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240091680', [
      'b10aa68bf7bc46549e5ff0c952badfff', 'fc6c1a21288f42dfa8306ae29d595644', '2b7478f4ccd64970a7f6b065efc0d524', '7d567ab55ae140a4b3576f27cbc47863', '15b519ff40a3408785fdce5faa1c1f55', '0424ba7ea3f24eedbf7c7ed8eb7decc7', '2cf2f2df6d0d46cb972af4d83fdeabff', '285d1e200b504190a88b4d969a776499', '8f764a9725584d34ab33b8ec4b75c22a', '4b5690278a61422dac6667611edf1a33', 'ec460eaa3ce742678dfbffd284f90a24', '6cd777ec7579449d885a922b9528296a', '7e0f7258748c477e91b08ddac2984caa', '076a785f3e304b7297ac06e7ef89c836', '42e192955b364d989d84e312511ec2c8', 'ac7f668d60054d029bf1664ac45f9306', '219d07c1030941179f087f796e75fe75', 'b57bcba865ed43b48d47d3eabc208684', 'f5712a1d76a445fe8eb068a1138e0f7f', '0ac3895e5205498b9135df5568db874d', 'f1851d09f9cc4972ae5d8563895149e3', 'e3221c3a5ea64e04929c8991d23d9e5c', '2efaabc90b444a5081391836fe1c4580', '53956343da1641239958f5f647cfc651',
    ]),
  }),
  zgz({
    item: '240092323',
    title: 'Колісний екскаватор Wacker Neuson 6503-2',
    original: '2015 Wacker Neuson 6503-2 Wheeled Excavator, Offset, CV, QH, Piped, 3 Buckets - WNCE0507APAL00982',
    year: 2015, hours: null,
    specs: 'поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, 3 ковші',
    unused: false,
    gallery: photos('240092323', [
      '0c21ed4d356a4de4a0d8cff7584223fb', 'd70412a5f6004c1db7c433fd6c8dcc93', 'd0c55125f13c4065af20b6148fc2aeaa', '39b3bafe700c46cdab8e242a08e9ea8f', '2c4a848b03c04855a843562afe12c0ab', 'a22264bcb02445d9b8780bf5a6db072a', 'e4dad8ae0cef45acbe2fbc27d0461036', '1d4125d87a124264bbd32b04e6519811', '15ce73ded7fb471faaeb93eeb3de9651', '0c658135431549af82d2d63196a7ef46', '0566275927474d98a99a800f8185c97d', '9009007642cd477ab7bdb29185d260df', '5b530db795e84c93a7c9fdeeee504895', '0158e2e4cf7443e79dc66b7018d3c7ba', '1158fedce0294154a80c3c89b91141ee', 'b45b7bfb06114c98b4039a96d05391eb', 'e8908588b38948669b6d85f1f587518f', '99e7f08318474100897f72063d730f62', '39491e791bce488999b64b8e9484ea07', '99cf969ba0b14e8684e5cf16354f3bf8', 'ea9c3bb6455249dea635efa47472ad81', '0f7187a6a2474c4abfdb6a48086498a7', 'e7edcf2164c84e198e2dec69624ac3ef', '8f068918464f46cf8be9a5db96bb95bf',
    ]),
  }),
  zgz({
    item: '240091392',
    title: 'Колісний екскаватор Volvo EWR130E',
    original: '2022 Volvo EWR130E Wheeled Excavator, CV, QH, Piped, Stabilisers, Bucket - VCEW130ET00320390',
    year: 2022, hours: null,
    specs: 'клапани безпеки, швидкозйом, додаткова гідролінія, опори, ківш',
    unused: false,
    gallery: photos('240091392', [
      'c13d6ceeb09e48b59316c527490d0dc5', '665f4d0e232947daa5a57e22d02eb0af', '9c1b8e61973f4dfd937ffdaff66ca0a0', '0eb8845fd7d24e1ba4de12da12cc2ff1', 'd4ab35b229204b60a2806974175701cb', '9e06dbc8722745649f732977a8bb1df4', '49b1756d91b94ae3aa7b544a9cf49347', '4926273780614a1588a14ce4031fc967', '449b7876223b4555b1477b3c922f576a', '14bd55d177634af3a3a8d232b27e2275', '269474c71f78443c9abc09b25f71ede8', 'dd9d3afd29b64622a32cd6482c17e8a7', '21dd52ab26f84eaaaba440ff76810afa', '3afc0056bba84a3ca1d7773ed6f51106', 'd040fa22d79c4695aeae05318c062687', '90bc0c961de44e53a408a813c531dcb0', '3fdd464f4a254218833a584b4a3fc8fb', '8e3ab1e6c2b64fbcb06c7eff0c181d58', '6e036fea636b4fa6bc552d7cfe153b16', '2f76ad9d8f544f67bb67101dfeaa1393', 'ffa0385bdcba4ea0bac443ac92f658a4', 'bd27ca326fd14649b742d5b5890b8682', 'f5b8e9e9992245a98768967c3efb3e83', '3f344be4a13748fdba580c4906bd90d8',
    ]),
  }),
  zgz({
    item: '240091393',
    title: 'Колісний екскаватор Volvo EWR150E',
    original: '2018 Volvo EWR150E Wheeled Excavator, Blade, CV, Piped, Stabilisers, Piped ,2 Way Camera, Bucket - VCEW150EL00322355',
    year: 2018, hours: null,
    specs: 'відвал, клапани безпеки, додаткова гідролінія, опори, камери заднього і бокового огляду, ківш',
    unused: false,
    gallery: photos('240091393', [
      '8a253f99fbba4decb1082e03671e19ca', 'd460693c581c4af9b58a0f2a7b3b685f', 'b9e621f3178c488da874289dc08ebb12', '5a3f52ec17914e5f93d7e4164f1239c6', '56486c8eab0946eeb9de90df067bfb60', '074848e87d34474791c77c6a414e3ca4', 'a321c1919edd465aab110ec69eaaa4bc', 'acf5d48d21c942448939325687cd6520', 'a9a58163ca814145a3393a28aba6b2dc', 'a59dc579af27416693c7742182b5fddb', '3a9056cbdbd249f6962d4754aa2f5f98', '778a3007af0b4e13b934c04b317fe9de', '0fde2bd5fce24655b1dfdf54b28ab824', '93b81672d3554de7be5f6f36e86ce8df', 'e65c42a59acb48cd8f1b2849d0d956bb', '64e3686bd5f7499fb26bf7e5455a89ff', '9a837c8abca64cfb97ed696a1b3afa23', '9fe57e85be0e4e868dfbd185bf2cb5dd', '9c468360be854e05830ce389056c7f28', 'dc15dc5ff98f4dc1a72a1f5b55177194', '8218943e726f4c82ba71140c9f35dab4', '933931058a8249cbb7af10aeb3b2c74b', '4fc7a6a4d09847f681cd769762c8d808', 'f0bb93afdf0f44faaeb36dfdb3db3967',
    ]),
  }),
  zgz({
    item: '240091394',
    title: 'Колісний екскаватор Volvo EW140C',
    original: 'Volvo EW140C Wheeled Excavator, Blade, CV, QH, Piped, Stabilisers, Bucket - VCEW140CL00120186',
    year: null, hours: null,
    specs: 'відвал, клапани безпеки, швидкозйом, додаткова гідролінія, опори, ківш',
    unused: false,
    gallery: photos('240091394', [
      'bb92b37f92a54b138acb04a1c18cacf3', 'e85f6ff3b74e403a9fd36d55b32da929', '70fb1a56ad8843a1b4026c48edfa5021', '365f9933e8034c06990aab00d43f6005', 'd1d32a9a2c8e4705949aabf291eb87a8', 'e877921179a84420930c22bbf14b779c', '54500ac0a6f34f01ad21932b12da37b1', 'ae4746416f0c4c2980ac3970e60e65c2', 'be5c072f6aab4765acbace117403b668', '8a98fa1f148349a3996135c660064acb', '131cc358872b43c5a8fa8804803ad6b7', '5f80ae48f2a04bdf8ce68c9c71e9a38c', '58cde69900b0492bb788148cefc39fbe', 'c07e68b998a2440b8203d1bb87bb7909', 'bac0142095da4765a00d65b3820ab820', 'bf8a0084bed04de083f855c1c32239e0', 'c6eef8b0b74e47988fcf60a5e7c8bd05', '0ba45e5e344445c6a3e0c2c3c05c5423', '27debb95c4fa411892524cd0a78ad6e1', '0fd9563ebe9a4f0a9b9c5272bb28eb12', '59c30f94c13241db90c3a786bf63964a', '5be80048e49d49a4a069b5562dcef070', '33dd0a232a36449fad4eb91fe31cf08e', 'ac17e9e73e8549c787c812f4d64fd3b9',
    ]),
  }),
  zgz({
    item: '240092983',
    title: 'Гусеничний екскаватор Case CX130D',
    original: '2019 Case CX130D 600mm Pads, Blade, CV, QH, Piped, Aux. Piping, 2 Way Camera - NSU13DBMNZLA14194',
    year: 2019, hours: null,
    specs: 'сталеві траки 600 мм, відвал, клапани безпеки, швидкозйом, додаткова гідролінія, камери заднього і бокового огляду',
    unused: false,
    gallery: photos('240092983', [
      'f7f029682acc4da7a12d885bfdb992f2', '8c84f8be7bdd42dc9bbeec111216e015', '82ae552b5aac4606bb3d6a8aaf170b64', 'c6bde6f0570041828c22f2645007672e', '9ab0dbfe70374af883dca229d083faab', '108300fa54ec4ae89ca7c92d2b1e5167', 'f3aef290e8a545e09848cd205c0d2eac', '9339ca77a9554083af18dffa028dd74b', '7d156eda717849ea90b356b25ef81fbf', '0e8b694c8ca14fb5953248be39d48838', '1affb5887c0a4c70b0d32a6a5834251d', 'e84728c84c944d55b8d04ed9ba526fd7', '5969e1923e5044b29ed3182dfd024ac9', 'e8547ba7af894ae5a8e0a30451e30d64', '771f48b857d8430495dd25f733270915', 'a4189e0e5c40456f882c84bac7074695', 'd553472559f44c689d7b286c329a6cb6', 'c851e21056724f1692660ef574a1bbe4', 'c1d1fa3eac744defa1ff89c62752a6eb', '286cc12022f4422ba76ee07870baed89', '8c7d4572611c4ba7a21bd867b5b06693', 'd9829178358b450089db68484a17d147', 'cad2e73ae9254336a6641d220c96e5d0', '79cd6770e3ac4daaa758e06c98abd25b',
    ]),
  }),
  zgz({
    item: '240092138',
    title: 'Гусеничний екскаватор Cat 313FLGC',
    original: '2015 CAT 313FLGC Rubber Block Pads, QH, Piped, Aux. Piping, Bucket (Copy of Declaration of Conformity / Copia de CE Disponible) - CAT0313FKGJD00237',
    year: 2015, hours: null,
    specs: 'траки з гумовими накладками, швидкозйом, додаткова гідролінія, ківш. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092138', [
      '78b778f1ae0f476b95fcf514578596e0', '295fb625b2124ef68e00b26d9a2fef71', '90171c59e8084ca090b70f283355f135', '482a5af51be74223bf7660eb2522e27f', '9aae6a44771d423d8124c8bc5324d920', 'b14fd7ffba6448e8a65cc4bca2c2a1e3', '1e04fc2ad7cb48b695115fbaee0dcdd3', '7ed3fb8ce0c04263ba57cf2e6b749304', 'ee0a720b90d448d39fdafbe299cc9ff5', 'e86488bfc95b4546a388b3cbbcc3ab1d', 'd648ae476d4b4ae8a5cb5a8c0deb9402', '57ee76ad0db8416fbe601a58ded63600', 'fa2babf741e64404ab00b897097b0f90', 'aacb3093da54423888b4e587a7045654', '73cf0921792048998358df2025a3992c', '05520782e24145c8b838ffb7a1f707d2', '44237ebd47cd46e59616d19b922c86e4', '95eb3871cc0644cc87ed6a30b7de690b', '4ba05c84f928405c96b1db1ac9bca5a2', '6542cf534ac6468babf47d361ccdd4ad', '39286f0709a145fbb09df6f60146c530', '7ef8dc7e439f4ff4b70c2868dc519644', '73b27e4a160c421cb66668360ba7d002', '2b0a326f943245a4ab56137dcd0a9122',
    ]),
  }),
  zgz({
    item: '240092249',
    title: 'Гусеничний екскаватор Cat 313FLGC',
    original: '2015 CAT 313FLGC Rubber Block Pads, CV, QH, Piped, Aux. Piping, Bucket (Declaration of Conformity / CE Disponible) - CAT0313FJGJD00238',
    year: 2015, hours: null,
    specs: 'траки з гумовими накладками, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092249', [
      'ff3e0dde500e418dbebcc1825d2d4223', 'e89832bf9ccf44f0867c023f70b10a41', 'afb62149209c479fbaf54f8de24c4d9e', 'f7ae65c819394c079f99b91ef2345f4b', '34e83e7fdd684444961753a58ef7dd55', '01bcefb0449148c5b11fff1f7dd7cb96', 'f676e5df668041a6adeecf96eb8230b0', '660ab2b0bcea4c4bafa39aa4ecc52788', 'c74b338cb64e43328af71f88208f2bf3', '1a9fd1007a0c49cfb42e12715f310366', 'e60484544247407b970cf5a09166157a', '77c8d64a73f34d748ef350fe41f6e6ff', '77e36bf7f2d1494698826b03c82513e9', 'cb83040e4de84651bfe6625c867bcac7', '0507105ed116413aab3c42c23f33ef9c', '28659652bbf74fcf808d0f97a82da01a', 'a7c1fc6bb97f4242980e2d2f20cb8116', '9a8c3ae57d6847e8a9c097fa0c80947c', '7bedce280af94ba4b096a0e6982da37a', 'b78ed93b468848aaaf88f9970eb19273', 'f5219a8dfc034d68abf5fce7a5ce50bb', 'f3b5228f30eb461894aa3f79b13cbeb3', 'dff13d7090e048ee8f442ac641eda83f', '6d32bda9af9844d3a4f6a177d7e92aa1',
    ]),
  }),
  zgz({
    item: '240092345',
    title: 'Гусеничний екскаватор Volvo ECR88D',
    original: '2013 Volvo ECR88D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VCE00E88H00210227',
    year: 2013, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092345', [
      '21c207a972b64d07bf22e7785506e0cb', '00fdbb2378c64c61948885cbb73bdcc0', 'a53f07f8bb9f424198e0dd356c42c87f', '7fc5bcbd399b4af48513c85c6f4e596c', '287eb4c259144bdf84f2da9ba1aa985e', 'df9892eef0c445bbae7aab4b586b8a4a', 'f9c4db60715040b39e950b0454668c21', 'f7b61badc75d4ec48afb86fe59b69f9f', '70fdde1636554bb48f8944f911472745', '13f63c717e2942d6a6a6691ad5b56bbd', '3c99cee90f8d472c978f8d28a0ec3ace', '9c19c41bf2dd4f698b796567a71d8887', '9df1b50f996c4a7cad4442a1df3cee3e', '15496fe0757e424ea55110649b83dbff', '3df8c7f566a647108879aea63571d4f2', '5b50cb5dd2b24240970ee2c3469dcb81', '24b5fbd32f1442a9b3b38e2c1dc05dc2', 'bc9fca5b05c04dd3bdf21e401760ec48', '7ffeb2e0844f47fb8c597e3d032eee58', '501a5b04fb7540139cc5f16da09db952', '59def0f779624cc6bd25c5c9856e039f', '2e9eb495aaf341f88a078084612f0191', '1461098a9db54162832f4716ae9a4230', 'ed1311ebfd194dba9a90f47cdf2da586',
    ]),
  }),
  zgz({
    item: '240092456',
    title: 'Гусеничний екскаватор Takeuchi TB180',
    original: '2015 Takeuchi TB180 Tracks 450 mm, Blade, Swing Away, CV, QH, Piped, Bucket (Third Party Certificate of Conformity Available) - 17517538',
    year: 2015, hours: null,
    specs: 'гусениці 450 мм, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є сертифікат відповідності від третьої сторони',
    unused: false,
    gallery: photos('240092456', [
      'bb0ec3fc5965426c8348cb134534cc4d', 'a262236a2e01403eb8187cb1be68c323', '1182ca06dac7432e91818f732eb70849', '7fee4d323897434eaf756295d3b8b777', '3fd1ca20488e42ea936ec967a110ea2b', '31874c9258bf47a3a84ba1582ab55ec3', '5d20754c86054f3a8a16dcea758d715d', '9eb38aef108848109eb58098207a4ac5', '944367123f5c412fb64845753e12c79f', '88ef4d6812474e9b82d07654216c7b6d', '02937a8cc2414bfc93c39e96fa325668', '2db9ddb04e84414cb8a05da9d10ca564', '36fd880e989a420e997bd3e8b57dbc17', 'ee31ecf685714c54a3958d13052101d4', 'aa8064ab93584cf4a05052384be5a5a5', 'a48acb404a0149c0b96fda35a0b7e1b4', '98e8517d5bbc4e288204ffe3ce7a8380', 'b9e7f630596448be9c41c88a2814738b', 'b86730c41f3b421a9408f9c64af94fb1', '274a044971c9445c9d3760ec684b0491', 'aadbd2144ce844eda8c704a7612e27b1', 'bd37418feeea4b7f8c93d5256a891a3d', '5b761e4aaa7d4f29a53d90c19c63004d', '398173a3e6a24d958afa7e509bd3c103',
    ]),
  }),
  zgz({
    item: '240094353',
    title: 'Гусеничний екскаватор Kubota KX080-3',
    original: '2012 Kubota KX080-3 Rubber Tracks, Blade, CV, QH, Piped, Bucket - 24990',
    year: 2012, hours: null,
    specs: 'гумові гусениці, відвал, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240094353', [
      'd8cefe83868644858d237b6ff0005a58', '40cf73d680f14f7e8eaae7f2b907625a', '09c3122583004c30bee63de032a0bcfa', '4656a51bae0946e98a4bd2e82a2c3ccf', '27f70a41bd3344d098418a8527f548e8', '9ccf1a4ba42f400ea22580ed51e292e4', '1f527f14ff2645e2bdb0c979d081703c', 'd4bffeed11d84b3cbee21564b28d825d', 'ed1ff53491594ba0b6b873082aa25ac8', 'cd25683616324bafaab76ee061329a1e', '952f2ef3b3654d6fb2a967ebe2cdb255', 'f16d94f8b05d40f0a3485c906157842a', 'de24fc98d56747d29922f3e30f3ceee5', '04e846faead84fd098ebe51ec281991d', 'eab5999b93494893932779f34a0fe86f', '3f46688e52cd41b58a16b33a349a859b', '8c1a3f5ae8d24ff8a61bce520e91728c', '6899987ac0984383921b1f9b1b7ae55d', 'd56f480d4f2f4abdb5673947278fbec6', '45d9e701c7164f12b9a6a74632e8b139', '452f679befa244aa980930f87b0c8431', '062845074ae14dbb9ddce9e6ddb29efe', '2cc3bc2eed3843a789687841c69e8361', '82759ef9fd464d5dbee561999c72b7db',
    ]),
  }),
  zgz({
    item: '240092466',
    title: 'Гусеничний екскаватор Yanmar ViO80',
    original: 'Yanmar ViO80 (Third Party Certificate of Conformity Available) - 01007B',
    year: null, hours: null,
    specs: 'Є сертифікат відповідності від третьої сторони',
    unused: false,
    gallery: photos('240092466', [
      '91e4ff2fa80145b39fcfdbc5aa3be790', '2f213f2090c44072863fab41c726c4aa', 'a865c4c0364e4291b0dd81acc13988c0', 'c0d4fadbe6ac42e1bbbf53410f356fab', 'a07f1f79cc154747bc4477e9b482f948', '07ac3b6076c84e0c9fe456efa3ea504a', '030fea534d324f7fa393773dd2e1fa32', 'cf014abaff04411ca0d8d1c0f14079c3', '20331194325341319e141033666038fe', 'b1680a2400fc4863b40955cdd90bd4a3', 'de804fd0ea63412ea5199356ca3efcae', '4cdb85a3cb3b47f49fd6cdb5ca57b54a', '62d1d7ed2bdd4c77a33023b1d429729d', 'd671461c271542b2bbfc7ea03a66407b', 'abc45050048944db889f1c34bf2f44d0', '3f070f21622c4946a8330993951ff37d', 'b8248a3eac1a4a929fd5ad5aa4e7bfe4', '7bed44fb080448dc9c5167097f378a18', '731907219966435d954f2d362725cde1', '69d1a9b9a72b4503979806ca9f5ee6dd', '7471e521669d4306b1f3726611329538', 'd431b63cd2484275a412ad99b7b54e5d', '3d8e6f9535274b5e8cba15fec358083f', '68f314272a80477da00eb2f636bad0d5',
    ]),
  }),
  zgz({
    item: '240092608',
    title: 'Гусеничний екскаватор Yanmar ViO80-U',
    original: '2013 Yanmar ViO80-U Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VMRVIO80PDYJ92179',
    year: 2013, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092608', [
      'be06158bf7a2442db96c01b8eb6301f2', '2ee39ca1bfb2498694eec0f837a294e6', 'd90dba798f874831b031884189905f3d', '34d26838f2f74555b888e6f81111debd', 'f8442fd64caf44678ae2be06a21c8862', '9cac25fd063d44e7a8a76a0cc69803b2', 'b27cba74c30f43f09919850f2442652f', '94071a3db89d4805bd8db800759dfd6f', '8a986139a3284fae85802bef40b0a270', 'ea736aa5107c4ce49ab43e158daa9b10', '18d102d2802740e19d5132fb0fdd163a', '2358455d560e496489825a11eb4256f7', '6687d61fc181414ba0756e97815a2794', 'b985af0e599640a3984cf70d81dd3f1a', '8015dc1520ac46ec8d6ded89229399ab', '7bb1bf2f6e2440af9692f6c7e133dbb0', '66d89d58856c4161ad01e15311408f3d', '94c7edb1382046d080f07cfec2bae1f1', '9bff3b095e8e4b5d9ab97cccd0e4bffd', '287ff9e354434fb09f46799010c6eca3', '6a3a2b2283a84c36963da326fc087ee0', '6a5930d459b54ba98bcce72e2d013726', '055e0c0308d74ce687e6ac24266615f1', 'a7cba8df5524439188369b25ce11b117',
    ]),
  }),
  zgz({
    item: '240092315',
    title: 'Міні-екскаватор Wacker Neuson 50Z3',
    original: '2014 Wacker Neuson 50Z3 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - WNCE0504CPAL00838',
    year: 2014, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092315', [
      'ac2c38abe6fe4e43bc9e620185c0229d', 'ceb0e87e2dfd4ddfb33c3f54da6b506d', '9feb95f478e943638254b2c735573648', '09d3e5503b6147de80224a01bd7dc47a', '8ff4df29901b46448108e765cf9a3c16', 'ffb5a742a7aa44df9d0d21281dc7581a', '8f26faf99dc1491b842eb647628dd9a9', 'c6615a3dd45d469abb8d17df7512685c', 'f227783796e44409ba4804a5bd9027b5', '30760d7cf00e4b659362f1c888ca2986', '92f1a7d6f48f410fb065cea35a7ef9e6', '555b7035200e4a428f6a43888f4fb13a', '678f67dd14c84dd1905ca9f22d166445', 'a62c037f04574455826b2e056b0b5563', '91ade1e96dc94375b1cc8bc9cfe77da0', '340ff65c93da469db7ff22af0b446181', 'c13836792dbd41438fea7dab335c90d7', '7500f1279c32472ba4d3416976eca98b', 'b36f4c0c7f4043648d45cf414b5e703e', 'fd7d6a9026d3449fa6e2a5a4b425ad80', 'f2cb35c8529740f08498b3573bd0bc99', '8c29451a57c4487daf1a191ffad7eb14', '8e23cff2bb00499f97f6d82f1d88699a', '34220d1feb054e1598658977e2fd32c1',
    ]),
  }),
  zgz({
    item: '240094396',
    title: 'Міні-екскаватор Wacker Neuson 50Z3',
    original: '2014 Wacker Neuson 50Z3 Rubber Tracks, Blade, Swing Away,CV, QH, Piped, Bucket - WNCE0504APAL00941',
    year: 2014, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240094396', [
      'ee040691d66e4c2db7b15c68cd81f6c6', '98b533fbce1c418d9177f73adfff933b', '6fb7671505fd40e29c2c8c20f110abbd', '3b9676021cef4cfe9a0f8b88c6a55d7a', '7260c9cf02324425a20717ef51f68a30', 'bcc0410dead14e159adb84dfbea370a8', '9fa8900a75f24376bf3a25b1efa3782c', '03f3414016504913abd3df6c36dbd1a0', '6ab4c3fbbca442378f93ea8afe465088', '52cac46f1ae04affa3673b52e32677a4', 'bd71e30b007a465da31ccca6c5737ba1', '2c9d0b083bc441aa9b6fc0a463fb4a92', '565d0b3d07464f8fb5a256e3b4dceb0d', '00c70f136e2d4c6fbb40268a1a5b354a', '41842a0d2ce742e6b8b9f6582bfe29c2', '8901a260100a45dea0c25408de258a4f', '2c8c941d852044e68b5e6c5d8295fa4d', '19ef6c7bd04e4abeb03a618741653d71', '0aae6a49390441f09ea62a671ffd6224', 'ad8329118e8c4d49bd80044562a8be35', 'fad1fe2843fb4d2d873aa0a437e06de0', '223fa58eb8254553be85074b3c225689', '845e6fbf1d474c2b8751926cd4de71e1', 'e5fabac5efc74f84b8012ed1a2b5a128',
    ]),
  }),
  zgz({
    item: '240092103',
    title: 'Міні-екскаватор Wacker Neuson EZ53',
    original: '2017 Wacker Neuson EZ53 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - WNCE0510CPAL00844',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092103', [
      'f9bc3d1c856948ab916331d41ddd2ba4', 'f1c48fa8835e489b98b4cc12a274c77c', '4967ae0b49a44680b97232d82824c6fd', 'ee0b07d5129445fd842f91c35eeed94a', '3f850136b5224bdda0bffffbeef63bbb', 'ae76d789bbec4c97a399bb9b485abf08', 'c20c1e132f6a45c4bced8a1c3fc11f03', '7ddfb0e3a12044e3ba0b1b44cd7066d3', '7abd69c766fd4f9a9362a2ea5e90d7ab', 'a447c51d9e71482ea0c0f06bc53c79da', 'ba29cfd32c5f40c2ae16867957ea6ec7', 'eac146c63950472eb56943fc110da488', '3cc41ac2eb9a4d1fb1906b5813ee4934', '73c3472fb0034759a5ff27bc4015fead', 'b9a840ccf0b444cab35824cd905bb945', '8fa55722402148f9a505535ea4615089', '7aa112f175204f15a86c53a466d62687', '17cbf6a8554c4561b13b40865619d0b3', 'b6befebe123647388abbf98ff3684496', 'bf0310fe8f1241d7b258043bfbb662ba', 'eb4a817cfec04907b7c6f328c20b38c8', '42378e4f87fe47cea5e4b0f271a4a409', '5c3898c576814e62a6a2c7c70980f51e', '42e73c8b9d4e4bed845369935a76400a',
    ]),
  }),
  zgz({
    item: '240092142',
    title: 'Міні-екскаватор Wacker Neuson EZ53',
    original: '2016 Wacker Neuson EZ53 Rubber Tracks, Blade, Offset, CV,QH, Piped, Bucket - WNCE0510KPAL00329',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092142', [
      '2ed269b863284e3d84bb656631e10deb', '67591c8bd4d64cf8863d0f508d2b9109', 'a9df67d984044e3e8a3f05e758206d24', 'b5b07be270434459bbdec60565ea7c1c', 'b18726c9484d401aa69c4235f5642886', '7da229efd1ee4c46808327bd7ec2741b', 'c2697b34d26942a9b51724bc30340e4e', '49f620863ab84c1986f150a39e817f72', '88c8248752df4bcca7204e5ad3000125', '23246213bf204c5bacc8ec6c8d6aeefe', '32546be5cc9d4b57be5c07e4d6467c19', '1f419ed45be74fad9557aaaa554b5f3e', '14067578b870470e88347e740730ba35', 'a479e63ef89d47d4bd93fda976fb6bca', '9fd8bbf004984183af899a64ce40af88', '315b422f8c0e4055aba661d4a773c31e', '6723d3a7008242999d8a19f2d9d68d35', 'b1b20369fd7744b0ad949fdab817f63a', '2276710f29ea4813ae458a58a29a2a88', '940ea6dec03e4d55a7c9c38e1ce9182e', '1a27f06ac14a428a9d0bf31fc9edcb22', 'a46732e2b69d4718841fbe2295424c00', '8c556619579a4858a2d8eb76800c979b', '1b8e2355ce4a4b88ab04cf9588ef5cba',
    ]),
  }),
  zgz({
    item: '240094468',
    title: 'Міні-екскаватор IHI 50VX',
    original: 'IHI 50VX Rubber Tracks, Blade, Swing Away, CV, QH, Piped, 3 Buckets, Hyd Hammer - WY000071',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, 3 ковші, гідромолот у комплекті',
    unused: false,
    gallery: photos('240094468', [
      '76de4c9005e14371a758ef2511d835b1', '479b0a274cfc4c5fb61e51b6ec89cb46', '070941b661494450bd2e7e57421dbb39', '9fd4ccfde05b430997bd1b8a5b43e9c2', '963db1b6f3924c33b6bdae62aac22b30', '7ffa34f6c9c045c6a2ec1c2f89ef1e56', '32438fbfa5a74ef1b058278665dc2434', 'f374f3399f9d47b18ea7ad2c1fb9df90', 'c63aece0b9a9470fb750ea4a047df330', '8618f60817e34e12bf06540e9f3e7825', '9dbcaff5b1444cedb0d24fe43167796a', '7333c5cf040b413db007ed9708f6b036', '95a99ffe160a49688d4134ad6231baae', '62f9f9b9937440a3bbb184d115ee27bb', '03804eda10514f89bf6e478e53044eef', '7d890dcda77544479a846945b326d7c6', '6f3d011486a84813b5061e27d281da48', '5dc6ecab331240649c83b3812d31fb78', '12182bb97db84e799599aa1387a43602', '080849ab65d5474e906cb04429b8a231', '8fecd6e800fe4cbf8eb1ec6d910402ab', 'f12cb0e4cd4c4291946674bf10b4002e', 'e003aa2d922c49179d02e2c24f9adaf2', 'c1e5c9dfc16c48a492b2a9bbc7503279',
    ]),
  }),
  zgz({
    item: '240092346',
    title: 'Міні-екскаватор Volvo ECR50D',
    original: '2017 Volvo ECR50D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VCECR50DJ00016561',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092346', [
      '333fd921a0634425a63d15c266108066', '2870733f98a749efa3077571ce5284ce', '930e0259fbd147719acd1a19566df144', '80381c72e57f40898c6b2193a94738c1', '5131c299147540c796dd43ab634a91f5', '56e9b3c147d8488aba7eb607f3a48062', 'fa408fe627ed4cf2a3e1ac40a4d6eb58', '6e00c4c972dc4286bebe355f022b128f', '64d1a1f02d3c4222ba276faa84e4331c', '9399f019f7fa4338969e0f8260029e03', 'f848a9c1dfd2403fbbdb142dce1de47d', 'fe6c01a5e6554e1994e851e97521c8c4', 'ee7a5b1a7ef44f40a6bdd0370c606b89', 'bfe3d464e3064deb8fe3d10cf645ac39', 'e2811330814743d6b0260580058f8f5c', '14d34023e1d54fec87bc024eabbdb3f1', '06f972d96b0b4d53817dd6ece06a537f', '250cc1a511e94454be5a29bcb0d3ddff', '5d73acf4efe24e89a5fc3e348f901422', '77200ca7bc4c4cb5a97eae47e0cb800d', '339bd6f801d844f7ba1f508a54264b7a', '5484266de89e4125ad11135d34f8ebd5', '55670384ee4745379d4b79b9f6023201', 'd26f08be61324c3f99c8a534a4ff24fc',
    ]),
  }),
  zgz({
    item: '240092353',
    title: 'Міні-екскаватор Bobcat E50',
    original: '2017 Bobcat E50 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - B3NS11188',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092353', [
      'dfe81ae1580a49fcb453b5b35d971664', 'd23cead938cd4c7a861fe2597e6dd2e9', '9faa57ebc249447a9d440c9e1c6f7e0f', '0c3c4ead402f47c6bec737ed4dbe6615', 'cfb441f6b2c94706ac2ea070c815e4a9', 'b949a1bf1a7a4c20843c4535ac2b717c', '68a56089e35e4f7190cc00506ec0fb9f', 'c10fe6a26e1a4141abb1f3699aaaab45', 'ce7748245dc24a9cbcad949f8c160689', 'c01d0b83dcd944bd9be0ddfcefad3841', '804b7741ed6245abbae3d343a457e23f', 'fce13a41906b4ceea7b7e3358f5b8e8d', '44ca62b559ac4e668f7a3775a8f4103b', '260b988a77f849ef827c85f5b2b38f42', '6abc34f88c52456aaa45fd5c620e5330', 'd25f8829e3364925b4fa4c483878d4a9', 'a697b7c4c4434d3fbb7e1a0ffbaf74e2', 'b5e0daea5dc14f4a80fb091c49e474a8', 'a1bd0969ac7c40278951f822c0d00067', '0a08e8154e2243838a6b2a5a1fbaa033', 'c090ebcdf3a34114936bee0463aa9453', '7ded68d8e2ac425bae7bd6692c2a0ba4', 'fb6d66d2ebe342b3b71f08d0763cc138', '8c9720eb14f84f4fa38a59b44f76c5b9',
    ]),
  }),
  zgz({
    item: '240092102',
    title: 'Міні-екскаватор JCB 48Z-1',
    original: '2017 JCB 48Z-1 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - JCB0462101920949',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092102', [
      '87f41e647f8644d0ae94c8cc22280725', '11aae5e05e7a4693a1e1961899e6a6b6', '5c26301c06574bff95e115da91964f65', '439df1b9c84542998973ec3ad1fb5db2', '36786d9990e24addad4334aef66104c8', 'bb2ecacaf04e4c19993aba7d09dd53e8', '7545fd1c32204ae6b8b7f3ddd3334d82', '34411b0103f249fc9484122a2d9a473a', 'b9dde86731ed4601a9b3195616def406', '43de07c306c04706b55fba9e8d403885', '35afc4f941364ff5af68c9de0c5a2838', '4ae1275171754b06ad12635f4609b426', '65695b9e1a964b98884c11d99cd50ad3', '356fe3b3c4cc49b08749cd566f83b776', '7b191c4af462407a83fa16c252ce4872', '90ee64aeaa0d4e38aa1d2d1d8ee01200', 'efdea41f7802411bb6ce5d0125ab1603', '72ed8d4608314675acfeeb3c75d9f185', '2c4bfbf26e5a47f59bdefc074eac6aa3', '0d0f8a52d1f64e7d8527a497fd575ec2', '03460c251056463cb0973360b93920fe', '95f9283e8e3a4286a7b5c100aca7b7b3', '2a776f5cf4a942508fb4cca19dcb0175', 'f27dda9492ea45b0931fd1337b68cd66',
    ]),
  }),
  zgz({
    item: '240092457',
    title: 'Міні-екскаватор Takeuchi TB150C',
    original: '2013 Takeuchi TB150C Tracks 400 mm, Blade, CV, HQ, Piped, Bucket(Third Party Certificate of Conformity Available) - 15010691',
    year: 2013, hours: null,
    specs: 'гусениці 400 мм, відвал, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є сертифікат відповідності від третьої сторони',
    unused: false,
    gallery: photos('240092457', [
      '56930bb19f9f4a7abf8e7a4bcfb54a55', 'a9798a57ea664617a628e7bde1364c3a', '753e83fdba75444c89d0b0dee45e41b6', 'c7578eb3b3c443a786560aa9572c55c2', 'c3302405acf34bc5b04c79f7c0c913c6', '8655881316e14f22b87827da697b46af', 'b4a4f433f8534a01afc73bb8871ba95d', '152a51f035104cc3b0ce49816bb88167', '16b73a2fe98749b691e14beeecda8e30', 'f861096094bb45ba838f3df5b3922b61', '1cf39968122441e7bc87bfe8188063c9', 'f51646b5682c457487e56af9e647f9de', '7c025703252747dfb30921db3669c214', '14524555bac1454e8584531743cea102', '79fce93dcf0b46ada8cd33816ef3cb06', '3cbcff0849c84c3eb69cfd6ccdc0b735', '031dbf2a547c419bad3e368533ab4a92', 'cfac7374ae7146d78dc7aaa37ff56423', '501114f157ea4cb2b3144a10c19635d7', '8f8c0e2ef978425392147c22b2e7cc65', '2d53df52f7f8453d984fbbf947322166', 'e103c33fd6444145bef280e2564e954e', 'f54d32c34ff64f75b896299b5d9572cf', 'bb40b1dc9c8a4dc8bd4177c34475f7d2',
    ]),
  }),
  zgz({
    item: '240090115',
    title: 'Міні-екскаватор Sany SY35U(G4) (новий)',
    original: 'Unused 2026 Sany SY35U(G4) Rubber Tracks, Blade, Offset, Piped, A/C, Bucket (NO CE - Ubicado en Depósito Aduanero Bajo Control Aduanero, No Libre Circulación en la UE - Cargos Aplicables) - SYK11003KT4C03755',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, кондиціонер, ківш. Без маркування CE: стоїть на митному складі, у вільний обіг ЄС не випущений — для вивезення в Україну це не перешкода',
    unused: true,
    gallery: photos('240090115', [
      '21be2281f45e4f6598327a902545ef80', 'cc774ae470104906a5090b256358b7d1', 'ccba4abf8b86405f8d08cab26ba4a9fb', '38a0e6019d0f422287774fdb0106be36', '0143d262b7fe409c8713b7c2e2ad916e', '36cd4fd75f1c41829e5bbd74b71ce769', '081077938fa44947b633c520877ef81a', 'fc5e392533cc4ef3971e84973742e4d8', '5f75b9c71404468d8bf678a435a3bb37', 'cf3abb9d727147ab8c4f9873fec3d409', '219560fa28054e5ab1bc6ac5e16a151a', '408f0597c8de4953ad8f138309bcd8bb', '3a4073059f6a4bde9d106c27e9983688', '1aff75859be54d55bdde4dc3160f35c4', 'ff6dcf03f181452fb912d8eb2e40cb5b', '3709913941a94d3581e51d34e4a381ff', '8403b37a6c1c4c709025f3ba08840a22', '375b4261358040af9ba85b1735cc9782', 'f636fe4cbb164362a37ac7945e3f7b70', 'c4deeae8eff14fc7b28e98343fbc4007', 'f92d7ebf478d4866b3ab65ac5126e3fc', 'd2080d0f81c446b1b3c5c4cedb5c4457', '9339691e159142d2b370c99edcf4d1ae', '58bf4d6cef3146e5b3460bc94a2246a7',
    ]),
  }),
  zgz({
    item: '240090116',
    title: 'Міні-екскаватор Sany SY35U(G4) (новий)',
    original: 'Unused 2026 Sany SY35U(G4) Rubber Tracks, Blade, Offset, Piped, A/C, Bucket (NO CE - Ubicado en Depósito Aduanero Bajo Control Aduanero, No Libre Circulación en la UE - Cargos Aplicables) - SYK11003CT4C03757',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, кондиціонер, ківш. Без маркування CE: стоїть на митному складі, у вільний обіг ЄС не випущений — для вивезення в Україну це не перешкода',
    unused: true,
    gallery: photos('240090116', [
      '68619935e85b4226987198a6ad0f9293', '4c89579cff2047818c10c2cee2260ed5', '1550596ef32b4166afa317d28310a4cb', '7b3ed56e063b4f618c1fe32626ccb282', 'd5d7196079824c389d59d86ce277bc2d', 'ef715aabb6924f838ca31ea0bc026d12', '439cbc8feff74b61addeb64ed3a40323', 'd400dd976bc84402b305fe6bc1d097fd', 'e81abc5d87e742adb137c19f7db8ed3c', 'ed44bdd295e24af4a911a48fba7c5376', 'efc2e664fb73431c816883e31afcfbb4', 'c1b15d4f89f948b08a02ba5fc425a605', 'faffd8ab75154671acb70dfcfe0637c8', '6b35d51e6c6440dc8b8ba2d538628813', '795ca1e015984827910633d8f10ec9d8', 'ef19b0de378d4852896f96d5d4d15b83', 'acd3e6881eff4139ac0f6a4c6454a756', '97700accd3354d9fb2c38d0457e7a1b1', '02d2286e953d439ba2116b43ef072d6e', '4f7137da49954a02a5b70f1826d2a492', '73008f1c23e64bb590a3ecda5432a8e7', '4d5801f371794a9e8a1dbcf11c38187b', 'a70f89c6956d47efaf977eb008eef51a', '037a67bf120e4d0fbdfd8439cd7809a7',
    ]),
  }),
  zgz({
    item: '240092101',
    title: 'Міні-екскаватор JCB 8035ZTS',
    original: '2014 JCB 8035ZTS Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket (Copy of Declaration of Conformity Available / Copia CE Disponible) / Cadenas Goma, Hoja Dozer, Brazo Giratorio, Válvula Seguridad, Enganche Rápido, Inst. Hidráulica, Cazo - JCB06033102022720',
    year: 2014, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092101', [
      'd47cfd88daad46c08c5efcf48aaaa3dd', 'fd8d14fca3d142e09c2a552e05dafd4e', '1082ef4481864effa1549b940c2eab04', '540d980cec714a51a422bfa736d0b4a4', '39262b86c85b43a8b9e0b8288dfcdd4e', 'e93093f1c461484fad2b9036fa2d807f', '4aaea1815a0949db958abac9c0109957', 'f451dac5ff404f629ea0c20a4313ca06', '4240782104a14dbcb8c7e3f18317482e', '616ad10263ac4a7eae7200af27dbee77', '622a13cc917048709f654ef54748cf4a', '42c6a52d96ad43118bae07541ae7f6de', '60aab9d0f4cd495eba76651af5f090ee', 'dfa1a5c2481048bda5fdf656c2e8eb62', '57fac03f421847888f880467f2300293', '473008b881054e0482c5e40d97a97227', '59966507bcc547f6afbeec2a498ae96c', '84f5b9e0bc284a3a93be2c8be6437ef2', 'b003add772c24fdb91e341f07c984dd8', '0d07467754f743ce8c20daff2dee4f9d', 'd3e3228f3fe04b9493269f47ddd909fd', '3e371f2b087d4c779f4f6e5e340de37e', '9901a4667206461dbfec41b8ba891d4b', '0c2a66c3aa6443c3bda4199e75562694',
    ]),
  }),
  zgz({
    item: '240092454',
    title: 'Міні-екскаватор Bobcat 331G',
    original: 'Bobcat 331G Tracks 300 mm, Blade, Swing Away, CV, QH, Piped, Bucket(Third Party Certificate of Conformity Available) - AACS12055',
    year: null, hours: null,
    specs: 'гусениці 300 мм, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є сертифікат відповідності від третьої сторони',
    unused: false,
    gallery: photos('240092454', [
      'b7e63bd5439249b8b53987068af07e37', 'e31ac203a03041238a77b827f7a8cb43', '0afedd61791c46778f85cf39ec2d2890', 'ba3d14a475e34dec974d9b3db28e492f', '8c8ff2a6908e4e279019c5cc2feae3f8', 'fcaaf479625e473d964cf43d4f3df2cb', '59ac274e5c244cd58ab87a0a1ddbc6a1', '82cd1f3a87644d02a68ce6da8ca40c7d', '63f362ae0db041f0b90fe425e7e85c66', '39b2eeeeea33443195c3c4b9b6a8315e', '702c26823f764c11bb6afe7c7c0edc14', 'cbe2adca91364e6690148e39942941f1', 'a5cddb089a3e4cf0a6cc5dd0c04e74b3', '2d683fae5e47473796fa353d438d9e93', '3f30c2cda9064e9bb16ed39f1a3cf0b2', '183c518b1c424da58aa0ce0c689d145f', '914da216ca19435ca5d25dcb7039855f', '00fcf1f11c5147588f83ef3858b5c92f', '162de1f1e1294366b64339792821482a', 'e449d97f8573442bb55761980d390ef9', '03757690619347e6ae3f60989144788a', 'f70f24b73b9d41fea1dd764cf2db4f23', '4fcc6930656942e6a0019a605bcfbcd1', 'e5f77cd184f04ba8b49c4a8d36668aca',
    ]),
  }),
  zgz({
    item: '240094027',
    title: 'Міні-екскаватор Wacker Neuson EZ28-CPY',
    original: '2017 Wacker Neuson EZ28-CPY Rubber Tracks, Blade, Offset, CV, HQ, Piped - WNCE1002KPAL01774',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія',
    unused: false,
    gallery: photos('240094027', [
      'ea7db32865244526805f81518d9a117d', 'd95b84e7ab014072b7f788eebf16deaf', '194a85f161e04cd48db7e1337a5a6396', '65df5107afda45f48ee67dc8e6b6ef04', 'b001b8e45ffc43a0813bae139d05b747', 'ae5f1e113c504bd4aedef6270e0ff5d2', '4c6c3628d3a1476ab0cb37ad7596cf3c', '506a3e7b68be40ab98ab5343ade04dfc', '331cbb2ee457431786065cb1ba57134f', '490fbad19edd4b08a5b5ffaff560943a', 'ae2f0e39ff264bae8b289fa077112dbe', '3bb76cf23fc84952894d3943f83182ae', 'd8a8e5e9e4c8462381e70de97feae43f', '4931be2668434ccca76c6b0656c05c63', '8a8e7c43c7f54b1ba9738185ae2974c9', '6a3b7f5b03c34425a56494137394bd9c', '567a06c03737457eb247c80f33f5e88b', 'c58cac50fc844cd19996e5ca0c870509', '43d0a8bbd0944d479d8eab51e3b2dc3f', '89e83c0cc845476582e5bf4b4cbd0e3c', '5da26a0304c448bbb41b4f02c608a77c', '38b58ff6e9534f15b24e32b319ea6421', 'bdc44817249c4772808ca229f86d1a48', '38877b586cca4c118effb69aac9c6da4',
    ]),
  }),
  zgz({
    item: '240090117',
    title: 'Міні-екскаватор XCMG XE27u(G402) (новий)',
    original: 'Unused 2026 XCMG XE27u(G402) Rubber Tracks, Blade, Offset, Piped, A/C, Bucket (NO CE - Ubicado en Depósito Aduanero Bajo Control Aduanero, No Libre Circulación en la UE - Cargos Aplicables) - XUGA027UJTKA07634',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, кондиціонер, ківш. Без маркування CE: стоїть на митному складі, у вільний обіг ЄС не випущений — для вивезення в Україну це не перешкода',
    unused: true,
    gallery: photos('240090117', [
      '3d670124d79041ebb189f04ef66ef62c', '05249c50ea8348ae9781bf7f94bfb175', 'ffc9c4431b3745c887845563bc933ed0', '65915cc653f443a0bb3245add95e9508', 'b7e4198b40b24c35a69581ce989a399d', 'a70fece992cb4eebadbb9745d5f5c8b5', '3dc49fd9c8354a23bd09f0c414177a1d', 'fc436c055ed64cf181255fc65fdcd252', '55d2a4798fb44a35a92ad3cd742af669', 'a02cbabef4b640a8987ab92b20b4a490', 'c02640b63a81421b85daa929e6646101', '6a3261533fe74c96a042fb592597fea4', 'fefc8edfda974a94968d3f9bf50287a0', '55284f4406e04929838a1c2dbe071cc6', 'f84fedd106b041d5b0829a777fe3056d', '99a9dfc148d84399a12ff247fbd25c71', 'd2054def598d4824a61a80ecf8793d32', 'b3caa221ce37462b9c20b7d1d73f687f', 'a24847f424394065b9bc1c49b57dfed4', '3cba92390d8640e995436b20b9a358cb', 'aa55bac0be79430090d40e43d4666399', '34aace98772c4773928726b6e0aa205c', 'b6803339e8f14f04a95a2666fdd7396c', '9161e3d5ab1b497cb394c2eb8c82c5ae',
    ]),
  }),
  zgz({
    item: '240090118',
    title: 'Міні-екскаватор XCMG XE27u(G402) (новий)',
    original: 'Unused 2026 XCMG XE27u(G402) Rubber Tracks, Blade, Offset, Piped, A/C, Bucket (NO CE - Ubicado en Depósito Aduanero Bajo Control Aduanero, No Libre Circulación en la UE - Cargos Aplicables) - XUGA027UPTKA07632',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, кондиціонер, ківш. Без маркування CE: стоїть на митному складі, у вільний обіг ЄС не випущений — для вивезення в Україну це не перешкода',
    unused: true,
    gallery: photos('240090118', [
      '519085e34b5949b898d9ab62d85f2a8c', '35f80d07370d44ef9673f094f470941d', '4bc6c17d7d6949439a12e70b484cd293', 'f13bfbead8ff43f4a4f4a15d790b08e5', 'cb903f8c6b604ad9a8f089f52bdcf8d1', 'c22f61887e7d43619b367c1c9468b97c', '8409dc9ce8894b5ebe7209a666f32488', 'ad55dd769aec4cc69463517b562689de', 'ca6aee11ac584217b77596895ccb7843', 'e08508ae5f924288a4b4ee3aa46ab5f8', '8a8d8fcc83f844d3a6d96275c9c9df79', '395298f312a9481f8d6ee21a3570fb02', '2e5c222b8c804c94a0f0a55998956083', 'a7f686ed1d234b47a4b8fb5091a7eafe', 'a4269c0700eb40ababddb0c4e624b0ae', 'a8c1510494394199a9c2119247b4b06c', 'ab15cc0410c04635bde539e323fe1917', 'd59bd714486341aa9e14afdc9467cb65', 'ac18bfa290ef485fbdebc88f754e4234', 'b553e71fc0e14a7bbbb228c33216dfbd', 'd3c05773c7674419b60f4143a91bc417', 'd226e756826648439f01231bc836f5b0', '635a5cbc395944ec97369eec3459d8b0', '1e3ff3e4f8f648fc940d20598275773d',
    ]),
  }),
  zgz({
    item: '240092252',
    title: 'Міні-екскаватор Yanmar ViO25-4',
    original: '2016 Yanmar ViO25-4 Rubber Tracks, Blade, Offset, CC, QH, Piped, Bucket - YCEVIO25HGCG04198',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092252', [
      'a78e22907a3b4aafa010637ddfda40ba', 'a2ad2960c9c44930baabc7ac24346798', '1f145724af6247bab56df9fba207d6a9', 'c03bce4cf5574356813dee99890b57c7', '96b596ba33ae46d189f4b62ffe9216ea', 'f7ca2c16ae9b486d8a1bc13eb31d4b3e', '7fc670ff8bc84eb88c8ae1a3c4e1c7fb', '02a268c6d3f74afbae02925d9cb1edef', '0b812b3a21ea4282afa31ebfa033b167', '71933bd26f6f4f20ba5ca03c5763d581', '992f8fdc193b4cc596eec9820cf30fed', 'b2b2c9ae0ca843abbeee757be972ea6b', 'f7ad9599e0d04be589ca0de2db99f0e5', '05ded9862f464ed18404b0196e1652e2', '88e9a1d23a644e238a7c8916d0c57b10', '84c7cbe5c7f0426786852dd0591cd515', '8cbea9a543e842449f12c1ef97d9ebb6', '820ba979202a4ac08aa555a539f71674', '6ef77284d1164569ab15107ba594e50a', 'fdf50f3e0e2a41a3a32064f440a2474c', '414b83d8fa07470c81a186bd0c38a134', '9e4ef6af3c434f4a8fa503642bb4cc31', '067b97d255ba42f9a32e4ee018f1a0ef', 'f2ce1d19b5de47428d6c4d9d69b607d2',
    ]),
  }),
  zgz({
    item: '240092408',
    title: 'Міні-екскаватор Yanmar ViO25-4',
    original: '2016 Yanmar ViO25-4 Rubber Tracks, Blade, Offset, CV, QH, Pipd, Bucket - YCEVIO25AGCG04180',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092408', [
      '9ff85f38100b4fd3aaa02ca7270e5893', '9c58ed395d274580991104fd4323b0b5', '499ea4abd6f0469fb4b6b37d0f65f4a4', '62fcf878c94e40e3b74ba1d867af2f42', '43f9d587cb7b4562a9638d7e34882869', '0031d6845bb04648a24f16eccdd2f37d', '9c0bb3a2c02a475890992512ea270c5e', '2497ce1bf8a34bb898c63169f57fc78b', '1db6ed13d6904b4c9ca174707229ef9e', 'e6fb5c475288478b81ce9235c2dc462e', 'a7754ed8542f4291b62c46293572ffcc', '73adee6275bd44b480de0645d9f17dad', '6f7732e09acf4283af5f25b2727a6c24', '5e21b86afbce407a8aed20979ae4a1cb', '1890fe0395b449b6a9607e289c454619', '7ef57c919b4444ad85cd5b833301ee36', '6cbbe6ec87ed44b4b508ea74251a2da6', '52c3987052aa46dca5c1f02313fde18f', '1f6c1d0bb72b4346b4e4ebc694513934', 'c6b21df63e484c4d85cd3d30a126f78a', '83fc00faa1504eb9adfaa88d7c8fec52', '24cc501a0e1745109b3cebf7f0950a5b', '813a47d38ef044f0a311bec55a265f03', 'e4249e1855f54ea8b68b9d8165c85b53',
    ]),
  }),
  zgz({
    item: '240092565',
    title: 'Міні-екскаватор Yanmar ViO25-4',
    original: '2016 Yanmar ViO25-4 Rubber Tracks, Blade, Offset, CV, QH, Piped, Aux. Piping, Bucket - YCEVIO25AGCG06995',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092565', [
      'f029dee8b77d4b7e82136fbc00e78724', '95bfd1df30e64bd5918ad465a8480d00', '1ed9c6f9bed1467f9a03cdb994dc8f52', '7b7fd5a2674141b2af92d92c18df645c', '383aa134a61444f49a85a9b4adbb9dc8', 'baca89aed2d84e7c8566b641b8daf650', '9367bf2ae60d4d3d8fb510c0040278e1', 'd88bd4de6ffa4af1a6234be0f0cf09ca', 'aa321d5d20f24fd69e3f8df192d48312', '557fa1909c364efe98fe1b3284f6731c', '0750d7d10911404094ab9b39b5a2dfed', '0536cea566904b269f92cfe47ac2f99a', '92730934776240f78446cd78aab547c2', '272cc1426e0e470cbb312a2752b4dec1', 'a27c2860994646b9ad6f5423189b501f', '9ae7155cf0e34f169cee4f1857fd3ef3', 'af532c4951784eb8b83c3806395aeee9', 'afe3a24b32744b499afe2417aaafb708', 'e6f43123df664c55b12723f7b54bfa1c', '33f0d8dd04834c6fad56da10bdc5b93e', 'd378f736c2e8402ba2af7409089d0f37', '4026ca491e964fcdba56934d30ab96e8', 'b4395838942b41f8b39d061d6b379167', '6e104bc8c12b4335a29660e5ccce0145',
    ]),
  }),
  zgz({
    item: '240090192',
    title: 'Міні-екскаватор Sany SY26U (новий)',
    original: 'Unused 2026 Sany SY26U Rubber Tracks, Blade, QH, Piped, A/C, Bucket (Declaration of Conformity Available / CE Disponible) - SYK11002TT4C03968',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, швидкозйом, додаткова гідролінія, кондиціонер, ківш. Є декларація відповідності CE',
    unused: true,
    gallery: photos('240090192', [
      'bd76508d9fd64ffcb61c73a0d463330c', '9893fbb45e6945de8c89e2dbfbb9a83f', '8c0c2dea197c4f08a5eff826c03aa343', '5d98024f922f4882b40a5177a472302a', '9611bf7f2e8341c4af796bb39085106b', '2c62818f06c74e1db1c3cf75a4076456', '4b65545f8cce46eda7dd719d477218b0', '1706a674e415472e861db0ed9b1bbc86', '5615f470daec4e47b2a6f0e7a7d7bad2', '9b8c22f4489d4aef8c08056013b8b7cf', 'fbd3e803e5a34f3485b69a13d937906b', 'e0c510b4324849a19af4139c09a4a9af', '4b7fb2d8b71d4fac851729775028b663', '53d65b5472984f34b2c290fd9db9fdde', 'a1b23edce7f84140b2ec30ab9881ead2', 'bb430525ab1d462f989355437d4ce6a0', '61dc511234614cd9834ff532871171af', '8df33023aadf4e1790d8c7884a4dec4e', 'e843cebbbae046a18d6ade6a670222da', '872ce80b81ff4b71aa065fb80c6a06cb', 'b529332052174bbca132a53a37139542', '2b782f297ce8469cb67bfd0cc4295da5', '22962d96ce9b4e34b09243d46c414a8e', 'b4a941fdd10147ccb2791c89b4b202fa',
    ]),
  }),
  zgz({
    item: '240090193',
    title: 'Міні-екскаватор Sany SY26U (новий)',
    original: 'Unused 2026 Sany SY26U Rubber Tracks, Blade, QH, Piped, A/C, Bucket (Declaration of Conformity Available / CE Disponible) - SYK11002HT4C03867',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, швидкозйом, додаткова гідролінія, кондиціонер, ківш. Є декларація відповідності CE',
    unused: true,
    gallery: photos('240090193', [
      'ddf37813972545139cf9ed9ba8bc5ec0', '5872f8a926e5416ab6555a6306ca241a', '77cd27d8462e488ca433124b1fe994a6', '481990b67f7346e6b50219455f4aa9e2', '531905ee55d44c5db3f172727a025dc4', '46da5ccb50954a748846f594975c62e1', '73dff076a21d4fb6bc679064c1c05857', '0e754c179e6444c7a6e0314f0998f966', '2ddff04413aa44dab6439dfeb5a60868', '0dd4c96d53be44b89e2b175b1e07024f', 'ede75e9e874b41e39cc2e0c7205b4d52', '63ddc45238af447193fe7a96bc61d472', 'f1270d58fb654a05b47d4d32782beb12', '7a4aa76b2fbc400ca8ebb12bc16a2ad1', '0e5eaef47a7743649454b82643fabb51', '08b9c2c379bc4096a62ae1602881d651', 'f8d7d20d6e6f4bc58b3aa89bc68252a0', 'b3edfa3844e248ae91998bb9f0340c64', 'cc41c6d91ff4404cb5c9f55473f476d4', '958fb9d7aea34c68a9116451f5690c13', '89d88011c7b04d93b850f440b984ea12', 'b08dd50e4fcf4356824e708cf0943837', 'af990c73ac434ea89acc4ced841de852', '7cbb3dbcae2a4423bae5ebd50c71a3de',
    ]),
  }),
  zgz({
    item: '240088337',
    title: 'Міні-екскаватор LiuGong 9027FZTS',
    original: '2026 LiuGong 9027FZTS Rubber Tracks, Blade, Offset, QH, Piped, Bucket, A/C (Declaration of Conformity Available / CE Disponible) - LGC9027FATC390637',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, ківш, кондиціонер. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240088337', [
      'ec795db50e9447d399a0f5396a4601da', '130acddbd8024aa1842a1a8683ac7235', '2437cc091659499bbc0378ad937e3e70', '5541fc445c524e60b2f585ef63fe49f0', 'a882a64696e9494a93f20a45f4fa9155', 'c44ba9a2746a42d6bcb8d7c7b8754741', '552ddc7db60f4aa885844fd2e3d9280b', 'cecdace7550b42b3a1925e648ccce3f8', '4e5a00ae8c174330a4dfe6b4d8c31277', '6cf0d19907ce4b65bf5befdfdf99415d', '4d3c9b4ca8494971b73c6a48f8d0eab3', 'bde368f1e2954989943536cccc236ecd', '9d39a0ad0a074bb4a4862808ecd500db', 'b3c64cc424664f6184cfb3c3f5b16fa9', '86ac4c44ba2d41ffa1fec2d8bbb61c16', 'de087cc7f94a4bc4a7baf868f1e997ae', '6d668a24779047dc9e6c15ae03f8c7d5', '4e3b2072717c45eb8ba88684fe1c94fa', '3e917937ed4948e4a0f43bbfcae0bc3b', 'bef631383e384b1e81be56eb0d0438b2', 'fd02283ad4f3474e843d415015dbcdb6', 'cc23a82e88b14b2797d6c75d895d4f52', '5b36a001677f4666b81e64dd0056188e', 'f4367563656f46ae929395241e8e89e0',
    ]),
  }),
  zgz({
    item: '240088339',
    title: 'Міні-екскаватор LiuGong 9027FZTS',
    original: '2026 LiuGong 9027FZTS Rubber Tracks, Blade, Offset, QH, Piped, Bucket, A/C (Declaration of Conformity Available / CE Disponible) - LGC9027FVTC389857',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, ківш, кондиціонер. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240088339', [
      'c862d7d7a73e4e27b4de03747d5aeb48', '8a0c71d32b77496c884a56a55f4462e2', '106d0e391ca44165bd03a433e377b34a', '2176eb950c5443a5af96c47e9b2e7403', 'd375d4e166204f2cbbd804ded712a63d', '8e4267b00dd34fd5950bf49ae4158596', '46366c2d37e146078c519786bce30622', '9e2557c13a0c4910bbd14d8ed1dd6c74', '74ef7abc233943c98bed9d2fc0f1ebb5', 'de3cf28cae694e9f8d92184625ff569d', '6049b4a86fb040c4896e78aae748eee9', '5c1e393fe4c348289704a260adfba921', '65e02b8b8c5c416babf05b62675a3ad7', '3525936b0c204b03a55038e725b4f72b', 'ac4ed566e75f4a72a338cda6f5820527', 'c206de12ebc440498627c2d732e14686', '2bc503f115b243beba9ee88c669a0675', '3269b4b88b114d67b1498becdab1f54f', 'e041e1671e6f4b79bde73de9dbcfe536', '9e29926b03774132ad793542fdfb6cc7', '8ebea203ea514159b740c696659fdad4', 'd23d601722ab4b98bfd625554b29c479', 'ca028d4ef52a422cbe81645579c77afb', '837214343bfa4ab591053c800dca3dc4',
    ]),
  }),
  zgz({
    item: '240094398',
    title: 'Міні-екскаватор JCB 8025',
    original: '2017 JCB 8025 Rubber Tracks, Blade, Swing Away,CV, HQ, Piped, Bucket - 08025CH2227537',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240094398', [
      'c038272e9486457fa0046e446dfa35f0', 'b4af89dc3def469d8a606792f65711f0', 'f880979ae3c54e9fa3b7fbd8bba1d6c9', '306aac309abf42638a6e243fa551b71f', 'f37bf352232e43519d361e340605e1f7', '5291a5042c894b10af8f86f1e64d0014', 'fa8088dd847547da8510334c9745eecd', '2f71b4887bf54dec93a6b036fb3c15ce', 'aa986f5f58944e4f836f66f1680452e9', 'fe601ea1588049dcb174f8fa962b7b1c', '160d3a84ec05415593722c7b78209f8b', '055e365d2ba34e9984c2fdaf0fd6297a', 'dbaa2de2ce6549f497cb40ee762bd09e', '2d8856e329a643109e3d28fad0b8c72a', 'f4323515f7894efabcb2d4d5eb80b02c', 'b4331e5965f742fca1854bfb00a95418', 'ac47813d79c44d09827799ed9addaa81', '7c7b6bf9a9a84418b8316b33b136fc5f', 'b04394e27a6442f0a50495aed08509ab', 'ed9cba8f46ff4d2a97dd95443d229d1b', '2ebb799baf4e427cab167447cfe472f2', '5ef067b7528e469cb2dc8a9d9854659e', '642f27461aa9468dae747d30fbdaf76d', 'c2d679155af44f949d869b4108a8a846',
    ]),
  }),
  zgz({
    item: '240092228',
    title: 'Міні-екскаватор Yanmar ViO26',
    original: '2018 Yanmar ViO26 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - YCEVIO26TICH09419',
    year: 2018, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092228', [
      '00b703b07e884c83a60d72f561b312e8', 'ad301ba77ea94ff08e3b01c82dc9a9a9', 'f2d1953fc18b4e74b80a40004a169a20', 'fba46c31aaef48ac8b2212bb92b4e532', '1d074e46bb8d4da3a12531e0cd2210b0', '7dcda544cd554f0489ae74c155296c56', '710c334c12ed4c1981d63f1561105b60', '21c76e8e1e474c6f83f08fec73285c79', '8ba6a678228f49ba89e381a3d091cf5a', '96efee28e96e4e9884b2c3309826d1a0', '76856a77397d4ad99d6edec3c212da5d', '4f9f61e4a4cf4e95aa6ead0bbf5ff120', '1765134969844962bad63776cec51659', 'd290393c70bb497f956aadac38c6d72e', '62541cce78c54adb92b50422ef2bfd3c', '5d93feb99f864adf9d2a0aa9711bdf3b', '7b3255ab7e05469c9329c5d58e457ef8', 'ab90c5cdd50b4e6995245963ef076ff6', '334b83f3409244608a3eb0b5c7948d5f', 'c8666a1bf5b54e27af8fe78a401a612b', '229bfcbb837e460082a0f770ad57a3b5', 'ff83de0fba0a43069952892778775141', 'd40f037dbdda4f2e911e8ef2872f2f34', '821044d178b74a5583f0856eb7fe7773',
    ]),
  }),
  zgz({
    item: '240092263',
    title: 'Міні-екскаватор Kubota U25-3A',
    original: 'Kubota U25-3A Rubber Tracks, Blade, Offset, QH, Piped, 2 Buckets / Cadenas Goma, Hoja Dozer, Brazo Giratorio, Enganche Rápido, Instalación Hidráulica, 2 Cazos - 22136',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, 2 ковші',
    unused: false,
    gallery: photos('240092263', [
      'cf422e42215143e5a2f84385107e39a1', '3ce2788818f64ec6a0fb0b6a65ca3be3', '2a665321172449a0a3e5d6579e95346b', '833a2ff259bd4ab9b9b80d3ac1f777fe', '8c2a26c0a39c4514a4d5d32960fd1ecb', 'f504e9084205438cb139ca8f6adc0eac', '054d6a5419e644729b5c5e37a324f05b', 'afbe42fe8ef1489f990ffab82c7b23d5', '8470e47e12ef47e7b019a27a1d2b160f', '4753e9dd2db14dba841dfc4ccbac47ca', 'a8cf0eb69ab04f56b75d32e4355e756b', '97ffdc0753344db19b3f1f9a083b1caa', '60cde0c633524a7ab3ede60cbe257c2c', 'c773520f235b4624abdcc18ff27c2f02', '3cc69f5474494801ae84414d458e7e07', '58b3b6296ac44a5e8cafff11f38e1c77', 'fa6a4e7d89d14aaea18a1ecd1f6bc7e9', 'd97d27d243af49689ea93913db96c13f', '156b4aa2a513455ebe3614a1abe2ac99', '44dbc2916a5445909b2b1f527e992f14', '558af31e5d304e0f80faccaab461fe86', '3dfcdedd329540219ff54cf78ebb4519', '135e48ed6277460da46eeb94b0144887', 'a397fd0212c9436cbaf702d7d52f9ad2',
    ]),
  }),
  zgz({
    item: '240092225',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '',
    year: 2017, hours: null,
    specs: '',
    unused: false,
    gallery: photos('240092225', [
      '5aa378c1513149f6b45144548b3e95d6', '05586c3ec6284b858d0b5ce0d1fc8ecf', 'e9fca8ac2be94aef918ecdeb645ba355', 'e7d52210f1fe423ea08a7d0f1397a678', '68d2f39866804c169b586a5dd62a9501', '370f1c205c1e4048b1ae1d74bbdf9c81', 'cbd6b6b5c284482cb89ff4e4c365446c', '2a8da9e638974073a91ab26a6024b366', '8b4eb595f494451e824ebc23edc28767', 'ec61c52a803a4f02841e3654628676f7', 'aae379482d0a4de9ad40d709aeb4d4c7', '682de2d575c34d279b87eb52326291be', '2ff7bf42ece64105895d8db4e99fd42d', '2e0de39db37e47669ec4276f220a6a6d', 'da3b3ec6891540c18a7eca7e52260682', 'b5405f0c5f184836ad82f1fed1aa515f', 'e9bcbdfc2d944ceeb1224957d757474c', '5e17d361c11d4237968656d3745052c0', 'ae73bd010cfd468d9b85b9c4395bcecb', 'a96915838c2a4da7885b6e28a6f9ae2e', 'ef1452c2c7e24e59a792d8aea871c0ee', '75f9d1d327fc415c9f59d0a8e6b1a0ba', '2afe0f28602d41faae0070226511b173', 'd26c29a34cc34aadb936dc29aa841c11',
    ]),
  }),
  zgz({
    item: '240092324',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2017 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucke - VCECR25DE00005169',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092324', [
      '08408ae3cb8a46c0a67165018f7ef0df', 'deb89c8f2c70490ea8f4f48203147de1', 'c6f4d5c9aa984c228132c9601ea3d7a1', 'a179af179a014412a3b796a681879412', 'c5b9149d013541179544ad3fc2186943', '9a2cbab03d074be39325bef36628ab0d', '372072ef809a4788b08531755b1d4852', '7fc2088e4a22460295364297c807886a', '7ef05e87571d4f3c898688e5e14a93b5', 'c425da9c5688440580f957814f567e20', '3dd58b166e3e4792a7731a2483e098d9', 'cb623f393e1d4b7c9e44cc8d10640f99', '57b91d2b5be4417986f714786f2a5e73', '3c6534ec503648e7acd722025569bcba', '77de7851530d479abf9fe258845e77c3', '47505e1d399e447d82671d4981340a40', 'afc80ce2810c42629e0e9aca1ca32563', '88997d9640b240778817f1f94c1fa03f', '38fee9545e994740baac81da25f169e8', '0f93b47d5ca14e8aa0b725b380a4d468', 'd55ffaa9ef1e4847925a9ec07c09540f', 'e4e8b34a03774912961162312ac6c9f3', '1224b81c49d844078b7830951ca8dc71', '6205c00890eb49d394b0589a5a7cd8cd',
    ]),
  }),
  zgz({
    item: '240092343',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2014 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket (Copy of Declaration of Conformity Available / Copia de CE Disponible) - VCECR25DA00002817',
    year: 2014, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092343', [
      '59641570f2014dd4b023d3c4e63a73b8', '7d55ddf437994550869ff7463387d75a', '627390d161ce4136a3c746e9e8a887c9', '6f999f2f1e8c4416a3966b37326c3982', '435f25420c3d41038d567e8e4d03b72a', '3a41df494e1e47be8cdb4b0b190a9095', '8902d47f3e4d4f53ac7709a41743d653', 'ddff4d4ea9eb44f5aa448db13d8c64dd', 'cd13ee6e877b4537b79d7285d02510a1', 'd0f14b49fad34e33b451a596d4671c7e', 'ba37997621f04d4ab9b0f74763bfe02e', '8df9916ac7bd4281b71e9900f6cb3341', '623540137dff4c3eb86664d09262bfc4', '376cf20373d34ac38f7e47dd4417a754', '4de02983dc9a41dfafa41f49f4193c46', 'e4fa7dd83807483480b03f979a59de05', 'e654a25d3a5449f88d8d518c7d9179d3', '0372e944190f4455bb418ec4c92d9f7e', '18156241a6574be092c50e054eea554e', 'f78a67cec3a84a70bff9dbaed2d18080', 'db27f21c29d94b1799e7de0b2378c8b7', 'e6c87678faa84f8196c048c4d9529cfe', '393d75bb670b474f9d6801f15bec17f2', 'ce8b0dc8f23e46f798fbe9e6534fdf13',
    ]),
  }),
  zgz({
    item: '240092348',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2017 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket (Declaration of Conformity & Manual Available / CE y Manual Disponibles) - VCECR25DV00005165',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш. Є декларація відповідності CE і інструкція',
    unused: false,
    gallery: photos('240092348', [
      '78b10c9eea5141929778beab8b57dc52', '5a4943d4b7c04286b381af9fd4a87e0f', '071b0f0593c644b984d907423274df58', '80a80ab0be9542c995f094916de96731', '0a7082f122154943a03d25974981e8a8', 'f7b5c131b13046eeb77fbf3daa2e03d2', '211af86c40c843a89671fdfa098ee87f', 'b719613c3c4940f8b7b1213f00a3ec09', 'fb21ff04a7fa403aa7532f16f3614450', '87ddd5e6f7c24d22a186ae4b8bca03b1', 'fad370a173294f1da8ffaab202d9b9d2', 'b1969b9aaa1c410eb7304effd1d54ffc', '7272e53058c94b3890d1cacc93c544d2', 'fe029fde3f5342f2abf00b02e92d0aab', '0b3ecb7d706b4779b4c7ed95a3b42744', '28b630c780de464088331b34416e29ce', 'ab76f67003994842b6d679b160381e51', '3f5d84f9429a4df8b15818ef1bb57bc4', '4f45bcf551454316961745a7527a5110', 'eb5dca994818411490e2b0cbc30e3d4b', 'bb391c9eac644874a78dd1d927764621', '06f9e581684f4463a256bde09dc9a07e', '8d6251d991fb43a08c5204773d395b9c', 'fe7960e5822f4d9ca6e2b1a3a2fb4b12',
    ]),
  }),
  zgz({
    item: '240092350',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2018 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VCECR25DJ00025252',
    year: 2018, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092350', [
      'c963e0008f5c4a04ae079f474d5d93e5', 'b5e2b2b786a644b8a4104bf74015a428', '0bede377fe2248d89fa4dda7f2ecda9d', '9c64867299f44f4e9c8dd46e04865dc3', 'c29a7157ed834e2ea0c1bc7f3115d8f7', '817614d3b681464faee4f3cfe47336bd', 'bd5771d7c2c44051933026db26be2b3e', '4f9f5b07eabb48fb8d353add5c63a355', '7c5aebcb1c0440919bf87aa2e47fec2f', '225b4f9d4c764eb0a299bbb6975e6994', 'f38a1c2a48f941fba908182490418879', '81c38de82ab5483491579cfbed689403', 'fae78b98d63e43ff87a9ce1dc490fd01', '449b432b37f44bc3ba5afaa5bc9354c3', '31fd59779b2541c6a33cefb198739687', '7d0ae6e9311141bcb6f08b1761e5ff51', '888abc9f045b46de986cc2ed83a7a502', 'b9b8dba192964a92a859a02b077975eb', '9eed770770024b65b06b38424586b82a', '913ff77a24514f64bc87c285aeb25a76', '2e3c9d2f3e8340548ead7c6d14e8673e', '4d8816b1dc1f43318dd36c451723cb5b', 'ab1c344d06b04e3b9ce5b9bedd0216d1', '8fbe3efa5c2b4be4b0997a8b77d161eb',
    ]),
  }),
  zgz({
    item: '240092411',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2016 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped - VCECR25DA00004468',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія',
    unused: false,
    gallery: photos('240092411', [
      '4aaf3136cce346b8879352ea2ffed249', '1cbde3c9c8f2481eb5eadb371232d33c', '2a0c1cebf0fe4d58b159df8d00c7633b', 'cbf6d6167c514ff18104951056f2c290', '8bb5b5b203194f74a1f7c9b2dd761355', 'd0cce69cd7284c77816990f364ed8161', '4a5b10f98aea4deabdbc40b48a4486fc', 'f4e50e69115c4a2097de88bb2e49f312', '514dee58eb084b7ebd7c82b88afda0ee', '0afb77b6cf1b453098b87963de77128a', '6827e6411ea6467d90aa5717d28128f5', '28ca7737713e47b3bfeb12d828314443', 'bf5c5791a08a44df9150191968173a2b', 'ae5879ec2b8446be978ddf97d0a86c9b', 'a4c7b6fdb06846029ec6a51e953545ac', '800248e6ba4e4ccc91dc7df198106709', '229780bb7f284271a70bbb375ba19de2', 'b0e3966878684d55b7eec4f70f570ea9', '5b859aa9eb714f97a2fc9bf7e3007242', '1aef7ceb9064436d9331707d05b5ea07', '552b9750e5e64341992527fb722d1ee2', '085a9ae8e2f24b569fdbe440bea2ac8e', 'c461b4e9b46341eda3503d6df68cf670', 'fc8c660f35ee4b45a64a08f503efa1e1',
    ]),
  }),
  zgz({
    item: '240092412',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2017 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VCECR25DJ00005261',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092412', [
      'cf9f36e30a03421faf425236676d5c00', 'cb943330050346b8a0d62d77d45987a5', '6ca3f6d841f5437780d53a5be9a58004', '902c75e6544d442d968ebbe0de67e423', '65fe5ab7acc043cc8420ad671f1870a5', 'add8579318964fb2bb5ed24f9406a7c8', '7d10330a0a7f42a089278d4e01531dfe', 'c6615fdae4a044148f3f58872f5351ea', '4558387e4ed6479293d123f0e6e18298', 'f4c690ab0c0d402cb89981130685e950', '38a74d683f774166a1be16ab7842d49d', '727dafcba65947f1bd52bec0516720e4', '4d0844ca447342e89d2a8368d796dc79', 'fd20807b132341518793602035117184', '191f570484e647e6966210a084cc864f', '85aa250461144a45b2d568ba13177398', 'a64c57eb98ac4cfb98f4ad2a70a918a7', '34548a80a30740a8b026a245726084ad', 'ebf221319246432eb7146b49d630c5c1', '8a441e5656f7471f8696c748d553be31', 'df372f0ba04e4be08b223e40b7fd8e40', '17eeeb5620454f1a9ea09447caa2c0be', '0521737a75604c16b03ce0a0e1fb6988', 'af0c93bc9f5d4427b83bc2beb3c76c26',
    ]),
  }),
  zgz({
    item: '240092567',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2018 Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Pipe, Bucket - VCECR25DJ00025980',
    year: 2018, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092567', [
      'a809f952bcf844899d40af76e2be7957', '7ac9ae13bf754b0186c7217f3b12afb0', 'c20f36fec7e147beb1ba8b1786ef264d', '7fca7532d86e4e2ba5b28efa6c49257c', 'febb1b9023fe4173b361d9dbbc486362', '44a1c008de054798a3822d29f8147af8', '2815c4da637348fabbd2b8f8f1cf9c06', '49a3cf106b5c4feb970f1ebfd12a63a3', 'b24ed18754c845bf9f2032576a209675', 'b744484b1b4f4127b0eb2de8b89d2069', '6bd69de1fa7948a4a614532c36934bd4', 'cdf3cecdb1804e41a1e0128291452f9b', '7c5dc01e67ad44dd85dd4bb3233dccfa', '9fd05345801b461fa0b71e5fa28692a5', '56fde67b8d0240cdb3c7c719ee3573f8', 'b5e34bb04e76463ab7af4d480d24b6fc', '07436af9db734236a4a40839ef911728', '47ed80b8c0c44a3c9eb157db5fc2e3f0', '10893d6bc2124f64a600b4896911bcf1', '4da55244a1f84c1293bb9bf30e74f7a1', 'd1b4c097379a445fb9c06dcbd36ed4ef', 'd7674996f38942d7941d180b7e4f05ed', 'f3ab43aaef294981ab9376ef8e5f7369', 'ea0fdb38edd74a0f9fdd35a090a0d87d',
    ]),
  }),
  zgz({
    item: '240092606',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: 'Volvo ECR25D Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - VCECR25DT00002923',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092606', [
      '89d7de63e67c4fccbe95ec1b184a1833', '48dc5a108946488cad38c64ee9f30d88', '311c3120f7ba4682961bb97ff8526727', '4652547fb4ff4424a98f9f84566677f5', 'a77c05db524e456bbf384e88a3109ebc', 'b3aa1aa720974ff7aa8a4ba53af5ef4d', 'e9b3fe8fa3024f7ba896f4efe1a9e5e1', '032c925d165e430cb205f74d87d02288', 'e0543348abaa454bba38866bf63205bf', '5499937626e04c8fa6337477d859aec4', '63a09950c9db4741bab4c7b165d1c50f', 'bd9f32a6eddb4181b8c25836db971deb', '331540a9c5794b28beda890e2478f09e', 'fc2e3a8c915d4b82b2408718bd8e94fc', 'bed84581997641e1ba0d01641c6c4124', 'fa52f1053d2a418ca4552f7826450770', '8ddb61eb1ff84d4fa27ba432041e1a37', '575e6f789c674be9b65224bae90d42f4', 'fcefd0e71a8e44fb965d17397a882468', '6721ad0dc9e74e66901f1e3927d05b68', '4076c0536fcf4ecca3cb4f5f9a823fdc', '4f49a0f63e484e0bbce353de2241a99f', '14f6396de1f3483a9e0486d4f51e8e4e', '4beb9669da8940adbc708b52ec7612b2',
    ]),
  }),
  zgz({
    item: '240094028',
    title: 'Міні-екскаватор Volvo ECR25D',
    original: '2016 Volvo ECR25D Rubber Tacks, Blade,Swing Away,Piped,Bucket - VCECR25DH00004280',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240094028', [
      '74e4d5e1990f4643b0a0d57900a083e3', 'dcdf3e4d622c4d2ebf6f198e81fa1a69', 'eddf6a7c2dc241ecb2a4b93cfe19823c', 'c44ed7807dd4414fb869eeb65a17bfcc', 'ebda50f5310643a58cdf3cb5426806c1', '09ff2434c6d948208670a69cd9967a45', '16e561dab0ee46edb687a2d09d690428', '562edfff47304acfb502cba3e62eab1d', '912c6ab71c7b49bf8c41086895a0f6d3', '5a8e28fa4f0f48dd90666481db7dd6c9', '89eb68c7d6be476f8bdc40ef0a2a10df', '6a244cd1555d43b5b79097272475aa6b', '9e699a4ab2c04d3b960ed39dfd1d87e6', 'b69074b521c2421aa3168e04a726902f', 'f7cce76416b741c5ae0331cba536bfb0', '2596190469c94d73a83fe0167901a1a1', '8122a0c1a9c94c958fbd6d8faacf4f31', '52ad72a456e646cc823f1af038aa3bf5', '01435e46d6bd4f8a89fa803b8e8fa089', '5775215bdd704759aeda9f6a14543b0a', '8a83fc3b18754825904a72785f439aa2', '555ebc338666489f8150e37e7abf228a', '796b5c011592426abdcb897e2dfb427c', '3fc01ef089ec4520a5020f1a8f7f1070',
    ]),
  }),
  zgz({
    item: '240092333',
    title: 'Міні-екскаватор Bobcat E25',
    original: '2015 Bobcat E25 Rubber Tracks, Blade, Offset, CV, QH, Piped, Bucket - AB8B12205',
    year: 2015, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092333', [
      '0a3c3579a5d5480f9c5e41e23ae7a70f', 'c88fd5979d09483bbec3c99334b6099e', 'b155061cdfed4cb39f9cb43110cb1e83', '4e086ae7a2a84434b590020e65f7fdf7', 'c10e9195865d44bb83f0cf880c0f8804', 'ea2d1a2ce98e47cd8919f7d5b2d28acd', 'a5dcc1130f54414b89fb73957e0fb175', '6fdbeeee89d84103b0ac1c91f7578cfb', '1fbf2f23953c427290a791820487d26a', 'b8f234fcd3a148f7bc67c6a4b003f5b0', '819fe23e907643d898c0d270955042e4', '94f0857cd0df42f08b85223206d8cb25', 'ba9be22408bb4fe1a90aaa38faf4675c', 'e9026f6dbe9d4851bab9e60fe2c28d64', '0d0f6d6d7b8142ac9851dd47fcf229eb', '787b6f011e7c47469c0673cc62ca440e', '328741bc5ab84698a01ebb81a8e0431f', '49c04b794ccc40a592b01894e72a438a', '1384a2a2cf894ec98e6cbf26ef60789a', 'dd0e10e0cc284b05a27aff8c36d6d0da', 'd682112cc67c467b91c2c53291090658', '8b43a06cbc3e412d91bfcea229826f2d', '144b2dee6bec4f6d88c56d3758d3b7d0', '3c62490efe814e5c80aa4dcc1421c8b6',
    ]),
  }),
  zgz({
    item: '240092347',
    title: 'Міні-екскаватор Yanmar SV17',
    original: '2014 Yanmar SV17 Rubber Tracks, Blade, Offset, QH, Piped, Expanding Undercarriage, Bucket - YCE0SV17EEAA00808',
    year: 2014, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, розсувна ходова, ківш',
    unused: false,
    gallery: photos('240092347', [
      '7ccecf46ec98437aa3bd9c1f44d35443', 'b82b6bba7e54438cab5ba14b2b1de55e', 'e636ab56f291450f9e696ebfa06f84b3', '6efa4cc0b54d42d48d47d872a07912e1', '6d49aba1fdbd448586c2023efd389fe2', '2d9e426ed98d4383bc2d535c8fea7844', '38161912941442a4bb21fd421812c24d', '5132341cf95641d9b92f46dce7f57a82', '522ad86fcb9a499586e24e09599a2cd7', '98642204a04c4b929a7dfee9ab545abb', '812d63c70a214b6f988cce60d6aee08e', '1ef47cc6537e4c86a6365dd4200dfc79', 'e2376e65e02c4396ae3f60a9c8f9d7a5', '818e7b030154402f972e9d8f31c2d21f', 'd40b5ce5b07d45abb8b20fc8369a44ef', '908febc391604c4e8f58cf11472476a7', '7c846ef5b22445c08fda2f9f4415fb52', '6289c7a4a8fd49a8b38cdc87fa7057da', 'fad38b93f36f4e528e8b55061f5f1985', 'a5d6f61d605240d2b7c1ac6bec6410d4', '43deaf2ee86645fd9b148df41df4fb21', '010e37f027c541f18a23b374d9051460', '306e24f370a0478eaff50c90601f6430', 'e57f45d65b9944368d08510bcc01ab21',
    ]),
  }),
  zgz({
    item: '240093272',
    title: 'Міні-екскаватор Hitachi ZX17U-6',
    original: '2022 Hitachi ZX17U-6 Rubber Tracks, Blade, Offset, QH, Piped - HCMABK50A00033397',
    year: 2022, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія',
    unused: false,
    gallery: photos('240093272', [
      'f8c1c73555f145c9b339bd877f98b088', '167c25d2da4c453ab524dd4a706e323c', '56c9506e23614d028f8541009e1e1eca', 'c0d32b0aad604b578a96b3bdfc23e729', '5cc380f45e564900bb148b1220595c13', '22796b086be74e62867886e7e5cead79', 'c13a99b59ada46658d94d7711abc1a95', 'b91eef3d812d463e8b22058296676df6', '3562022661174f35831a107559f2a3fe', 'dcee43530d8f47498c95ea4933dcdeab', 'b16d03e8d72242c0b28eaf03381112c9', '17cd6bf42b3e40678983024c2d13eb98', 'cfee1798f2774f2b805fada587a2f8d2', '58102de5a40a4800a141bfdebed98420', 'ed680fa09f0f4452a1d523c7d3fede43', 'af04c2e7feae4f119edf328cd67f1797', 'ea1f3592fbac459b98feb418386ccfc2', '4918c808a91342d8b988fab427c41df6', 'ccd9cb4df1184b24a1f4e4f68d9391cf', '73d1a18320bd4ce8bae83de778d78f6b', '563f4921a3df4608ae9bcfe6f8e4e0dd', '096fccf26c9f4800ab8cd9ca421dca7c', '2638408efc3941efa839cb1337e8c836', 'c85f447462da4f91bda75fed2c2b7512',
    ]),
  }),
  zgz({
    item: '240093273',
    title: 'Міні-екскаватор Hitachi ZX17U-6',
    original: 'Hitachi ZX17U-6 Rubber Tracks, Blade, Offset, QH, Piped - HCMABK50P00034249',
    year: null, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія',
    unused: false,
    gallery: photos('240093273', [
      '6917f46e90404d699127e8eb44b810b4', 'eb7a1bd8b8b34c27836a51fb562062d5', '4471915f5bdc4dbc8c3184f66c9e9005', '02139c8aa7104a279195b1821bdc255e', 'e9331219afaf4d09b6b2597b41de1013', 'c61c379b25974333982dcaf1c73d4344', '16bbcd86987242d6ba860eaeda8432aa', '2184067247b84365919555b4a606c1ec', 'dadd41b3891543e383bd3bbe9bbaed6f', '412aaec65ea54235ba2161bf2a0484f4', '868f6c3302914956af26bd5253ca84e0', '48183d8618004ac997de2f9ce744bd83', 'ffc4bbfd95f64f6291607134d5721f38', 'e73512dbf29c47ec8efb2c1fb55dd911', '430885abca314f369b84e3514c8c9848', 'b7c0f2d4becb4d65936ec58cab8ebe89', '8959254041ce419ca7ab33e682c3e034', '82048b53b19546b4bbab7c34191eb04e', 'dbfad9a5bb764da49b2972b725973a78', '821f4318c35d480ea694ad0d9f635a13', 'e2f18a05c72a4f188e8002b6530cfe04', '21a6f23084f742c6b2b011df5e294359', '01648687c925421c891c7e20677934b8', '9dd5f0b5ab5247ec833d72327dd5d3de',
    ]),
  }),
  zgz({
    item: '240093275',
    title: 'Міні-екскаватор Hitachi ZX19U-6',
    original: '2023 Hitachi ZX19U-6 Rubber Tracks, Blade, Offset, QH, Piped - HCMABM50V00034396',
    year: 2023, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія',
    unused: false,
    gallery: photos('240093275', [
      '97f4e7b021ca4d4bbcb2b64a77ebedd4', '24f7a5b5bef046de9b025704b68191ff', '60ae1187390e46678999ddc4334cba14', '8a522b3c772a41c5a654e580d3019260', 'dcccb1454f254379841eb2b3d6faa6cf', 'e6e2540052964536a43207fd1be72b48', '6cb6ad82694046cbb63abc4f0ec7e440', '6069f1bc12224a35bc67b8f98af086fc', '473ee8dfd9a04768aad94479a09c3a08', 'cbbad2d2908d4461aa38d6f8526b7352', 'f40ddd2264004076a4cae9bc64373f6f', 'a1ccbd9307b1497483324c827254afad', 'a9b7f6387797494ab123682e9aafe40b', '2d5b06d12cf940eb838aa0bed705ba96', '81778b1c0037401faf642a73d64848dd', 'ee4c3c57f0f14d43ab8a91e65e47d704', '382617f9f6ac47a5b7eaa04e55e744a5', '7ebfac5b04b44eb699f2717f22d004cd', 'd8f6fbbb09e44ca9a206f6d605cd97e1', 'd69725647f4b468e8ba0ac54dba8c867', 'def73a0327244b398a67afca2c45d839', 'fa0f0120ca06471bac09fef1cfa21775', '6a90c103271f43e19c11484f96a82032', 'a8aaf9f6d96845ab9deee78f4a88ddb1',
    ]),
  }),
  zgz({
    item: '240092752',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3 Buckets (Declaration of Conformity Available) (Meter Reading: 994 Hours) - JCB016C1AN3145898',
    year: 2022, hours: 994,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092752', [
      'c8980542a7d54e63962a6ddc6268e9bc', '9b8a8dbdbd634929bc4579104473dbba', '83e2529c86fb4e0e9add21b7a3e91ce9', '27b32bcda966453aa13d77ee025d5e7e', '49c1db6af7464f0db659d4c2c8c41e63', 'e69223c8005942a9934c7a4317c40b4e', '059385440ef54d12bbdf97eaf13dd6a5', '2c4525881e374d1e939e35431a41b418', 'd184e98342cb4a48bfea4d09840d07cf', '3259a5fda064409eb73320eee6db40c7', 'ead6cf08837442d49ac141628c354380', '6f762445962843f0a8f1da2762995df2', '9205c878986a4ea0acbd6ef16d84dc8d', 'dadf3ebe5f84423f803083fcd8eb292b', '84b48d54d3e344de808e99e85e313724', 'b22b2f8173ca400a93efdd5c2c4e38bd', '1a78c589e4eb49e1b153538bbe6af679', '7ed6bbab8dce406c86a92c8dab6d0a96', '27c635416cc94759b256015053d226bd', '71a895d634bc47b1af37b5bf5cdf4e47', 'affa3cff5d1743aeafb5c8e7b8b8aed4', 'f7f3e418141f41a7bdb89b536ff9c539', '3129374b3d5444e19c038a41bfc86d85', '7eee210813384608909c38cb9da3aa29',
    ]),
  }),
  zgz({
    item: '240092753',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3 Buckets (Declaration of Conformity Available) (Meter Reading: 902 Hours) - JCB016C1KN3145958',
    year: 2022, hours: 902,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092753', [
      '578369acf1e04021b4f4c0a9266ca424', 'f2e33d12c5334cf1b4748647db0342c3', '600610faa0844475bb2b01a893d05be4', '97728e915f5a4cbebdb88f9db88933db', '92fab87fde5c4c779caf25fe5a4159c3', 'da1be9dadfdd439da169bc76412d2f4f', 'a887afe93e3f4697834387bb1706f025', 'aca5d1e90c7046a2b144b1105dec0d36', '277e69bb0ac14a7e95dd0cc4c1173185', 'c981f56080eb43b1bdbe04eb27df32d5', 'b30827a10de343c9a6c2df2fc63476c9', 'f3dbf7048c18452b854cbddddfe93289', 'a4b4291909e74136976e62ce719792e4', 'fcdd85363b334c18bfd39ce167ddb66d', '1dd7ec94f4f74c6083d54fc09b82730e', '4fee0bdc016c45088ee38570508f1fe7', '3a7c2e389a01427992043bb637097cd7', 'fb8f78a350fc489ba594f14669c2fc5b', '2f10d15dd4884ab68417eee1458f92ff', '97a0f47e082440269efa0385c8c554d1', '29d8c468e1b640eb8c775e55dc306756', '716c825e867f4e19a2e779e72c9be8b3', 'c15b7e572bdf426c8117190104a44083', 'acdd340e3207478a9c37e7192496d632',
    ]),
  }),
  zgz({
    item: '240092754',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3 Buckets (Declaration of Conformity Available) (Meter Reading: 706 Hours) - JCB016C1VN3030085',
    year: 2022, hours: 706,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092754', [
      'a97adaa6e6554f70a5d57192940bbd82', 'b236a0c9ba5343f9bfaaa83c4786a8a7', 'd8bd5a9ae47e4f1ca00b33f03de66e42', '869080c55381439dade10003c6934433', '49b6f62a6feb48538483680a76d1b9d1', '9e51f8a456144b058f80f4ddfb1bf10d', 'c53ba8574d294caeb288160cbc662c86', 'dea0a31e19614615b9a2ef5309493169', '7239ee0a84434bfa93b3a851106f0051', '69e101ff87b54227bb9008bc86d0bd78', '2330cac97e2642738820817308ccc48b', '6f3c07f225464610ab2494fc6c373189', '42dbef24bcd949208fc73f3fc0366387', '3eecc59b2bf14b1086794983e15d87a8', '4ed5826b111947499baa2cdea73dd9ae', '215693bbb9d741fb9fa40345c9c8a065', 'c8bf5adcf6c647d2a722d022feece446', '9255cb50e2274ddbb2057e4a64a3ba15', '71a4c66b07ad40e5a65e6eccb478cb79', '067a1a861f6a48a48b19563499681869', 'ba73d04fc0694eb9a38c816ec65e7214', '1a17cab3d3064869b5a72d243b16326d', '8ce746891da34df1a6d1518b36163036', '7a27fdca0a82474a85c7b521a35823ad',
    ]),
  }),
  zgz({
    item: '240092755',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3 Buckets (Declaration of Conformity Available) (Meter Reading: 703 Hours) - JCB016C1CN3145980',
    year: 2022, hours: 703,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092755', [
      '3c73c9f22a0948caac277063bdc84a0e', 'f0bf629002b041648dc8a837acc23d9d', 'cdef1fd0155441119295cf2e6333aec5', '15fa38fd99d14db3bb87adac7daf2e03', 'f4b2c011fa1543fe90dcdd8031280170', '7cc67238357b4e5582fb87ed4375759f', '3e211b48063343b0a532b18128634b4c', 'a20c2897bb664b019a1b8be37e8ceecc', 'fd4e5b24148440dfbe0ce341b32ab553', 'd8e7163829e040d294c41a01aa215054', '86f8c507d6b84a5d83d781e99387f818', '9f4449fbafb04e119e64efd53d436c7c', '7549720825624f0c9e181765732d04d6', '2e848907ea2748b480a759538f62e6e4', '7db78722a6f443f094fd119ea2478577', '0fc14dced6d24135915099772d7f5aae', '6ffd3ae4606c42beb46396a75f95c6af', 'fc9c1c9954494ba1ac7c03c05e5afdf5', '6bd578a6bf3d4ee482ee66bb6782ee56', '835e4797b32a410aa6eea0fa2dce95e2', '9a4a7f205f444005bafefe47180d90c5', 'c8688255579146449104d6e924092f27', '3d3b489b442b4372bbe53f3d9253e2fc', '2c322156a985477b8362ee8dc5060c8c',
    ]),
  }),
  zgz({
    item: '240092756',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3Buckets (Declaration of Conformity Available) (Meter Reading: 649 Hours) - JCB016C1HN3146052',
    year: 2022, hours: 649,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092756', [
      'f5c37ee8c5f04db2a315feac5e1ec02b', '6874a81cbfe24f7ba235c394e61da171', '02d00f79223a4ba1bc1dba52d2a73e70', 'f908ffd11c17437cae7886b5ea00bf55', 'f7e519822a6341898a2520ae0af8f4b5', 'b73d32df40fd4f1093a507e37b197018', 'e8088881be074a09be9185bba74eed6e', '61677a001d52412a88433eec9d9acb02', '888506e2257141a3b0f43fa95afb45f6', '729d0014dd344fa2a425b298ffba2e8b', '74c911dc1e7f45ae9f6d61018948fe70', '9115989676af46588dd64b298a445dd5', '089b10cacc344ba49cc65b6216cce7b6', 'b31352a2be364eacb06bcbb2cdfe6071', '6b95fef4d1ed4f43b20b1476b6c857b7', '0558fdcfac394ba6b33263a7429f80ea', '218a4e89607e42edaad0d66b259a6fd3', 'c9417d1a4b5f4edb9e509e04bf85b275', 'd9f02b5943024365a649b96c68438a23', '4472c5a83c8e420ea147ef07238d49f4', 'e0a92eb94f3f4848a0e461358cbb1a90', '3c605e8be06f4c2d86f4a2281b673db0', 'b63251da2d284661a63df6e8ea292a06', '39fc8b29e0e942639a101511918bc458',
    ]),
  }),
  zgz({
    item: '240092757',
    title: 'Міні-екскаватор JCB 16C-1 T3',
    original: '2022 JCB 16C-1 T3 Rubber Tracks, Blade, Offset, Piped, Expanding Undercarriage, 3 Buckets (Declaration of Conformity Available) (Meter Reading: 682 Hours) - JCB016C1LN3145708',
    year: 2022, hours: 682,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092757', [
      'b909594df73a4dc6b67187d16bf800ca', '8dc27152d4754a81ab5c790d089da0fd', '488b378620c34b6b97f60c8e0c426967', '016974008e0942cb807bf4cb653abb06', 'f3f3678b80e449378ca3e0dcd48e541f', '2a099222e053470784f32e069fc53057', '984d236abcdb4ba09c23d1206f9fe3a7', '63e4bc060b7e421197263e61fbf4642b', '698277746cdb4a3997b831c9ada41307', 'c1c50d8ecced4704b525cd46c816389a', '8f1691128abb4741aa55607303e519c3', '63502e9b97a14ef48e2ea12e9b8b8dd2', 'a5d903e59fb448aab2884b8741d3c017', '8a882f80522b4793b220cf3ba7e93020', 'b7b896142d59450999c2d18ac70abae3', 'f47945958c31450683dcda193cd8ea21', '7612d183fd7a4e7a82cb8cacdcf2a70e', 'ae2f364582054493af3b43c10f969939', 'dbe4e56a1c694235a9c11e7e4540d980', 'd3e0be531c364e97a97e08b68e475e71', '6de5bd64345e459ca4ffca468a3fb7c9', '21df92af1b494966884ff04260e37916', 'b004e4037f524bd0910b426e7318c155', '075c76d621ab4ed8bf679e16d5363813',
    ]),
  }),
  zgz({
    item: '240092498',
    title: 'Міні-екскаватор Bobcat E17Z',
    original: '2019 Bobcat E17Z Rubbe Tracks, Blade, Offset, QH, Piped, Bucket - B4PF11093',
    year: 2019, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092498', [
      'caa68ff12b404c13b294c998253cf8a4', '1547d85db2a94750b6cedab9a31a8337', '106cf6b04e9c451bbebee99cba40d507', 'b37d9f04d4894d7a908717a5aa2306f0', 'df9fe0cbcd12426ab7b083e1fef9b647', '8bbc8721f63a4d7e90f9000dd2565dbb', 'f2d6274717a841cb9983fa1d4e66958d', '9987c522a10c4045b5a331508634cffb', '7caa69554add4815900d1371b11a9c21', 'c20817350acf4ac3bef02a41152190b0', 'd9f8404dc9e048b39136f735ad8e7e89', 'cb0dc659efc84fc7983995cf14985895', 'cc72d4e0a9054cf586962d9af94f7ede', '84ac01de57d44702913f94733172aa25', 'de0c49f88e754cbc8140f9a1be76b9cb', '94a536d7685b4263b491aac4cf3a489c', '5728562fc2104d20af1f20fea727f3d8', 'd50fbc6a67084813bfedc9e5b13fd310', 'd9d58f3ad6ff40c8a39fefccff93e180', '2778d60c4e584a9e89d6d636eafbdabf', '448b3e99652b45d89a0bbe7090b22e58', '98792be656d14d708039484adcfa5df9', 'fe0621452b124fba9fc04595638dc016', '6d94e8ee2ca7402eae93c0085175f46a',
    ]),
  }),
  zgz({
    item: '240092227',
    title: 'Міні-екскаватор Wacker Neuson 1404',
    original: '2016 Wacker Neuson 1404 Rubber Tracks, Blade, Offset, QH, Piped, Expanding Undercarriage, Bucket - WNCE0901TPAL02208',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, розсувна ходова, ківш',
    unused: false,
    gallery: photos('240092227', [
      'c2613ebff54a4675b500ae7064ca8986', '7398a5c965ef406eb16f7bb71421ebf3', '076072fcc26d4861b8c49b35fc9c28a4', '98022222435d41659baf921116947fcf', '14de9ad2120a48c6bfb380d95f5d04c8', 'eca3346f5a334e61858f3fe633569103', '5a2e6307ba4048bb937dcc344b0f1172', '3c9b01dc83b243e8a925e7198f579b57', '524ea2a2152d42d28e63589355eeaab7', 'bfdf3beff4ac40999aa94f0d123ed2eb', '9290ece6d0ee43a49b783da563a14d04', '81dcec865c0e484096acbcd157ed16df', '72093e7c6c2c4c3b872d8e562d6f0677', '9d43da7eb42840a999e7ed0c70a58d2b', '2457ce5a5a344e13ae0b51b99c009b25', 'c2aaec4116274a72b9ccb831c060a1e6', '064ecc23c0784ed3ae160c24471c43e9', '2d4a02e7dcaa4d19ac3f3ff52271fa96', '74705c2af4b94bd895d618e802f2aabe', 'f47013930768458fae39e3ca7c3a7361', '838e85e0c1364251a7948bbe4cea8bb6', '63077291fc8f4dc5ab68544a7fbb510f', 'a3138abdbea54773bbdfe0eaee52ea84', '0b70d5e10c434bf9a2d9069fd3d4c507',
    ]),
  }),
  zgz({
    item: '240094026',
    title: 'Міні-екскаватор Volvo EC15E',
    original: '2019 Volvo EC15E Rubber Tracks, Blade, Offset, Piped, QH, Bucket - VCE0C15EP00015017',
    year: 2019, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, швидкозйом, ківш',
    unused: false,
    gallery: photos('240094026', [
      'de82c9a408614a86bd8b1404df1686ce', '469e1b07e5a14d109a898af10af1cb21', '60516810c5e6469bb87262bf51f8aadc', '301ded1f39f0445aa68c55e83664c8d7', 'd60d8ba265414694b1be233c1214dba5', '970e164ddd694f32a1803d57cd2d6ffc', '5eb15a6653234ff8903586e88b09ed4c', 'c725f501b21b4a5aaee7423f5d4f60ee', '0224038ae2ed4fa09f894070282183c2', '0cbe559d880f4fd2aa8b7a2086a18018', 'f774bad67f304918807aae5c246fe8b9', '0de1550ae76841daa97b023de761bd46', 'f20894e0a9c84efcaa9f01a76fa89a22', '52f0ed623f3c498ea1f0ceb3b4bf92b5', 'c534d1b71a5a44f2bd9d4861e5014088', '258264cbfcf44368899d08ee002eb300', '9081734dc6304db7a2175203778f5cd7', 'ff7c659e612b4adfb1c4ed24d15d1e61', 'df306daabf3142c9a74694e14b11ac15', '6558e1a19f39475d870618d035e67948', '1897e7ed46d84ba187df74f70481f42d', '687b9f2a52f5426bb30b45245b005ca6', 'f8665d089f1542bcabe25c0709b71f2c', 'c27b6c22e4db4c6e88b83664cb0ded51',
    ]),
  }),
  zgz({
    item: '240092144',
    title: 'Міні-екскаватор Yanmar VIO33VCR',
    original: '2013 Yanmar VIO33VCR Rubber Tracks, Blade, Offset, CV, QH, Piped, Aux. Piping, Bucket - YCEVIO33JDAA07174',
    year: 2013, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, клапани безпеки, швидкозйом, додаткова гідролінія, ківш',
    unused: false,
    gallery: photos('240092144', [
      '3e9cf5e2a8394016a970d6b44982cb85', 'a75551a99127402c8f98da52e8856fb0', 'e12a4e36a72e465baf809931fd2faeb3', '0e13be7fada243e6b75bb2cfcada4f85', '4c7a73526a494618ac35dd95cfabea8c', '13e62c09cced4fcfbbba2ed68b6597f4', '50fcd579b77142dcbc4847d522a5ab70', '97049be84996464d800e63d5e72fbb8e', 'cb1225e2eba444f786f3157443ac2d9f', 'debbd0c9d24d471ab1a65cd88686324b', '978b342ea63c4e6d990b5b67290f67ba', '5160128a6cac4e6c9ca38632707d9440', '9dad69807a4e4114b1cb170cba33198a', '4b694be9c243464d9cce62c0c30475d9', 'd84563854a0e4fe881e9ea319c5a9fa0', '7396bc536d2c41e1af75e09cdb126c9f', '7e79387c26434981b7a6d0a73f68764b', '5615bdaf63ae4f608f88317d68b3dfa0', 'dc23d55a3eb643d998d0a87896c4003b', '5f0f72690178424db711d53de51f79c4', 'f0c32b19416b49ea9edca1fa5d306098', 'f842819b842945a18ee57f296e07393b', '39ca1585231240369dc42488b50909ba', '1de641d6d88f4c328164654635c3a5e1',
    ]),
  }),
  zgz({
    item: '240094025',
    title: 'Електричний міні-екскаватор JCB 19C-1 E',
    original: '2021 JCB 19C-1 E Electric Excavator, Rubber Tracks, Blade, Offset, Piped, QH, Bucket (Meter Reading: 329 Hours) - JCB8GAB1TL2868201',
    year: 2021, hours: 329,
    specs: 'електричний, гумові гусениці, відвал, поворотна стріла, додаткова гідролінія, швидкозйом, ківш',
    unused: false,
    gallery: photos('240094025', [
      '7085b3a8a4e349038b7d4c031428ac64', '455f212f48bd49959e922e74c89c4452', '8e7c966a62334b37880f543eee495a6a', 'c0731ba664bd4548bcc6f8b7def454f3', '34c2e61f8c7d4f9fa5244eb21946253b', '5a2442ab82384a16a7837395e4b2ac73', '8bf1955ede3142e9a4ff809c768ea11c', 'dd2d1edb0aaf45afa4171ed882966e9b', '1b5c8cbe126b4d5687612d435857b3c8', 'da5d9f2469ec42ffb95bbed0b7377bdd', '8d5d8dcf6d05498681a5a35c4e02abd0', '972937f7f93646ed9243679852194732', 'ecd289ee06d84c99b3d9fd18f2726fbe', '95547eeda12243cb8edfa072e1d2f9c4', '99822729decd4d40bd94df250975cdbd', '56371f37e9f2414c9d8219fd2fabf601', '7212218d05b04a6b9990f0ac0a695088', '91ff03b969a249b8ae823225c46cdd8e', '7a622b4a6ce741de85dfcd6024129e76', '678aafabd53b4cb6b9357215d1c4d5a3', '919990eaad234b22a0c7b82087ca9dda', 'bd92fa34170c4b5d80b05a91076d61c8', '035d3566e2634529bd7a7ad9f5d5795b', 'bfacca4704d6422595450696cdd12e85',
    ]),
  }),
  zgz({
    item: '240092349',
    title: 'Міні-екскаватор Bobcat E08',
    original: '2017 Bobcat E08 Rubber Tracks, Blade, Offset, QH, Piped, Expanding Undercarriage, Bucket (Copy of Declaration of Conformity Available / Copia de CE Disponible) - A4BP11839',
    year: 2017, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, розсувна ходова, ківш. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240092349', [
      'c077a6ea630243e3acc0cfa1cdf9b50e', 'bd123b06d5674fd6aa59d14cad8fca81', '71881e5c4583409a925d58115b1a197f', '786fe39deed54a54adeaafe472a1f822', '22685238e79241c3b0254743407ab7bc', '7f3ee691129c4921866eb8bf03c15346', '636bb684c9b74c29bded6f2b1fb0bfd4', '56ba07aff36a4c3c8300b8a9d2b28229', '63e46c600a484859a6619b089ebb8db9', '910ac4be18a14ce98652332bb59b8e97', 'f5aea203bf9446cc8359f509469fd32a', '709129d5e2bb4da1a3e6ec214edc3f57', 'b0f77f671d2744f2b1301451e9179cde', 'ed6565fee95e4af2a5417831e3950267', '3ea7f482e3504da289494430a87e856f', 'adbe859bb4794443b584a2d3e0f4eac1', 'c0917ebb5ee14c409f3bb1a0775cc428', '9c1ec958cc28446b8509a277f2c0b1fa', 'b0fcb8a77b3a47278d10158cda9bd1cc', '69aec24b89c54390a501de080978cc49', 'd9ec35ce8aac4cf2a19c9329262f71e0', '17e44834dfc1440dbd3d915f6d283431', 'eb1d8e7d07084c2bbef28c45ed01ce09', '676965f015754cb6891af92ebfd40654',
    ]),
  }),
  zgz({
    item: '240090644',
    title: 'Міні-екскаватор Kubota U10-3',
    original: '2016 Kubota U10-3 Rubber Tracks, Blade, Offset, QH, Piped, Expanding Undercarriage, 3 Buckets (Copy of Declaration of Conformity Available / Copia de CE Disponible) - JKUU0103V01H26955',
    year: 2016, hours: null,
    specs: 'гумові гусениці, відвал, поворотна стріла, швидкозйом, додаткова гідролінія, розсувна ходова, 3 ковші. Є декларація відповідності CE',
    unused: false,
    gallery: photos('240090644', [
      'f8e4faaba1cc4fb8be6b790681a06b49', 'f8a6ebcefae444d4a51166c9b5cbdfc4', '26c34ae825b64500a656da6bb5d7139a', '898af1a89eb74ea0992331f912dc9ea0', 'ed20d7bf4d8f4872a428e62a2c28d01b', '92445e5d5d9a4eb498e29e3e15487919', '0f935ec92a01427b830610ee62ad8bbe', '50e3ba61acb04d19b5af6ba3d76e13ba', 'b681d6652451417aa8b9f936dd477425', 'e23fdce2481148c0b8c27424357b4908', 'af7d1e4b3dac4501b61136223486dcde', 'b467db3de6114c1db8e2b03ee854f5f7', '2406294c883344a5973ca6398fd08594', '8db20ce1dc1a4cfb893b7a56b76739a9', '0582cf99dd064e9d9b1abb9ab2a6419a', '03903859457e4d119a1a709e29989c92', '2aeceb767ee84e2797ec132be8a4d17e', '334bc256da52438682e571a317da93ce', '8b583aa571454c4fb35dbc0fc89b3f2e', '393a65a2431f409da4d3ccb3cbf2dad6', 'fd545a2223574154be2718e2f96847f1', '11239520f7aa4865b5686d65bf9ef8d8', '85607dfd94af40ffb9cf30f4ad1a7ee3', '8f8fd49fe15641b49168f9f85046be4a',
    ]),
  }),
];

// Усі екскаватори з Сарагоси для сторінки /ekskavatory-z-ispanii
export const ZARAGOZA_EXCAVATOR_ITEMS = new Set(ZARAGOZA_LOTS.map((l) => l.item));
