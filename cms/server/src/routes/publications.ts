import { Router, Request, Response } from 'express';
import { readYamlArray, writeYaml } from '../services/yaml-service.js';
import { Publication } from '../types/index.js';

const router = Router();
const FILE = 'publications.yml';

router.get('/', (_req: Request, res: Response) => {
  const items = readYamlArray(FILE) as Publication[];
  res.json(items);
});

router.post('/', (req: Request, res: Response) => {
  const items = readYamlArray(FILE) as Publication[];
  // Insert at beginning (newest first)
  items.unshift(req.body);
  writeYaml(FILE, items);
  res.json({ success: true, index: 0 });
});

router.put('/reorder', (req: Request, res: Response) => {
  writeYaml(FILE, req.body);
  res.json({ success: true });
});

router.put('/:id', (req: Request, res: Response) => {
  const items = readYamlArray(FILE) as Publication[];
  const idx = parseInt(req.params.id as string);
  if (idx < 0 || idx >= items.length) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  items[idx] = req.body;
  writeYaml(FILE, items);
  res.json({ success: true });
});

router.delete('/:id', (req: Request, res: Response) => {
  const items = readYamlArray(FILE) as Publication[];
  const idx = parseInt(req.params.id as string);
  if (idx < 0 || idx >= items.length) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  items.splice(idx, 1);
  writeYaml(FILE, items);
  res.json({ success: true });
});

export default router;
