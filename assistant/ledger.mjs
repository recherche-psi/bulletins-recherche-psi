import { CAP_MICRO_USD, monthUTC } from './core.mjs';

export const SCHEMA = `CREATE TABLE IF NOT EXISTS months(month TEXT PRIMARY KEY, reserved INTEGER NOT NULL, last_request INTEGER NOT NULL);`;

// sql.exec returns a cursor with .toArray(); transaction must be synchronous/atomic.
export function initializeMonth(sql, transaction, month, baseline) {
  if (!/^\d{4}-\d{2}$/.test(month) || !Number.isSafeInteger(baseline) || baseline < 0 || baseline > CAP_MICRO_USD) throw new Error('Invalid baseline');
  return transaction(() => {
    sql.exec('INSERT INTO months(month, reserved, last_request) VALUES(?, ?, 0)', month, baseline);
    return 'initialized';
  });
}

export function reserveBudget(sql, transaction, cost, now) {
  if (!Number.isSafeInteger(cost) || cost <= 0) throw new Error('Invalid cost');
  return transaction(() => {
    const month = monthUTC(now);
    const row = sql.exec('SELECT reserved, last_request FROM months WHERE month = ?', month).toArray()[0];
    if (!row) return 'unavailable'; // Explicit initialization required; no silent reset.
    if (!Number.isSafeInteger(row.reserved) || row.reserved < 0 || !Number.isSafeInteger(row.last_request) || row.last_request < 0) return 'unavailable';
    if (row.reserved + cost > CAP_MICRO_USD) return 'budget';
    if (now.getTime() - row.last_request < 10000) return 'busy'; // Global, no IP storage.
    sql.exec('UPDATE months SET reserved = reserved + ?, last_request = ? WHERE month = ?', cost, now.getTime(), month);
    return 'ok';
  });
}
