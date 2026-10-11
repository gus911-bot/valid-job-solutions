// Budget de taille du bundle (SOUPLE : avertit, ne fait pas échouer le CI).
// Usage : node scripts/check-bundle-size.mjs   (après `next build`)
// Budget configurable : BUNDLE_BUDGET_KB (défaut 1500).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const STATIC_DIR = join(process.cwd(), '.next', 'static');
const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 1500);

function collectJsBytes(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) total += collectJsBytes(p);
    else if (entry.name.endsWith('.js')) total += statSync(p).size;
  }
  return total;
}

let totalKb;
try {
  totalKb = Math.round(collectJsBytes(STATIC_DIR) / 1024);
} catch {
  console.error('❌ .next/static introuvable — lancer `next build` d’abord.');
  process.exit(1);
}

console.log(`📦 JS statique total : ${totalKb} Ko (budget souple : ${BUDGET_KB} Ko)`);

if (totalKb > BUDGET_KB) {
  // Annotation GitHub Actions — visible sur la PR, sans faire échouer le job.
  console.log(
    `::warning title=Budget bundle dépassé::${totalKb} Ko de JS statique ` +
      `(budget souple ${BUDGET_KB} Ko). Lancer \`npm run analyze\` pour investiguer.`,
  );
} else {
  console.log('✅ Budget respecté.');
}
