#!/usr/bin/env python3
"""Додає оригінальні позиції JCB (номер, назва, ціна без ПДВ з parts.jcb.com) у public/data/catalog-kramp.json.

Використання: python3 scripts/jcb-import.py part1.txt,part2.txt
Вхід: рядки «номер|ціна|назва».
Беремо тільки факти (номер, назва, ціна). Фото й описи JCB не копіюємо.
"""
import json
import re
import sys
import datetime

SRC = sys.argv[1] if __name__ == '__main__' and len(sys.argv) > 1 else ''
CAT = 'public/data/catalog-kramp.json'
TODAY = datetime.date.today().isoformat()

# Порядок важливий: від конкретного до загального
TITLE_MAP = [
    (r'service kit|hour kit', 'Сервісний комплект ТО'),
    (r'injection pump', 'ПНВТ (паливний насос високого тиску)'),
    (r'leak-off', 'Зворотка форсунок'),
    (r'charge air cooler', 'Інтеркулер'),
    (r'engine fan|\bfan\b(?! belt)', 'Вентилятор / привід вентилятора'),
    (r'contactor', 'Контактор'),
    (r'input shaft', 'Вхідний вал'),
    (r'chisel', 'Долото гідромолота'),
    (r'arm link|link assembly', 'Тяга'),
    (r'air-spring|air spring', 'Пневмоподушка сидіння'),
    (r'pto shaft', 'Вал відбору потужності'),
    (r'high.pressure pipe', 'Трубки високого тиску'),
    (r'friction plate|counter plate|brake plate|plate', 'Диск / пластина'),
    (r'\bcoil\b', 'Котушка соленоїда'),
    (r'mirror arm', 'Кронштейн дзеркала'),
    (r'cooler jet', 'Форсунка охолодження поршня'),
    (r'idler|sprocket', 'Натяжне колесо / зірочка ходової'),
    (r'top roller|bottom roller', 'Каток ходової'),
    (r'taper roller|needle roller|roller bearing|thrust bearing', 'Підшипник'),
    (r'strainer', 'Сітчастий фільтр гідравліки'),
    (r'steer mode valve|steering valve|steer valve|orbitrol', 'Клапан рульового керування'),
    (r'counterbalance', 'Клапан противаги'),
    (r'gas strut', 'Газовий упор'),
    (r'coupling', 'Муфта / з\'єднання'),
    (r'track rod|tie rod|drag link', 'Рульова тяга'),
    (r'ball joint', 'Кульова опора'),
    (r'accumulator', 'Гідроакумулятор'),
    (r'gear ?box', 'Редуктор'),
    (r'flow divider', 'Дільник потоку'),
    (r'wash pump', 'Насос омивача'),
    (r'piston ring|ring piston', 'Поршневе кільце'),
    (r'piston rod', 'Шток'),
    (r'crown wheel|pinion', 'Головна пара'),
    (r'master cylinder', 'Головний гальмівний циліндр'),
    (r'fuse', 'Блок запобіжників'),
    (r'gauge', 'Покажчик / датчик рівня'),
    (r'heater unit|hvac|a/c', 'Блок обігріву / кондиціонера'),
    (r'joystick', 'Джойстик / деталь джойстика'),
    (r'latch|lock', 'Замок / защіпка'),
    (r'hinge', 'Петля'),
    (r'stub axle|steering knuckle', 'Поворотний кулак / цапфа'),
    (r'oil cooler|water cooler|transmission oil cooler', 'Охолоджувач'),
    (r'transmission.*filter|filter.*transmission', 'Фільтр трансмісії'),
    (r'oil filter.*by-pass|by-pass', 'Масляний фільтр байпасний'),
    (r'oil filter|lube filter', 'Масляний фільтр'),
    (r'fuel.*(filter|separator)|water separator', 'Паливний фільтр'),
    (r'air filter.*(inner|safety|secondary)|safety element|inner element', 'Повітряний фільтр внутрішній'),
    (r'air filter|air cleaner', 'Повітряний фільтр'),
    (r'hydraulic.*filter|return filter|suction filter|filter.*hydraulic', 'Гідравлічний фільтр'),
    (r'cab filter|pollen|recirc', 'Фільтр салону'),
    (r'breather', 'Сапун'),
    (r'oil cooler', 'Масляний радіатор'),
    (r'filter housing|filter head', 'Корпус фільтра'),
    (r'water pump', 'Водяна помпа'),
    (r'fan belt|v-belt|poly.?v|belt', 'Ремінь'),
    (r'alternator', 'Генератор'),
    (r'starter', 'Стартер'),
    (r'turbo', 'Турбокомпресор'),
    (r'injector', 'Форсунка'),
    (r'glow plug', 'Свічка розжарювання'),
    (r'thermostat', 'Термостат'),
    (r'radiator', 'Радіатор'),
    (r'head gasket', 'Прокладка ГБЦ'),
    (r'gasket', 'Прокладка'),
    (r'seal kit|kit.*seal', 'Ремкомплект ущільнень'),
    (r'o-ring|o ring', "Ущільнювальне кільце"),
    (r'\bseal\b', 'Сальник / ущільнення'),
    (r'gear pump|hydraulic pump|main pump', 'Гідронасос'),
    (r'fuel pump|lift pump', 'Паливний насос'),
    (r'\bpump\b', 'Насос'),
    (r'control valve|valve block|spool', 'Гідророзподільник / клапан керування'),
    (r'solenoid', 'Соленоїд'),
    (r'\bvalve\b', 'Клапан'),
    (r'sensor|sender|transducer', 'Датчик'),
    (r'switch', 'Перемикач / вимикач'),
    (r'relay', 'Реле'),
    (r'hose', 'Шланг'),
    (r'brake pad|friction pad', 'Гальмівні колодки'),
    (r'brake disc|disc brake|friction disc', 'Гальмівний / фрикційний диск'),
    (r'clutch', 'Зчеплення / фрикціон'),
    (r'bearing', 'Підшипник'),
    (r'\bbush', 'Втулка'),
    (r'\bpin\b', 'Палець'),
    (r'tooth|teeth|tip\b', 'Зуб ковша'),
    (r'cutting edge|blade edge', 'Ніж ковша'),
    (r'side cutter', 'Боковий ніж ковша'),
    (r'idler', 'Натяжне колесо'),
    (r'sprocket', 'Зірочка'),
    (r'roller', 'Каток'),
    (r'track', 'Гусениця / деталь ходової'),
    (r'glass|window|screen', 'Скло'),
    (r'door', 'Двері / деталь дверей'),
    (r'mirror', 'Дзеркало'),
    (r'wiper', 'Склоочисник'),
    (r'lamp|light', 'Фара / ліхтар'),
    (r'beacon', 'Маячок'),
    (r'seat', 'Сидіння / деталь сидіння'),
    (r'steering', 'Деталь рульового керування'),
    (r'axle', 'Деталь моста'),
    (r'drive ?shaft|prop ?shaft|propshaft', 'Карданний вал'),
    (r'universal joint|u/j|cross', 'Хрестовина'),
    (r'tank', 'Бак'),
    (r'cylinder|\bram\b', 'Гідроциліндр / деталь циліндра'),
    (r'piston', 'Поршень'),
    (r'motor', 'Мотор'),
    (r'cable', 'Трос / кабель'),
    (r'battery', 'Акумулятор'),
    (r'adblue|def\b', 'AdBlue'),
]

