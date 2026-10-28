import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { encryptBytes } from '../scripts/encrypt-research-data.mjs';
import { decryptEnvelope } from '../src/lib/research-crypto.ts';

test('Node encryption is readable by the browser Web Crypto implementation, including accents and binary data', async()=>{
  const bytes = Buffer.from('Données publiques\0\xff\nψ', 'utf8');
  const encrypted = encryptBytes(bytes, 'test-password-for-fixtures');
  const decoded = await decryptEnvelope(encrypted, 'test-password-for-fixtures');
  assert.deepEqual(Buffer.from(decoded), bytes);
  assert.notEqual(encrypted.data, encryptBytes(bytes, 'test-password-for-fixtures').data);
});
test('Wrong passwords and altered encrypted files fail closed', async()=>{
  const encrypted = encryptBytes(Buffer.from('protected fixture'), 'test-password-for-fixtures');
  await assert.rejects(decryptEnvelope(encrypted, 'wrong-password'));
  const altered=Buffer.from(encrypted.data,'base64');altered[0]^=1;
  await assert.rejects(decryptEnvelope({...encrypted,data:altered.toString('base64')},'test-password-for-fixtures'));
  await assert.rejects(decryptEnvelope({...encrypted,iterations:1},'test-password-for-fixtures'));
});
test('The built page is non-indexable and does not publish catalogue records', async()=>{
  const html=await readFile(new URL('../dist/donnees/index.html',import.meta.url),'utf8');
  const sitemap=await readFile(new URL('../dist/sitemap.xml',import.meta.url),'utf8');
  assert.match(html,/name="robots" content="noindex, nofollow, noarchive"/);
  assert.match(html,/id="data-library" hidden/);
  assert.doesNotMatch(html,/trials_long_format|raw_semicolon_format|S_latent/);
  assert.doesNotMatch(sitemap,/\/donnees\//);
});
