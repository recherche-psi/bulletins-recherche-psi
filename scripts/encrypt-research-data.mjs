import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

export function encryptBytes(buffer, password) {
  if (!password) throw new Error('Un mot de passe est nécessaire.');
  const salt = randomBytes(16), iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, 600000, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final(), cipher.getAuthTag()]);
  key.fill(0);
  return { version:1, kdf:'PBKDF2-SHA256', iterations:600000, cipher:'AES-256-GCM', salt:salt.toString('base64'), iv:iv.toString('base64'), data:ciphertext.toString('base64') };
}
async function main() {
  const [catalogPath, planPath] = process.argv.slice(2);
  const password = process.env.RESEARCH_DATA_PASSWORD;
  delete process.env.RESEARCH_DATA_PASSWORD;
  if (!password || !catalogPath || !planPath) throw new Error('Usage : RESEARCH_DATA_PASSWORD défini dans l’environnement, puis node scripts/encrypt-research-data.mjs CATALOGUE_PRIVE PLAN_ARCHIVES_PRIVE');
  const catalogBytes = await readFile(catalogPath), catalog = JSON.parse(catalogBytes);
  if (catalog.version !== 1 || !catalog.protocols.length) throw new Error('Catalogue invalide.');
  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  const output = resolve('public/data/research'); await mkdir(output, {recursive:true});
  const generated = new Set();
  for (const asset of plan) {
    if (!/^asset-[a-f0-9]+\.enc\.json$/.test(asset.output) || basename(asset.output) !== asset.output) throw new Error('Nom de sortie invalide.');
    await writeFile(resolve(output, asset.output), JSON.stringify(encryptBytes(await readFile(asset.input), password)));
    generated.add(asset.output);
  }
  for (const protocol of catalog.protocols) for (const file of protocol.files) {
    if (file.encrypted && !generated.has(basename(file.url))) throw new Error('Archive manquante dans le plan.');
  }
  await writeFile(resolve(output, 'catalog.enc.json'), JSON.stringify(encryptBytes(catalogBytes, password)));
  console.log(`Catalogue chiffré : ${catalog.protocols.length} fiches et ${generated.size} archives.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error=>{ console.error(error.message); process.exitCode=1; });
