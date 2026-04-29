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
  const posts = readMarkdownDir(PATHS.posts);
  // Sort by date descending (filename contains date)
  posts.sort((a, b) => b.slug.localeCompare(a.slug));
  res.json(posts);
});

router.get('/:filename', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.posts, req.params.filename + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const post = readMarkdownFile(filePath);
  res.json(post);
});

router.post('/', (req: Request, res: Response) => {
  const { frontmatter, content } = req.body;
  const date = frontmatter.date || new Date().toISOString().split('T')[0];
  const titleSlug = slugify(frontmatter.title || 'new-post');
  const filename = `${date}-${titleSlug}`;
  const filePath = path.join(PATHS.posts, filename + '.md');

  // Ensure _posts directory exists
  if (!fs.existsSync(PATHS.posts)) {
    fs.mkdirSync(PATHS.posts, { recursive: true });
  }

  writeMarkdownFile(filePath, frontmatter, content || '');
  res.json({ success: true, filename });
});

router.put('/:filename', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.posts, req.params.filename + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const { frontmatter, content } = req.body;
  writeMarkdownFile(filePath, frontmatter, content || '');
  res.json({ success: true });
});

router.delete('/:filename', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.posts, req.params.filename + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  deleteMarkdownFile(filePath);
  res.json({ success: true });
});

export default router;
