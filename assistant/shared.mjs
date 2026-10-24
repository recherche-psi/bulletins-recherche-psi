export const MAX_QUESTION = 1200;

export function validateCorpus(corpus) {
  if (corpus?.version_schema !== 1 || !Array.isArray(corpus.fiches)) throw new Error('Invalid corpus');
  const ids = new Set();
  for (const f of corpus.fiches) {
    const allowed = ['id', 'version', 'doi', 'texte_candidat_markdown', 'date_redaction'];
    if (Object.keys(f).some(k => !allowed.includes(k)) ||
        !/^PSI F\d{3,6}$/.test(f.id) || ids.has(f.id) ||
        !Number.isInteger(f.version) || f.version < 1 ||
        !/^10\.\d{4,9}\/\S+$/i.test(f.doi) ||
        typeof f.texte_candidat_markdown !== 'string' || !f.texte_candidat_markdown.trim() ||
        f.texte_candidat_markdown.length > 16000 || !/^\d{4}-\d{2}-\d{2}$/.test(f.date_redaction)) {
      throw new Error('Invalid fiche');
    }
    ids.add(f.id);
  }
  return corpus.fiches;
}

const words = text => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
const stop = new Set('les des une dans pour avec sur que qui est sont comment quels quelles this that with from what which the and'.split(' '));

export function searchFiches(fiches, question) {
  const terms = [...new Set(words(question))].filter(w => !stop.has(w));
  if (!terms.length) return [];
  const ranked = fiches.map(f => {
    const text = new Set(words(`${f.id} ${f.doi} ${f.texte_candidat_markdown}`));
    return { f, score: terms.filter(w => text.has(w)).length };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.f.id.localeCompare(b.f.id));
  const selected = ranked.slice(0, 3).map(x => x.f);
  // Keep explicitly linked studies together, including the initial study and its replication.
  for (const f of [...selected]) {
    for (const id of f.texte_candidat_markdown.match(/PSI F\d{3,6}/g) ?? []) {
      const related = fiches.find(x => x.id === id);
      if (related && !selected.some(x => x.id === id) && selected.length < 5) selected.push(related);
    }
  }
  return selected;
}

export function doiUrl(doi) { return `https://doi.org/${encodeURIComponent(doi)}`; }