GROUP_MAP = [
    (r'filter|breather|separator|element', 'filters'),
    (r'pump|valve|solenoid|hydraulic|hose|cylinder|ram|seal|o-ring|piston|clutch|axle|shaft|joint|gear|transmission|spool', 'hydraulics'),
    (r'alternator|starter|sensor|switch|relay|cable|battery|lamp|light|beacon|wiper|motor|sender', 'electrics'),
    (r'brake|bearing|bush|pin|track|idler|sprocket|roller|steering', 'chassis'),
    (r'glass|window|door|mirror|seat|cab|panel', 'cab'),
    (r'tooth|teeth|tip|cutting edge|side cutter|bucket', 'wear'),
    (r'turbo|injector|glow|thermostat|radiator|gasket|belt|water pump|engine|cooler|fuel', 'engine'),
]

WEIGHT = {'filters': 1.0, 'hydraulics': 5.0, 'electrics': 3.0, 'chassis': 4.0, 'cab': 6.0, 'wear': 4.0, 'engine': 3.0}

# Реалістична вага важких вузлів (кг) — від неї залежить доставка
WEIGHT_RX = [
    (r'rubber track', 120, True), (r'radiator(?! (cap|hose|rubber))|charge air cooler|condenser', 25, True),
    (r'\bdoor\b(?!.*(handle|hinge|latch|seal|key|glass))', 40, True), (r'seat(?!.*(cover|switch|belt|harness|knob))', 30, True),
    (r'glass|window(?!.*(seal|latch|lock|strut|stay|catch))', 20, True), (r'drive ?shaft|driveshaft', 18, False),
    (r'turbo(?!.*(gasket|pipe|o ring|link))', 10, False), (r'injection pump|main pump|variable displacement|triple pump|tandem', 25, False),
    (r'swing gear box|flow divider|rotary coupling', 40, True), (r'\bram\b(?!.*seal)|cylinder(?! head)', 35, True),
    (r'alternator(?!.*(pulley|lever|bracket))|starter motor(?!.*(cable|harness|bracket|solenoid))', 8, False),
    (r'heater unit|hvac|a/c and heater', 20, True), (r'fuel tank black', 25, True), (r'cutting edge|chisel', 25, True),
]
EXCLUDE_RX = r'\bbattery\b(?!.*(isolator|cable|relay|warning|glow))|wet battery|lead acid|charger'


