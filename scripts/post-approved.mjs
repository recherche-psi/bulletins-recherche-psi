import fs from 'node:fs';
import crypto from 'node:crypto';

const [file, platform, mode] = process.argv.slice(2);
if (!file || !['bluesky', 'mastodon'].includes(platform) || !['--preview', '--publish'].includes(mode)) {
  throw new Error('Usage: node scripts/post-approved.mjs FILE bluesky|mastodon --preview|--publish');
}
const { posts } = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(posts) || !posts.length) throw new Error('No posts.');
const ids = new Set();
for (const post of posts) {
  if (!/^psi-[a-z0-9-]+$/.test(post.id) || ids.has(post.id)) throw new Error('Invalid or repeated post ID.');
  ids.add(post.id);
  if (typeof post.text !== 'string' || !post.text.endsWith(post.url) || !post.url.startsWith('https://recherche-psi.github.io/bulletins-recherche-psi/')) throw new Error('Invalid post or bulletin URL.');
  const count = [...new Intl.Segmenter('fr', { granularity:'grapheme' }).segment(post.text)].length;
  if (count > 300) throw new Error(`Post ${post.id} exceeds 300 characters (${count}).`);
  console.log(`${post.id} (${count})\n${post.text}\n`);
}
if (mode === '--preview') process.exit(0);

async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Request failed: ${new URL(url).pathname} (${response.status})`);
  return response.json();
}
function result(id, url, existing = false) {
  const line = `${platform} ${id}: ${url}${existing ? ' (already published)' : ''}`;
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n\n`);
}
if (platform === 'bluesky') {
  const handle = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!handle || !password) throw new Error('Bluesky configuration missing.');
  const session = await json('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({identifier:handle,password}),
  });
  for (const post of posts) {
    const alphabet = '234567abcdefghijklmnopqrstuvwxyz';
    const encode = number => { let out = ''; do { out = alphabet[number % 32] + out; number = Math.floor(number / 32); } while (number); return out; };
    const match = post.id.match(/^psi-(\d{4}-\d{2}-\d{2})-(\d+)$/);
    if (!match) throw new Error('Invalid dated post ID.');
    const stamp = Date.parse(`${match[1]}T12:23:19Z`) * 1000 + Number(match[2]);
    const rkey = encode(stamp).padStart(11, '2') + encode(crypto.createHash('sha256').update(post.id).digest().readUInt16BE(0) % 1024).padStart(2, '2');
    const query = new URLSearchParams({repo:session.did, collection:'app.bsky.feed.post',rkey});
    const existingResponse = await fetch(`https://bsky.social/xrpc/com.atproto.repo.getRecord?${query}`, {signal:AbortSignal.timeout(30000)});
    if (existingResponse.ok) {
      const existing = await existingResponse.json();
      if (existing.value.text !== post.text) throw new Error(`ID conflict: ${post.id}`);
      result(post.id, `https://bsky.app/profile/${session.handle}/post/${rkey}`, true);
      continue;
    }
    const error = await existingResponse.json();
    if (error.error !== 'RecordNotFound') throw new Error(`Cannot check existing post (${existingResponse.status}).`);
    const start = post.text.lastIndexOf(post.url);
    const record = {
      $type:'app.bsky.feed.post', text:post.text, langs:['fr'], createdAt:new Date().toISOString(),
      facets:[{index:{byteStart:Buffer.byteLength(post.text.slice(0,start)),byteEnd:Buffer.byteLength(post.text)},features:[{$type:'app.bsky.richtext.facet#link',uri:post.url}]}],
    };
    await json('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method:'POST', headers:{Authorization:`Bearer ${session.accessJwt}`,'Content-Type':'application/json'},
      body:JSON.stringify({repo:session.did,collection:'app.bsky.feed.post',rkey,record,validate:true}),
    });
    const verified = await json(`https://bsky.social/xrpc/com.atproto.repo.getRecord?${query}`);
    if (verified.value.text !== post.text) throw new Error('Published text differs from approved text.');
    result(post.id, `https://bsky.app/profile/${session.handle}/post/${rkey}`);
  }
} else {
  const base = process.env.MASTODON_BASE_URL?.replace(/\/$/,'');
  const token = process.env.MASTODON_ACCESS_TOKEN;
  if (!base?.startsWith('https://') || !token) throw new Error('Mastodon configuration missing.');
  const headers = {Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
  const account = await json(`${base}/api/v1/accounts/verify_credentials`, {headers});
  const recent = await json(`${base}/api/v1/accounts/${account.id}/statuses?limit=40`, {headers});
  const plain = value => value.replace(/<[^>]*>/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
  for (const post of posts) {
    const intro = post.text.split('\n\n')[0];
    const previous = recent.find(status => !status.reblog && plain(status.content).startsWith(intro) && status.content.includes(post.url));
    if (previous) { result(post.id, previous.url, true); continue; }
    const published = await json(`${base}/api/v1/statuses`, {
      method:'POST', headers:{...headers,'Idempotency-Key':crypto.createHash('sha256').update(post.id).digest('hex')},
      body:JSON.stringify({status:post.text,visibility:'public',language:'fr'}),
    });
    const verified = await json(`${base}/api/v1/statuses/${published.id}`, {headers});
    if (verified.account.id !== account.id || !plain(verified.content).startsWith(intro)) throw new Error('Published post verification failed.');
    recent.unshift(verified);
    result(post.id, verified.url);
  }
}
