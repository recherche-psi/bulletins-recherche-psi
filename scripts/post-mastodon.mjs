import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const file = args.find((argument) => !argument.startsWith('--'));

if (!file) {
  throw new Error('Chemin du bulletin manquant.');
}

const source = fs.readFileSync(file, 'utf8');
const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/m)?.[1];

if (!frontmatter) {
  throw new Error(`En-tête YAML introuvable dans ${file}.`);
}

function readField(name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  if (!match) throw new Error(`Champ ${name} manquant dans ${file}.`);
  const value = match[1].trim();
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

if (/^announce:\s*false\s*$/m.test(frontmatter)) {
  console.log(`Annonce désactivée pour ce bulletin : ${file}`);
  process.exit(0);
}

function graphemes(value) {
  return [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(value)]
    .map(({ segment }) => segment);
}

function truncateGraphemes(value, maximum) {
  const parts = graphemes(value);
  if (parts.length <= maximum) return value;
  return `${parts.slice(0, Math.max(0, maximum - 1)).join('').trimEnd()}…`;
}

const title = readField('title');
const description = readField('description');
const draft = readField('draft') === 'true';

if (draft) {
  console.log(`Bulletin ignoré, car il est encore en brouillon : ${file}`);
  process.exit(0);
}

const slug = path.basename(file).replace(/\.mdx?$/, '');
const url = `https://recherche-psi.github.io/bulletins-recherche-psi/bulletins/${slug}/`;
const beginning = `Nouveau bulletin de la recherche psi\n\n${title}\n\n`;
const ending = `\n\nLire le bulletin : ${url}\n\n#Parapsychologie #Metascience #ScienceOuverte`;
const maximumDescription = 500 - graphemes(beginning).length - graphemes(ending).length;
const statusText = `${beginning}${truncateGraphemes(description, maximumDescription)}${ending}`;
const idempotencyKey = `psi-bulletin-${crypto.createHash('sha256').update(url).digest('hex').slice(0, 32)}`;

const summary = [
  '### Aperçu Mastodon',
  '',
  statusText,
  '',
  publish ? 'Mode : publication' : 'Mode : essai sans publication',
  '',
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (!publish) process.exit(0);

const baseUrl = process.env.MASTODON_BASE_URL?.replace(/\/$/, '');
const accessToken = process.env.MASTODON_ACCESS_TOKEN;

if (!baseUrl || !accessToken) {
  throw new Error('MASTODON_BASE_URL ou MASTODON_ACCESS_TOKEN est absent des paramètres GitHub.');
}

if (!baseUrl.startsWith('https://')) {
  throw new Error('MASTODON_BASE_URL doit commencer par https://.');
}

const response = await fetch(`${baseUrl}/api/v1/statuses`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey,
  },
  body: JSON.stringify({
    status: statusText,
    visibility: 'public',
    language: 'fr',
  }),
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(`Publication Mastodon refusée (${response.status}) : ${error}`);
}

const result = await response.json();
console.log(`Annonce publiée : ${result.url}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Annonce publiée : ${result.url}\n`);
}
