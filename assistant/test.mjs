import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { validateCorpus, searchFiches } from './shared.mjs';
import { answerQuestion, reservationCost, CAP_MICRO_USD } from './core.mjs';
import { SCHEMA, initializeMonth, reserveBudget } from './ledger.mjs';
import { readFileSync } from 'node:fs';

const date = new Date('2026-09-15T12:00:00Z');
const env = { AI_ENABLED:'true', LEGAL_REVIEW_CONFIRMED:'true', PRICING_REVIEW_CONFIRMED:'true', APPROVED_MONTH:'2026-09', OPENAI_API_KEY:'test-only-not-a-real-key', MODEL:'test-model', MODEL_INPUT_TOKEN_CEILING:'128000', INPUT_USD_PER_MILLION:'1', OUTPUT_USD_PER_MILLION:'2' };
const fiche = (id, text) => ({id, version:1, doi:'10.1234/example', texte_candidat_markdown:text, date_redaction:'2026-09-27'});
const fiches = [fiche('PSI F001','Le rappel est étudié. Voir PSI F002.'), fiche('PSI F002','Réplication indépendante et limites.')];
const request = (question = 'rappel', extra = {}) => new Request('https://example.test/ask', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question, lang:'fr', ...extra})});
const completed = text => Response.json({status:'completed', output:[{type:'message',content:[{type:'output_text',text}]}]});

test('public corpus schema rejects private fields and duplicate identifiers', () => {
  const publicCorpus = JSON.parse(readFileSync(new URL('../public/assistant/corpus.json', import.meta.url)));
  validateCorpus(publicCorpus);
  assert.throws(() => validateCorpus({version_schema:1,fiches:[{...fiches[0], chemin_pdf:'private'}]}));
  assert.throws(() => validateCorpus({version_schema:1,fiches:[fiches[0],fiches[0]]}));
});
test('retrieval includes linked replication and handles accents/no match', () => {
  assert.deepEqual(searchFiches(fiches, 'rappel').map(f => f.id), ['PSI F001','PSI F002']);
  assert.equal(searchFiches(fiches, 'replication')[0].id, 'PSI F002');
  assert.deepEqual(searchFiches(fiches, 'telepathie'), []);
});
test('disabled, unreviewed, expired month, no sources and invalid input never spend', async () => {
  let calls = 0; const forbidden = async () => { calls++; throw new Error('Forbidden'); };
  for (const change of [{AI_ENABLED:'false'}, {LEGAL_REVIEW_CONFIRMED:'false'}, {PRICING_REVIEW_CONFIRMED:'false'}, {APPROVED_MONTH:'2026-08'}, {OPENAI_API_KEY:''}]) {
    assert.equal((await answerQuestion(request(), {...env,...change}, fiches, forbidden, forbidden, date)).status, 503);
  }
  for (const req of [request(''),request('x'.repeat(1201)),request('rappel',{model:'override'}),request('telepathie'),request('reproduis le texte intégral')]) {
    assert.ok((await answerQuestion(req,env,fiches,forbidden,forbidden,date)).status >= 400);
  }
  assert.equal(calls,0);
});
test('budget rejection and unavailable ledger prevent paid calls', async () => {
  let calls = 0;
  for (const code of ['budget','busy','unavailable']) {
    const response = await answerQuestion(request(),env,fiches,async () => code,async () => {calls++;},date);
    assert.equal((await response.json()).code,code);
  }
  const response = await answerQuestion(request(),env,fiches,async () => {throw Error('disk');},async () => {calls++;},date);
  assert.equal(response.status,503); assert.equal(calls,0);
});
test('reserve precedes the only call; no tools, storage or client model override', async () => {
  const order = [];
  const response = await answerQuestion(request(),env,fiches,async cost => {assert.equal(cost,129200); order.push('reserve'); return 'ok';}, async (url, options) => {
    order.push('fetch'); assert.equal(url,'https://api.openai.com/v1/responses');
    const body = JSON.parse(options.body);
    assert.equal(body.store,false); assert.equal(body.background,false); assert.equal(body.max_output_tokens,600);
    assert.equal(body.model,'test-model'); assert.equal(body.tools,undefined);
    assert.equal(JSON.parse(body.input).fiches.length,2);
    return completed('Résultat limité [PSI F001], réplication [PSI F002].');
  },date);
  assert.equal(response.status,200); assert.deepEqual(order,['reserve','fetch']);
});
test('failed or ungrounded outputs retain the reservation and are never retried', async () => {
  for (const provider of [async () => {throw Error('timeout');}, async () => completed('[PSI F999]'),async () => completed('Sans source'),async () => Response.json({status:'incomplete'})]) {
    let reservations = 0, calls = 0;
    const response = await answerQuestion(request(),env,fiches,async () => {reservations++; return 'ok';}, async () => {calls++; return provider();},date);
    assert.equal(response.status,503); assert.equal(reservations,1); assert.equal(calls,1);
  }
});
test('invalid prices fail closed and context ceiling determines reservation', () => {
  assert.equal(reservationCost(env),129200);
  for (const change of [{INPUT_USD_PER_MILLION:''},{OUTPUT_USD_PER_MILLION:'NaN'},{MODEL_INPUT_TOKEN_CEILING:'1'}]) assert.throws(() => reservationCost({...env,...change}));
});
test('UTC month boundaries block calls before any reservation', async () => {
  for (const instant of ['2026-09-30T23:56:00Z','2026-09-01T00:02:00Z']) {
    let calls = 0;
    const response = await answerQuestion(request(),env,fiches,async () => {calls++; return 'ok';},async () => {calls++;},new Date(instant));
    assert.equal(response.status,503); assert.equal(calls,0);
  }
});

