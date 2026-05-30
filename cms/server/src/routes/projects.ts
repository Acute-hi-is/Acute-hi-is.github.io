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

function ensureProjectsDir() {
  if (!fs.existsSync(PATHS.projects)) {
    fs.mkdirSync(PATHS.projects, { recursive: true });
  }
}

router.get('/', (_req: Request, res: Response) => {
  ensureProjectsDir();
  const projects = readMarkdownDir(PATHS.projects);
  projects.sort((a, b) => {
    const orderA = (a.frontmatter.order as number) ?? 999;
    const orderB = (b.frontmatter.order as number) ?? 999;
    return orderA - orderB;
  });
  res.json(projects);
});

router.get('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.projects, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const project = readMarkdownFile(filePath);
  res.json(project);
});

router.post('/', (req: Request, res: Response) => {
  ensureProjectsDir();
  const { frontmatter, content } = req.body;
  const slug = slugify(frontmatter.title || 'new-project');
  const filePath = path.join(PATHS.projects, slug + '.md');
  if (fs.existsSync(filePath)) {
    res.status(409).json({ error: 'A project with this title already exists' });
    return;
  }
  writeMarkdownFile(filePath, { layout: 'project', ...frontmatter }, content || '');
  res.json({ success: true, slug });
});

router.put('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.projects, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const { frontmatter, content } = req.body;
  writeMarkdownFile(filePath, { layout: 'project', ...frontmatter }, content || '');

  const newSlug = slugify(frontmatter.title);
  if (newSlug && newSlug !== req.params.slug) {
    const newPath = path.join(PATHS.projects, newSlug + '.md');
    fs.renameSync(filePath, newPath);
    res.json({ success: true, slug: newSlug });
    return;
  }
  res.json({ success: true, slug: req.params.slug });
});

router.delete('/:slug', (req: Request, res: Response) => {
  const filePath = path.join(PATHS.projects, req.params.slug + '.md');
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  deleteMarkdownFile(filePath);
  res.json({ success: true });
});

export default router;
