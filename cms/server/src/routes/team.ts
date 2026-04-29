import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { PATHS } from '../config.js';
import {
  readMarkdownDir,
  readMarkdownFile,
  writeMarkdownFile,
  deleteMarkdownFile,
  slugify,
} from '../services/markdown-service.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const members = readMarkdownDir(PATHS.team);
  // Sort by order field
  members.sort((a, b) => {
    const orderA = (a.frontmatter.order as number) || 999;
    const orderB = (b.frontmatter.order as number) || 999;
    return orderA - orderB;
  });
  res.json(members);
});

router.get('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.team, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const member = readMarkdownFile(filePath);
  res.json(member);
});

router.post('/', (req: Request, res: Response) => {
  const { frontmatter, content } = req.body;
  const slug = slugify(frontmatter.title || 'new-member');
  const filePath = path.join(PATHS.team, slug + '.md');
  if (fs.existsSync(filePath)) {
    res.status(409).json({ error: 'Member with this name already exists' });
    return;
  }
  writeMarkdownFile(filePath, { layout: 'member', ...frontmatter }, content || '');
  res.json({ success: true, slug });
});

router.put('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.team, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const { frontmatter, content } = req.body;
  writeMarkdownFile(filePath, { layout: 'member', ...frontmatter }, content || '');

  // If title changed, rename the file
  const newSlug = slugify(frontmatter.title);
  if (newSlug !== req.params.slug) {
    const newPath = path.join(PATHS.team, newSlug + '.md');
    fs.renameSync(filePath, newPath);
  }

  res.json({ success: true, slug: newSlug || req.params.slug });
});

router.delete('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.team, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  deleteMarkdownFile(filePath);
  res.json({ success: true });
});

export default router;
