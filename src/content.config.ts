import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    status: z.string(),
    reading: z.string(),
    authors: z.string(),
    publication: z.string(),
    doi: z.url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    announce: z.boolean().default(true),
});

const bulletins = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bulletins' }), schema,
});
const bulletinsEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bulletins-en' }), schema,
});
const vulgarisation = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/vulgarisation' }),
  schema: z.object({
    title: z.string(), description: z.string(), publishedAt: z.coerce.date(),
    order: z.number(), reading: z.string(), draft: z.boolean().default(false),
  }),
});
export const collections = { bulletins, bulletinsEn, vulgarisation };
