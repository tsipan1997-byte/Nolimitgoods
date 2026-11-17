#!/usr/bin/env python3
"""Записує поточні ставки в lib/auction-prices.json.
Використання: python3 scripts/apply-prices.py prices.json
prices.json — {"rb-nov:62": {"bid": 27000, "bids": 28}, ...}. Лоти з 0 ставок пропускаються.
"""
import json, sys, datetime, pathlib
src = json.load(open(sys.argv[1]))
prices = {k: {"bid": v["bid"], "bids": v["bids"]} for k, v in src.items() if v.get("bid") and v.get("bids", 0) > 0}
out = {"updatedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "prices": prices}
p = pathlib.Path(__file__).resolve().parent.parent / "lib" / "auction-prices.json"
p.write_text(json.dumps(out, ensure_ascii=False, indent=0) + "\n")
print(f"{len(prices)} lots written, updatedAt {out['updatedAt']}")
