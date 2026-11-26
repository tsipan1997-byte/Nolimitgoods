#!/usr/bin/env node
// Публікація злитого фіду у Vercel Blob (варіант Б): node scripts/parsers/publish-blob.mjs [файл] [--pathname=lots-feed.json]
// Потрібно: env BLOB_READ_WRITE_TOKEN (секрет у GitHub / на VPS) і пакет @vercel/blob@1
// (у CI ставиться окремо: npm install --prefix scripts/parsers --no-save @vercel/blob@1).
// Без токена нічого не робить (exit 0) — щоб випадково не публікувати з локальної машини.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const file = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(HERE, 'out', 'lots.json'));
const pathname = (args.find((a) => a.startsWith('--pathname=')) || '--pathname=lots-feed.json').split('=')[1];
const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.log('BLOB_READ_WRITE_TOKEN не задано — публікацію у Vercel Blob пропущено');
  process.exit(0);
}
const feed = fs.readFileSync(file, 'utf8');
JSON.parse(feed); // не публікуємо битий JSON
const { put } = await import('@vercel/blob');
const r = await put(pathname, feed, {
  access: 'public',
  token,
  contentType: 'application/json',
  addRandomSuffix: false, // стабільна адреса, сайт читає її як фід
  allowOverwrite: true,
  cacheControlMaxAge: 300,
});
console.log(`опубліковано: ${r.url}`);
