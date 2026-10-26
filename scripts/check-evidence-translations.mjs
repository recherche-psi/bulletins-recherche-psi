import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const sourceText = await readFile('src/data/evidence-2026.json', 'utf8');
const source = JSON.parse(sourceText);
const englishText = await readFile('src/data/evidence-2026.en.json', 'utf8');
const english = JSON.parse(englishText);
assert.equal(english.translation.sourceSha256, createHash('sha256').update(sourceText).digest('hex'), 'French evidence changed: review the English edition');
assert.deepEqual(english.topics.map(t => t.id), source.topics.map(t => t.id), 'Topic coverage or order differs');
assert.equal(english.version, source.version);
assert.equal(await readFile('public/data/evidence-2026-10-26-v12.en.json', 'utf8'), englishText, 'English archive differs from the current dataset');

function numbers(text, french) {
  let s = text.normalize('NFKC').replace(/(?<=\d)[ \u202f\u00a0](?=\d{3}(?:\D|$))/g, '');
  if (!french) s = s.replace(/\b([1-9]\d{0,2}),(\d{3})(?!\d)/g, '$1$2');
  return (s.replaceAll(',', '.').match(/\d+(?:\.\d+)?/g) ?? []).sort();
}
function compare(a, b, path = '') {
  if (Array.isArray(a)) {
    assert.equal(b.length, a.length, `Array length: ${path}`);
    a.forEach((v, i) => compare(v, b[i], `${path}/${i}`));
  } else if (a && typeof a === 'object') {
    for (const [key, value] of Object.entries(a)) {
      assert.ok(Object.hasOwn(b, key), `Missing field: ${path}/${key}`);
      if (key !== 'searchTerms') compare(value, b[key], `${path}/${key}`);
    }
  } else if (typeof a === 'string') {
    assert.equal(typeof b, 'string', `Field type: ${path}`);
    if (/\/(id|url|related|kind|version)(\/\d+)?$/.test(path) || /\/rows\/\d+\/5$/.test(path) || /\/sources\/\d+\/label$/.test(path)) {
      assert.equal(b, a, `Identifier, link or publication title changed: ${path}`);
    }
    assert.deepEqual(numbers(b, false), numbers(a, true), `Numbers differ: ${path}`);
  } else {
    assert.equal(b, a, `Numerical value or flag differs: ${path}`);
  }
}
compare(source, english);

const base = '/bulletins-recherche-psi/';
const pairs = [['etat-des-preuves/', 'en/evidence/'], ...source.topics.map(t => [`etat-des-preuves/${t.id}/`, `en/evidence/${t.id}/`])];
const pages = new Map();
async function page(path) {
  if (!pages.has(path)) pages.set(path, await readFile(`dist/${path}index.html`, 'utf8'));
  return pages.get(path);
}
for (const [fr, en] of pairs) {
  for (const [path, lang, alternate, otherLang] of [[fr, 'fr', en, 'en'], [en, 'en', fr, 'fr']]) {
    const html = await page(path);
    assert.ok(html.includes(`<html lang="${lang}"`), `HTML language: ${path}`);
    assert.ok(html.includes(`hreflang="${otherLang}" href="https://recherche-psi.github.io${base}${alternate}"`), `Alternate metadata: ${path}`);
    assert.ok(html.includes(`href="${base}${alternate}" lang="${otherLang}" hreflang="${otherLang}"`), `Language switch: ${path}`);
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
      if (href.startsWith('#')) assert.ok(ids.has(decodeURIComponent(href.slice(1))), `Missing anchor ${href} on ${path}`);
      if (lang === 'en' && href.startsWith(`${base}etat-des-preuves/`)) assert.equal(href, `${base}${alternate}`, `English link falls back to French: ${path}`);
      if (href.startsWith(base)) {
        const target = href.slice(base.length).split('#')[0];
        await access(`dist/${target}${target.endsWith('/') || target === '' ? 'index.html' : ''}`);
      }
    }
  }
}
for (const path of ['etat-des-preuves/', 'en/evidence/']) {
  const html = await page(path);
  assert.equal((html.match(/<tr\b[^>]*\bdata-topic-row\b/g) ?? []).length, source.topics.length, `Directory coverage: ${path}`);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const [, path] of pairs) assert.ok(sitemap.includes(`${base}${path}</loc>`), `Missing sitemap entry: ${path}`);
console.log(`Evidence translations verified: ${source.topics.length} topics, ${pairs.length} reciprocal language pairs, identical numbers and source links, valid built links and anchors.`);