def title_uk(t: str) -> str:
    tl = t.lower()
    for rx, uk in TITLE_MAP:
        if re.search(rx, tl):
            return uk
    return t  # без перекладу краще, ніж вигадка


def group_of(t: str) -> str:
    tl = t.lower()
    for rx, g in GROUP_MAP:
        if re.search(rx, tl):
            return g
    return 'engine'


def slug(pn: str, brand: str) -> str:
    return re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', f'{pn}-{brand}'.lower()))


def main():
    src = {}
    for path in SRC.split(','):
        for line in open(path):
            parts = line.rstrip('\n').split('|', 2)
            if len(parts) == 3:
                src[parts[0]] = {'pn': parts[0], 'price': parts[1], 'title': parts[2]}
    cat = json.load(open(CAT))
    have = {slug(i['partNumber'], i['brand']) for i in cat}
    added = 0
    for it in src.values():
        pn, title, price = it['pn'].strip(), it['title'].strip(), float(it['price'])
        if price <= 0 or price > 20000:
            continue
        s = slug(pn, 'JCB')
        if s in have:
            continue
        if re.search(EXCLUDE_RX, title, re.I):
            continue
        g = group_of(title)
        weight, oversized = WEIGHT[g], False
        for rx, w, ov in WEIGHT_RX:
            if re.search(rx, title, re.I):
                weight, oversized = w, ov
                break
        cat.append({
            'id': 'jcbp-' + re.sub(r'[^a-z0-9]+', '-', pn.lower()).strip('-'),
            'category': 'construction',
            'group': g,
            'brand': 'JCB',
            'partNumber': pn,
            'alt': pn.replace('/', ''),
            'titleUk': title_uk(title),
            'titleEn': title,
            'fitsUk': 'Оригінальна запчастина JCB — підбір під вашу машину за серійним номером',
            'fitsEn': 'Genuine JCB part — matched to your machine by serial number',
            'type': 'original',
            'supplierPrice': round(price, 2),
            'currency': 'GBP',
            'supplierIncVat': False,
            'weightKg': weight,
            **({'oversized': True} if oversized else {}),
            'checkedAt': TODAY,
        })
        have.add(s)
        added += 1
    with open(CAT, 'w') as f:
        json.dump(cat, f, ensure_ascii=False, separators=(',', ':'))
    print(f'added {added}, total {len(cat)}')


if __name__ == '__main__':
    main()
