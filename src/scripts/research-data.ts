import { decryptEnvelope } from '../lib/research-crypto';

interface DataFile { name: string; role: string; format?: string; size?: string; url?: string; encrypted?: boolean; downloadName?: string }
interface Source { label: string; url: string }
interface Protocol { id: string; category: string; title: string; authors: string; intro: string; structure: string; note?: string; analysis?: string; granularity?: string; verified?: string; license?: string; files: DataFile[]; sources: Source[] }
interface Category { id: string; title: string; description: string }
interface Catalog { version: number; categories: Category[]; protocols: Protocol[] }
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const root = el<HTMLDivElement>('data-space');
const gate = el<HTMLElement>('data-gate'), library = el<HTMLElement>('data-library');
const form = el<HTMLFormElement>('data-unlock'), passwordInput = el<HTMLInputElement>('data-password');
const message = el<HTMLParagraphElement>('access-message'), unlockButton = el<HTMLButtonElement>('unlock-button');
const search = el<HTMLInputElement>('data-search'), status = el<HTMLSelectElement>('data-status');
const list = el<HTMLDivElement>('protocol-list');
let catalog: Catalog | null = null, secret = '', selected = 'all', epoch = 0;
function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = ''): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag); element.textContent = text; if(className) element.className = className; return element;
}
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function urlFor(raw: string) { const url = new URL(raw, window.location.href); if(url.protocol !== 'https:' && url.origin !== window.location.origin) throw new Error('Lien non autorisé.'); return url.href; }
function link(text: string, url: string) { const a = node('a', text); a.href = urlFor(url); if(new URL(a.href).origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
async function envelopeAt(url: string) { const response = await fetch(urlFor(url), {cache:'no-store', credentials:'omit'}); if(!response.ok) throw new Error('Téléchargement indisponible.'); return response.json(); }
function showMessage(text: string, error = false) { message.textContent = text; message.dataset.error = String(error); }
el<HTMLButtonElement>('show-password').addEventListener('click', event => {
  const button = event.currentTarget as HTMLButtonElement, visible = passwordInput.type === 'password';
  passwordInput.type = visible ? 'text' : 'password'; button.textContent = visible ? 'Masquer' : 'Afficher'; button.setAttribute('aria-pressed', String(visible)); button.setAttribute('aria-label', visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
});
form.addEventListener('submit', async event => {
  event.preventDefault(); unlockButton.disabled = true; showMessage('Ouverture de l’espace…');
  const attempt = ++epoch; const supplied = passwordInput.value;
  try {
    if(!crypto.subtle) throw new Error('Utilisez un navigateur récent et une connexion HTTPS.');
    let envelope;
    try { envelope = await envelopeAt(root.dataset.catalog!); } catch { throw new Error('Impossible de charger le catalogue. Vérifiez votre connexion, puis réessayez.'); }
    let clear;
    try { clear = await decryptEnvelope(envelope, supplied); } catch { throw new Error('Mot de passe incorrect ou catalogue endommagé. Réessayez.'); }
    const result = JSON.parse(new TextDecoder().decode(clear)) as Catalog;
    if(result.version !== 1 || !Array.isArray(result.protocols) || !Array.isArray(result.categories)) throw new Error('Le catalogue est invalide.');
    if(attempt !== epoch) return;
    catalog = result; secret = supplied; passwordInput.value = ''; selected = 'all'; search.value = ''; status.value = 'all';
    renderCategories(); render(); gate.hidden = true; library.hidden = false; showMessage(''); el('library-title').focus(); openHash();
  } catch(error) { if(attempt === epoch) { showMessage(error instanceof Error ? error.message : 'Ouverture impossible.', true); passwordInput.select(); } }
  finally { unlockButton.disabled = false; }
});
function lock() {
  epoch++; secret = ''; catalog = null; list.replaceChildren(); el('category-filters').replaceChildren(); el('data-count').textContent = ''; search.value = ''; passwordInput.value = ''; passwordInput.type = 'password';
  const show = el<HTMLButtonElement>('show-password'); show.textContent = 'Afficher'; show.setAttribute('aria-pressed','false'); show.setAttribute('aria-label','Afficher le mot de passe');
  library.hidden = true; gate.hidden = false; history.replaceState(null,'',location.pathname + location.search); passwordInput.focus();
}
el('data-lock').addEventListener('click', lock);
window.addEventListener('pagehide', lock);
function renderCategories() {
  const holder = el('category-filters'); holder.replaceChildren();
  catalog!.categories.forEach((category, index) => {
    const count = catalog!.protocols.filter(p => p.category === category.id).length;
    const button = node('button', '', 'category-card'); button.type = 'button'; button.dataset.category = category.id; button.setAttribute('aria-pressed', String(selected === category.id));
    button.append(node('span', `0${index+1} / ${count} fiches`, 'category-number'), node('strong', category.title), node('small', category.description));
    button.addEventListener('click', () => { selected = selected === category.id ? 'all' : category.id; renderCategories(); render(); }); holder.append(button);
  });
}
async function downloadEncrypted(file: DataFile, button: HTMLButtonElement) {
  const attempt = epoch; button.disabled = true; button.textContent = 'Préparation…';
  try {
    const buffer = await decryptEnvelope(await envelopeAt(file.url!), secret); if(attempt !== epoch || !catalog) return;
    const url = URL.createObjectURL(new Blob([buffer], {type:'application/octet-stream'}));
    const a = node('a'); a.href = url; a.download = file.downloadName || file.name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    button.textContent = 'Télécharger à nouveau';
  } catch { button.textContent = 'Échec · réessayer'; } finally { button.disabled = false; }
}
function card(protocol: Protocol) {
  const details = node('details', '', 'protocol'); details.id = protocol.id;
  const summary = node('summary'), heading = node('div');
  heading.append(node('span', catalog!.categories.find(c => c.id === protocol.category)!.title, 'protocol-tag'),node('h3', protocol.title),node('p',protocol.intro),node('p',protocol.authors,'protocol-meta'));
  if(protocol.granularity) heading.append(node('p',protocol.granularity,'protocol-meta'));
  const plus = node('span','+','protocol-open'); plus.setAttribute('aria-hidden','true'); summary.append(heading,plus); details.append(summary);
  const body = node('div','','protocol-content');
  body.append(node('h4','Le protocole'),node('p',protocol.intro),node('h4','Comprendre la structure des données'),node('p',protocol.structure,'structure-text'));
  if(protocol.note) body.append(node('p',protocol.note,'protocol-note'));
  if(protocol.analysis) body.append(node('h4','Pistes de réanalyse'),node('p',protocol.analysis));
  body.append(node('h4','Fichiers et téléchargements'));
  if(protocol.files.length) {
    const wrap=node('div','','file-table-wrap'), table=node('table','','file-table'), caption=node('caption',`Fichiers — ${protocol.title}`); caption.className='sr-only'; table.append(caption);
    const thead=node('thead'), header=node('tr'); ['Fichier','Contenu / statut','Accès'].forEach(label=>{const th=node('th',label);th.scope='col';header.append(th);}); thead.append(header);table.append(thead);const tbody=node('tbody');
    protocol.files.forEach(file=>{const row=node('tr'), name=node('td',file.name);name.append(node('small',[file.format,file.size].filter(Boolean).join(' · ')));const action=node('td');
      if(file.url && file.encrypted){const button=node('button','Télécharger');button.type='button';button.setAttribute('aria-label',`Télécharger ${file.name}`);button.addEventListener('click',()=>downloadEncrypted(file,button));action.append(button);}
      else if(file.url) action.append(link('Télécharger ↗',file.url)); else action.append(node('span','Voir le dépôt source','data-small'));
      row.append(name,node('td',file.role),action);tbody.append(row);
    });table.append(tbody);wrap.append(table);body.append(wrap);
  } else body.append(node('p','Les fichiers se consultent depuis le dépôt source ci-dessous. Aucun fichier brut local n’a été confirmé.'));
  body.append(node('h4','Sources et citation'));const sources=node('div','','protocol-sources');protocol.sources.forEach(source=>sources.append(link(source.label+' ↗',source.url)));body.append(sources);
  if(protocol.license) body.append(node('p',protocol.license,'data-small'));
  if(protocol.verified) body.append(node('p',`Fichiers et documentation vérifiés le ${new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeZone:'UTC'}).format(new Date(protocol.verified+'T00:00:00Z'))}.`,'data-small'));
  if(!protocol.sources.length) body.append(node('p','Simulation locale : paramètres et méthode fournis dans l’archive.'));
  const anchor=link('Lien vers cette fiche',`#${protocol.id}`);const anchorLine=node('p');anchorLine.append(anchor);body.append(anchorLine);details.append(body);
  return details;
}
function render() {
  if(!catalog)return;const tokens=normalize(search.value).trim().split(/\s+/).filter(Boolean);
  const matches=catalog.protocols.filter(p=>(selected==='all'||p.category===selected)&&tokens.every(token=>normalize([p.title,p.authors,p.intro,p.structure,p.analysis||'',p.granularity||'',...p.files.map(f=>f.name)].join(' ')).includes(token))&&(status.value==='all'||(p.files.some(f=>f.url)?'download':'source')===status.value));
  list.replaceChildren(...matches.map(card));el('data-count').textContent=`${matches.length} fiche${matches.length===1?'':'s'} sur ${catalog.protocols.length} · Ouvrez une fiche pour consulter ses fichiers.`;el('no-results').hidden=matches.length>0;
}
function openHash(){if(!catalog||!location.hash)return;let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(target instanceof HTMLDetailsElement && list.contains(target)){target.open=true;target.scrollIntoView({block:'start'});}}
search.addEventListener('input',render);status.addEventListener('change',render);window.addEventListener('hashchange',openHash);
el('reset-filters').addEventListener('click',()=>{selected='all';search.value='';status.value='all';renderCategories();render();});
