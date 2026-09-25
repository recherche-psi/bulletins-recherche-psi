import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);

export async function GET({ site }: { site: URL }) {
  const posts = (await getCollection('bulletinsEn', ({ data }) => !data.draft)).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const root = new URL('/bulletins-recherche-psi/en/', site);
  const items = posts.map((post) => {
    const link = new URL(`bulletins/${post.id}/`, root).href;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${post.data.publishedAt.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Psi Research Bulletins</title><link>${root.href}</link><description>Critical reviews of publications in parapsychology, anomalistics and consciousness studies.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
