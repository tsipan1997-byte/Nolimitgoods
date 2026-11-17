// Розділ «Спецтехніка»: бренди, групи і тексти для сторінок /spectehnika і /spectehnika/[brand].

export type MachineGroupId = 'construction' | 'handling' | 'agro' | 'drivetrain';

export const MACHINE_GROUPS: { id: MachineGroupId; uk: string; hint: string }[] = [
  { id: 'construction', uk: 'Будівельна техніка', hint: 'Екскаватори, екскаватори-навантажувачі, фронтальні навантажувачі, бульдозери' },
  { id: 'handling', uk: 'Телескопи і навантажувачі', hint: 'Телескопічні навантажувачі, міні-навантажувачі, вилкові навантажувачі' },
  { id: 'agro', uk: 'Сільгосптехніка', hint: 'Трактори, комбайни, обприскувачі, ґрунтообробна техніка' },
  { id: 'drivetrain', uk: 'Двигуни, мости, коробки', hint: 'Окремі вузли: двигуни, трансмісії, мости, гідравліка' },
];

export type MachineBrand = {
  slug: string;
  name: string;
  group: MachineGroupId;
  models: string[];
  intro: string;
};

export const MACHINE_BRANDS: MachineBrand[] = [
  // Будівельна техніка
  { slug: 'jcb', name: 'JCB', group: 'construction', models: ['3CX', '4CX', 'JS130', 'JS220', '531-70', '535-95', '540-170'],
    intro: 'Запчастини JCB для екскаваторів-навантажувачів 3CX/4CX, гусеничних екскаваторів JS і телескопів Loadall: двигуни JCB Dieselmax, гідравліка, фільтри, ходова.' },
  { slug: 'caterpillar', name: 'Caterpillar (CAT)', group: 'construction', models: ['428', '432', '320', '323', '950', '966', 'D6', '3306', 'C7'],
    intro: 'Запчастини Caterpillar для екскаваторів, навантажувачів і бульдозерів, а також для двигунів CAT 3306, 3406, C6.6, C7, C9.' },
  { slug: 'komatsu', name: 'Komatsu', group: 'construction', models: ['PC210', 'PC240', 'PC290', 'WA380', 'WA470', 'D65'],
    intro: 'Запчастини Komatsu для екскаваторів PC, навантажувачів WA і бульдозерів D: гідравліка, ходова, двигуни, фільтри.' },
  { slug: 'volvo-ce', name: 'Volvo CE', group: 'construction', models: ['EC210', 'EC220', 'EC290', 'L90', 'L120', 'A30'],
    intro: 'Запчастини Volvo Construction Equipment для екскаваторів EC, навантажувачів L і самоскидів A.' },
  { slug: 'hitachi', name: 'Hitachi', group: 'construction', models: ['ZX130', 'ZX210', 'ZX250', 'ZX350'],
    intro: 'Запчастини Hitachi Zaxis: гідронасоси, гідророзподільники, ходова, фільтри, електрика.' },
  { slug: 'doosan-develon', name: 'Doosan / Develon', group: 'construction', models: ['DX140', 'DX225', 'DX300', 'DL250'],
    intro: 'Запчастини Doosan (Develon) для екскаваторів DX і навантажувачів DL.' },
  { slug: 'hyundai', name: 'Hyundai CE', group: 'construction', models: ['R140', 'R210', 'R220', 'HL757'],
    intro: 'Запчастини Hyundai Construction Equipment для екскаваторів Robex і навантажувачів HL.' },
  { slug: 'case-ce', name: 'Case CE', group: 'construction', models: ['580', '590', '695', 'CX210', '821'],
    intro: 'Запчастини Case Construction для екскаваторів-навантажувачів 580/590/695, екскаваторів CX і навантажувачів.' },
  { slug: 'liebherr', name: 'Liebherr', group: 'construction', models: ['A914', 'R920', 'R934', 'L550'],
    intro: 'Запчастини Liebherr для колісних і гусеничних екскаваторів та навантажувачів.' },
  { slug: 'terex', name: 'Terex', group: 'construction', models: ['TLB', 'TA6', 'TA9'],
    intro: 'Запчастини Terex для екскаваторів-навантажувачів і думперів.' },
  { slug: 'takeuchi', name: 'Takeuchi', group: 'construction', models: ['TB216', 'TB240', 'TB260', 'TB290'],
    intro: 'Запчастини Takeuchi для міні- та мідіекскаваторів TB.' },
  { slug: 'kubota', name: 'Kubota', group: 'construction', models: ['KX016', 'KX057', 'U27', 'M5', 'M7'],
    intro: 'Запчастини Kubota для мініекскаваторів KX/U і тракторів M, двигуни Kubota.' },

  // Телескопи і навантажувачі
  { slug: 'manitou', name: 'Manitou', group: 'handling', models: ['MLT 627', 'MLT 628', 'MLT 634', 'MLT 735', 'MT 1840', 'MRT'],
    intro: 'Запчастини Manitou для телескопічних навантажувачів MLT, MT і MRT: коробки Spicer/Dana і ZF, клапани й соленоїди, гідравліка, мости.' },
  { slug: 'merlo', name: 'Merlo', group: 'handling', models: ['P32.6', 'P40.7', 'TF42.7', 'Turbofarmer'],
    intro: 'Запчастини Merlo для телескопів Panoramic і Turbofarmer.' },
  { slug: 'bobcat', name: 'Bobcat', group: 'handling', models: ['S175', 'S650', 'T590', 'T770', 'E35'],
    intro: 'Запчастини Bobcat для міні-навантажувачів S/T і мініекскаваторів E.' },
  { slug: 'claas-scorpion', name: 'Claas Scorpion', group: 'handling', models: ['Scorpion 7044', 'Scorpion 741'],
    intro: 'Запчастини для телескопів Claas Scorpion.' },
  { slug: 'linde', name: 'Linde / Toyota / Still', group: 'handling', models: ['H25', 'H30', 'E20', '8FD25'],
    intro: 'Запчастини для вилкових навантажувачів Linde, Toyota, Still.' },

  // Сільгосптехніка
  { slug: 'john-deere', name: 'John Deere', group: 'agro', models: ['6R', '6M', '7R', '8R', 'S680', 'T670'],
    intro: 'Запчастини John Deere для тракторів 6/7/8 серії, комбайнів S і T, обприскувачів.' },
  { slug: 'case-ih', name: 'Case IH', group: 'agro', models: ['Puma', 'Magnum', 'Maxxum', 'Axial-Flow'],
    intro: 'Запчастини Case IH для тракторів Puma, Magnum, Maxxum і комбайнів Axial-Flow.' },
  { slug: 'new-holland', name: 'New Holland', group: 'agro', models: ['T6', 'T7', 'T8', 'CR', 'CX'],
    intro: 'Запчастини New Holland для тракторів T6/T7/T8 і комбайнів CR/CX.' },
  { slug: 'claas', name: 'Claas', group: 'agro', models: ['Arion', 'Axion', 'Lexion', 'Jaguar'],
    intro: 'Запчастини Claas для тракторів Arion/Axion, комбайнів Lexion і кормозбиральних Jaguar.' },
  { slug: 'fendt', name: 'Fendt', group: 'agro', models: ['516', '724', '828', '936'],
    intro: 'Запчастини Fendt Vario: трансмісії, гідравліка, електрика, фільтри.' },
  { slug: 'massey-ferguson', name: 'Massey Ferguson', group: 'agro', models: ['5700', '6700', '7700', '8700'],
    intro: 'Запчастини Massey Ferguson для тракторів 5700–8700 серії.' },
  { slug: 'deutz-fahr', name: 'Deutz-Fahr', group: 'agro', models: ['Agrotron', '5G', '6 Series'],
    intro: 'Запчастини Deutz-Fahr для тракторів Agrotron і 5/6 серії.' },

  // Двигуни, мости, коробки
  { slug: 'perkins', name: 'Perkins', group: 'drivetrain', models: ['1104', '1106', '854', '404'],
    intro: 'Запчастини і ремкомплекти двигунів Perkins, що стоять на JCB, CAT, Manitou, Massey Ferguson.' },
  { slug: 'cummins', name: 'Cummins', group: 'drivetrain', models: ['QSB6.7', '6BT', 'ISB', 'QSL9'],
    intro: 'Запчастини двигунів Cummins для спецтехніки і вантажівок.' },
  { slug: 'deutz', name: 'Deutz', group: 'drivetrain', models: ['TCD 2012', 'TCD 3.6', 'BF4M'],
    intro: 'Запчастини двигунів Deutz для телескопів, навантажувачів і тракторів.' },
  { slug: 'dana-spicer', name: 'Dana / Spicer', group: 'drivetrain', models: ['COM-T4', 'COM-T2', 'мости 212/213'],
    intro: 'Коробки й мости Dana/Spicer: клапани керування, соленоїди, фрикціони, піввісі. Стоять на Manitou, JCB, Merlo.' },
  { slug: 'zf', name: 'ZF', group: 'drivetrain', models: ['ErgoPower', 'MT-L', '4WG'],
    intro: 'Трансмісії й мости ZF для навантажувачів і телескопів.' },
  { slug: 'rexroth', name: 'Bosch Rexroth', group: 'drivetrain', models: ['A10VO', 'A4VG', 'A11VO'],
    intro: 'Гідронасоси й гідромотори Bosch Rexroth: нові, відновлені і б/у.' },
];

export const brandBySlug = (slug: string) => MACHINE_BRANDS.find((b) => b.slug === slug);
