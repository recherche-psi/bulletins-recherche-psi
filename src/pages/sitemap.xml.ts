import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const posts = await getCollection('bulletins', ({ data }) => !data.draft);
  const translations = await getCollection('bulletinsEn', ({ data }) => !data.draft);
  const root = new URL('/bulletins-recherche-psi/', site);
  const paths = ['', 'bulletins/', 'methode/', 'a-propos/', 'en/', 'en/bulletins/', 'en/method/', 'en/about/', ...translations.map(post => `en/bulletins/${post.id}/`), ...posts.map((post) => `bulletins/${post.id}/`)];
  const urls = paths.map((path) => `<url><loc>${new URL(path, root).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
