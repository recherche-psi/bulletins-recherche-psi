import { DurableObject } from 'cloudflare:workers';
import corpus from '../public/assistant/corpus.json';
import { validateCorpus } from './shared.mjs';
import { answerQuestion, failure, monthUTC, readSmallJSON } from './core.mjs';
import { SCHEMA, initializeMonth, reserveBudget } from './ledger.mjs';

const fiches = validateCorpus(corpus);
export class AssistantBudget extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env); this.ctx = ctx; this.env = env;
    this.ctx.storage.sql.exec(SCHEMA);
  }
  async fetch(request) {
    const transaction = callback => this.ctx.storage.transactionSync(callback);
    if (new URL(request.url).pathname === '/admin/initialize') {
      try {
        const {month, alreadyReservedMicroUsd} = await readSmallJSON(request);
        if (month !== monthUTC() || month !== this.env.APPROVED_MONTH) return failure('invalid_month', 400);
        initializeMonth(this.ctx.storage.sql, transaction, month, alreadyReservedMicroUsd);
        await this.ctx.storage.sync();
        return new Response('Initialized');
      } catch { return failure('initialization_refused', 409); }
    }
    return answerQuestion(request, this.env, fiches, async (cost, now) => {
      const decision = reserveBudget(this.ctx.storage.sql, transaction, cost, now);
      // Confirm storage before any outbound paid request.
      await this.ctx.storage.sync();
      return decision;
    });
  }
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path !== '/ask' && path !== '/admin/initialize') return failure('not_found', 404);
    if (path === '/admin/initialize') {
      if (request.method !== 'POST' || typeof env.ADMIN_TOKEN !== 'string' || env.ADMIN_TOKEN.length < 32 ||
          request.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return failure('forbidden', 403);
    } else {
      if (request.headers.get('origin') !== env.ALLOWED_ORIGIN) return failure('forbidden', 403);
      if (request.method === 'OPTIONS') return new Response(null, {status:204, headers:{
        'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN, 'Access-Control-Allow-Methods':'POST',
        'Access-Control-Allow-Headers':'Content-Type', 'Vary':'Origin', 'Cache-Control':'no-store',
      }});
      if (request.method !== 'POST') return failure('method', 405);
    }
    try {
      // Never derive this name from visitor input and never rotate it to renew a budget.
      const stub = env.BUDGET.get(env.BUDGET.idFromName('psi-global-budget-v1'));
      const response = await stub.fetch(request);
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store');
      headers.set('X-Content-Type-Options', 'nosniff');
      if (path === '/ask') { headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGIN); headers.set('Vary', 'Origin'); }
      return new Response(response.body, {status:response.status, headers});
    } catch { return failure('unavailable'); }
  },
};
