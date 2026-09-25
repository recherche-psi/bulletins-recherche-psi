import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const file = args.find((arg) => !arg.startsWith('--'));

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

function truncateGraphemes(value, maximum) {
  const graphemes = [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(value)]
    .map(({ segment }) => segment);
  if (graphemes.length <= maximum) return value;
  return `${graphemes.slice(0, maximum - 1).join('').trimEnd()}…`;
}

const S32_CHAR = '234567abcdefghijklmnopqrstuvwxyz';

function s32encode(value) {
  let encoded = '';
  while (value) {
    const character = value % 32;
    value = Math.floor(value / 32);
    encoded = S32_CHAR.charAt(character) + encoded;
  }
  return encoded;
}

const title = readField('title');
const description = readField('description');
const publishedAt = readField('publishedAt');
const draft = readField('draft') === 'true';

if (draft) {
  console.log(`Bulletin ignoré, car il est encore en brouillon : ${file}`);
  process.exit(0);
}

const slug = path.basename(file).replace(/\.mdx?$/, '');
const url = `https://recherche-psi.github.io/bulletins-recherche-psi/bulletins/${slug}/`;
const postText = truncateGraphemes(
  `Nouveau bulletin de la recherche psi\n\n${title}\n\n${description}`,
  300,
);
const createdAt = new Date(`${publishedAt}T08:00:00.000Z`).toISOString();
const rkeyDigest = crypto.createHash('sha256').update(url).digest();
const rkeyTimestamp = Date.parse(createdAt) * 1000 + (rkeyDigest.readUInt16BE(0) % 1000);
const rkeyClock = rkeyDigest[2] & 31;
const rkey = `${s32encode(rkeyTimestamp)}${s32encode(rkeyClock).padStart(2, '2')}`;

const record = {
  $type: 'app.bsky.feed.post',
  text: postText,
  langs: ['fr'],
  createdAt,
  embed: {
    $type: 'app.bsky.embed.external',
    external: {
      uri: url,
      title,
      description,
    },
  },
};

const summary = [
  '### Aperçu Bluesky',
  '',
  postText,
  '',
  `Lien joint : ${url}`,
  '',
  publish ? 'Mode : publication' : 'Mode : essai sans publication',
  '',
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (!publish) process.exit(0);

const handle = process.env.BLUESKY_HANDLE;
const appPassword = process.env.BLUESKY_APP_PASSWORD;

if (!handle || !appPassword) {
  throw new Error('BLUESKY_HANDLE ou BLUESKY_APP_PASSWORD est absent des paramètres GitHub.');
}

const sessionResponse = await fetch(
  'https://bsky.social/xrpc/com.atproto.server.createSession',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: handle, password: appPassword }),
  },
);

if (!sessionResponse.ok) {
  throw new Error(`Connexion Bluesky refusée (${sessionResponse.status}).`);
}

const session = await sessionResponse.json();
const publishResponse = await fetch(
  'https://bsky.social/xrpc/com.atproto.repo.putRecord',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      rkey,
      record,
      validate: true,
    }),
  },
);

if (!publishResponse.ok) {
  const error = await publishResponse.text();
  throw new Error(`Publication Bluesky refusée (${publishResponse.status}) : ${error}`);
}

const postUrl = `https://bsky.app/profile/${handle}/post/${rkey}`;
console.log(`Annonce publiée : ${postUrl}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Annonce publiée : ${postUrl}\n`);
}
