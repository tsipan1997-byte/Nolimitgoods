#!/usr/bin/env python3
"""Оновлення цін постачальників у public/data/catalog-kramp.json.

  python3 scripts/update-prices.py dedupe
      → прибирає дублі (та сама деталь того ж бренду від різних постачальників), лишає найдешевшу.
  python3 scripts/update-prices.py kramp-batch [N]
      → друкує JSON-список N номерів Kramp, які найдовше не перевірялись (для window.__PNS).
  python3 scripts/update-prices.py apply --jcb jcb.txt --kramp kramp.txt
      → застосовує зібрані ціни (рядки «номер|ціна|назва»):
        JCB — оновлює ціни наявних позицій і додає нові; Kramp — оновлює ціни за номером.
        Зміна понад 60% не застосовується, а потрапляє у звіт для ручної перевірки.
"""
import importlib.util
import json
import os
import re
import sys
import datetime

CAT = 'public/data/catalog-kramp.json'
TODAY = datetime.date.today().isoformat()
MAX_JUMP = 0.60

_spec = importlib.util.spec_from_file_location('jcbimp', os.path.join(os.path.dirname(__file__), 'jcb-import.py'))
jcbimp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(jcbimp)


def norm(pn: str) -> str:
    return re.sub(r'[^0-9A-Z]', '', pn.upper())


def read_lines(path):
    rows = {}
    if not path or not os.path.exists(path):
        return rows
    for line in open(path):
        parts = line.rstrip('\n').split('|', 2)
        if len(parts) >= 2:
            try:
                price = float(parts[1])
            except ValueError:
                continue
            if 0 < price < 20000:
                rows[parts[0].strip()] = (price, parts[2].strip() if len(parts) > 2 else '')
    return rows


VAT = 1.2
FX = {'GBP': 1.0, 'EUR': 0.85, 'USD': 0.78, 'PLN': 0.20}


def net_gbp(i):
    p = float(i['supplierPrice']) * FX.get(i.get('currency', 'GBP'), 1.0)
    return p / VAT if i.get('supplierIncVat') else p


def dup_key(i):
    b = i['brand'].upper()
    pn = norm(i['partNumber'])
    if 'JCB' in b:
        if pn.startswith('JC'):
            pn = pn[2:]
        return 'JCB:' + pn
    return b + ':' + pn


def dedupe(cat, protected=frozenset()):
    """Та сама деталь того ж бренду від різних постачальників: лишаємо найдешевшу,
    номер прибраного запису зберігаємо в `alt`, щоб він знаходився пошуком."""
    groups = {}
    for i in cat:
        groups.setdefault(dup_key(i), []).append(i)
    drop = set()
    removed = []
    for k, items in groups.items():
        if len(items) < 2:
            continue
        best = min(items, key=net_gbp)
        for it in items:
            if it is best:
                continue
            drop.add(id(it))
            removed.append(f"{it['partNumber']} £{it['supplierPrice']} → лишили {best['partNumber']} £{best['supplierPrice']}")
            alts = {a for a in (best.get('alt') or '').split(',') if a}
            alts.add(it['partNumber'])
            best['alt'] = ','.join(sorted(alts))
    return [i for i in cat if id(i) not in drop], removed


def kramp_batch(n: int):
    cat = json.load(open(CAT))
    items = [i for i in cat if not i['id'].startswith('jcbp-')]
    items.sort(key=lambda i: i.get('checkedAt') or '0000')
    print(json.dumps([i['partNumber'] for i in items[:n]]))


def apply(jcb_path, kramp_path):
    cat = json.load(open(CAT))
    report = {'jcb_updated': 0, 'jcb_added': 0, 'kramp_updated': 0, 'unchanged': 0, 'flagged': []}

    def update(item, price, source):
        old = float(item['supplierPrice'])
        if abs(price - old) / old > MAX_JUMP:
            report['flagged'].append(f"{source} {item['partNumber']}: £{old} → £{price}")
            return False
        item['checkedAt'] = TODAY
        if round(price, 2) == round(old, 2):
            report['unchanged'] += 1
            return False
        item['supplierPrice'] = round(price, 2)
        return True

    # JCB
    jcb = read_lines(jcb_path)
    by_slug = {jcbimp.slug(i['partNumber'], i['brand']): i for i in cat if i['id'].startswith('jcbp-')}
    new_lines = []
    for pn, (price, title) in jcb.items():
        it = by_slug.get(jcbimp.slug(pn, 'JCB'))
        if it:
            if update(it, price, 'JCB'):
                report['jcb_updated'] += 1
        elif title:
            new_lines.append(f'{pn}|{price}|{title}')
    with open(CAT, 'w') as f:
        json.dump(cat, f, ensure_ascii=False, separators=(',', ':'))
    if new_lines:
        tmp = '/tmp/jcb-new.txt'
        open(tmp, 'w').write('\n'.join(new_lines) + '\n')
        before = len(cat)
        jcbimp.SRC = tmp
        jcbimp.main()
        report['jcb_added'] = len(json.load(open(CAT))) - before
        cat = json.load(open(CAT))

    # Kramp
    kramp = read_lines(kramp_path)
    if kramp:
        by_pn = {}
        for i in cat:
            if not i['id'].startswith('jcbp-'):
                by_pn.setdefault(norm(i['partNumber']), []).append(i)
        for pn, (price, _) in kramp.items():
            for it in by_pn.get(norm(pn), []):
                if update(it, price, 'Kramp'):
                    report['kramp_updated'] += 1

    cat, removed = dedupe(cat)
    report['duplicates_removed'] = len(removed)
    with open(CAT, 'w') as f:
        json.dump(cat, f, ensure_ascii=False, separators=(',', ':'))

    print(json.dumps(report, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    if len(sys.argv) >= 2 and sys.argv[1] == 'dedupe':
        c, removed = dedupe(json.load(open(CAT)))
        with open(CAT, 'w') as f:
            json.dump(c, f, ensure_ascii=False, separators=(',', ':'))
        print(f'removed {len(removed)}')
        print('\n'.join(removed))
    elif len(sys.argv) >= 2 and sys.argv[1] == 'kramp-batch':
        kramp_batch(int(sys.argv[2]) if len(sys.argv) > 2 else 300)
    elif len(sys.argv) >= 2 and sys.argv[1] == 'apply':
        args = dict(zip(sys.argv[2::2], sys.argv[3::2]))
        apply(args.get('--jcb'), args.get('--kramp'))
    else:
        print(__doc__)
