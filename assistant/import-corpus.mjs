import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { validateCorpus } from './shared.mjs';

const source = process.argv[2];
if (!source || basename(source) !== 'corpus.json' || !resolve(source).replaceAll('\\','/').endsWith('/export_public/corpus.json')) {
  throw new Error('Provide only the validated export_public/corpus.json, never a private fiche registry.');
}
const corpus = JSON.parse(await readFile(source,'utf8'));
validateCorpus(corpus);
if (Object.keys(corpus).some(k => !['version_schema','fiches'].includes(k))) throw new Error('Private top-level fields');
const destination = new URL('../public/assistant/corpus.json',import.meta.url);
const temporary = new URL('../public/assistant/corpus.json.tmp',import.meta.url);
await writeFile(temporary,JSON.stringify(corpus,null,2)+'\n',{encoding:'utf8',flag:'wx'});
await rename(temporary,destination);
console.log(`${corpus.fiches.length} fiches imported. Review the diff and redeploy both site and Worker.`);
