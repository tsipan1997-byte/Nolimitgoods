#!/usr/bin/env python3
"""Додає оригінальні позиції JCB (номер, назва, ціна без ПДВ з parts.jcb.com) у public/data/catalog-kramp.json.

Використання: python3 scripts/jcb-import.py <jcb.json>
Вхід: {"400/24843": {"pn": "...", "title": "...", "price": 27.44, "avail": "Available"}, ...}
Беремо тільки факти (номер, назва, ціна). Фото й описи JCB не копіюємо.
"""
import json
import re
import sys
import datetime

SRC = sys.argv[1]
CAT = 'public/data/catalog-kramp.json'
TODAY = datetime.date.today().isoformat()

# Порядок важливий: від конкретного до загального
TITLE_MAP = [
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
    src = json.load(open(SRC))
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
        g = group_of(title)
        heavy = price > 800 and g in ('hydraulics', 'engine', 'chassis', 'cab')
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
            'weightKg': WEIGHT[g] * (4 if heavy else 1),
            'sourceUrl': 'https://parts.jcb.com/uk/product/' + pn.replace('/', '-'),
            'checkedAt': TODAY,
        })
        have.add(s)
        added += 1
    with open(CAT, 'w') as f:
        json.dump(cat, f, ensure_ascii=False, separators=(',', ':'))
    print(f'added {added}, total {len(cat)}')


if __name__ == '__main__':
    main()
