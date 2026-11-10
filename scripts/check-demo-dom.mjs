import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../public/demo-gna/index.html', import.meta.url), 'utf8');
const domIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const ids = new Set(domIds);
const referenced = [...new Set([...html.matchAll(/\$\("([^"]+)"\)/g)].map((match) => match[1]))];

assert.equal(ids.size, domIds.length, 'IDs HTML dupliqués dans la démonstration');
for (const id of referenced) {
  assert.ok(ids.has(id), `Élément HTML absent dans GNA-7 : #${id}`);
}

for (const id of ['progress-rail', 'roll', 'hold', 'auto', 'next', 'results']) {
  if (id === 'mode-quick') continue; // les modes sont repérés par data-mode
  assert.ok(ids.has(id), `Élément essentiel manquant : #${id}`);
}

const inline = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline, 'Script GNA-7 introuvable');
new Function(inline[1]);

assert.ok(html.includes('const order=includeA?["A","B","C"]:["B","C"];'), 'L’ordre pilote doit préserver B avant C');
console.log(`GNA-7 : script valide, ${referenced.length} références DOM vérifiées.`);
