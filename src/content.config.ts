import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bulletins = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bulletins' }),
  schema: z.object({
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
  }),
});

export const collections = { bulletins };
