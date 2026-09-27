// Valida src/data/projects.json i imprimeix què falta confirmar i quines imatges tenen els drets pendents.
// Ús: npm run check:projects  (surt amb codi 1 si hi ha errors).
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { missingFields, pendingRights, listProjects, validateProjects } from './projects.js';

const root = resolve(import.meta.dirname, '..');
const list = JSON.parse(readFileSync(resolve(root, 'src/data/projects.json'), 'utf8'));
const { errors, warnings } = validateProjects(list, { publicDir: resolve(root, 'public') });

for (const w of warnings) console.warn(`AVÍS  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  process.exit(1);
}

console.log(`OK: ${list.length} projectes vàlids.\n`);
console.log('Pendent de confirmar:');
for (const p of listProjects(list)) console.log(`  ${String(p.order).padStart(2)}. ${p.title.padEnd(24)} ${missingFields(p).join(', ') || '—'}`);
console.log('\nImatges amb drets pendents (fora de la build de producció):');
for (const r of pendingRights(list)) console.log(`  · ${r.id} · ${r.where} · ${r.src}${r.note ? `\n      ${r.note}` : ''}`);