function ledger() {
  const db = new DatabaseSync(':memory:'); db.exec(SCHEMA);
  const sql = {exec(query,...args) {
    const statement = db.prepare(query);
    if (query.startsWith('SELECT')) return {toArray:() => statement.all(...args)};
    statement.run(...args); return {toArray:() => []};
  }};
  const transaction = fn => {
    db.exec('BEGIN IMMEDIATE');
    try {const result = fn(); db.exec('COMMIT'); return result;} catch (e) {db.exec('ROLLBACK');throw e;}
  };
  return {db,sql,transaction};
}
test('real SQLite budget: fail closed, initialize once, cap, throttle, restart wrapper, month renewal', () => {
  const {db,sql,transaction} = ledger();
  try {
    assert.equal(reserveBudget(sql,transaction,1,date),'unavailable');
    initializeMonth(sql,transaction,'2026-09',0);
    assert.throws(() => initializeMonth(sql,transaction,'2026-09',0));
    assert.equal(reserveBudget(sql,transaction,1_000_000,date),'ok');
    assert.equal(reserveBudget(sql,transaction,1_000_000,date),'busy');
    for (let i = 1; i < 4; i++) assert.equal(reserveBudget(sql,transaction,1_000_000,new Date(+date + i * 11000)),'ok');
    assert.equal(reserveBudget(sql,transaction,500001,new Date(+date + 60000)),'budget');
    assert.equal(reserveBudget(sql,transaction,500000,new Date(+date + 60000)),'ok');
    assert.equal(sql.exec('SELECT reserved FROM months WHERE month = ?','2026-09').toArray()[0].reserved,CAP_MICRO_USD);
    assert.equal(reserveBudget(sql,transaction,1,new Date('2026-10-02T12:00:00Z')),'unavailable');
  } finally {db.close();}
});
test('overlapping reservations cannot exceed the global cap', async () => {
  const {db,sql,transaction} = ledger();
  try {
    initializeMonth(sql,transaction,'2026-09',0);
    const decisions = await Promise.all(Array.from({length:20},(_,i) => Promise.resolve().then(() => reserveBudget(sql,transaction,1_000_000,new Date(+date+i*11000)))));
    assert.equal(decisions.filter(x => x === 'ok').length,4);
    assert.equal(sql.exec('SELECT reserved FROM months WHERE month = ?','2026-09').toArray()[0].reserved,4_000_000);
  } finally {db.close();}
});
