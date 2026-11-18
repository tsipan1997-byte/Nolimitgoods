// Знімок результатів аукціонів у lib/auction-archive.json.
// Запускайте перед тим, як прибирати старі лоти з lib/auction-lots.ts, щоб ціни продажу лишились на сайті.
//   npx tsx scripts/archive-results.ts
import fs from 'node:fs';
import path from 'node:path';
import { allResults } from '../lib/auction-results';

const file = path.join(process.cwd(), 'lib', 'auction-archive.json');
const results = allResults();
fs.writeFileSync(file, JSON.stringify(results, null, 1) + '\n');
console.log(`archive: ${results.length} results saved to lib/auction-archive.json`);
