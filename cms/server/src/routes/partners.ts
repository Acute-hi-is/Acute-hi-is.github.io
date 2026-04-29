import { Router, Request, Response } from 'express';
import { readYaml, writeYaml } from '../services/yaml-service.js';
import { PartnersData, Partner } from '../types/index.js';

const router = Router();
const FILE = 'partners.yml';

router.get('/', (_req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  res.json(data);
});

router.get('/:group', (req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  const group = req.params.group as keyof PartnersData;
  if (!data[group]) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json(data[group]);
});

router.post('/:group', (req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  const group = req.params.group as keyof PartnersData;
  if (!data[group]) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  data[group].push(req.body);
  writeYaml(FILE, data);
  res.json({ success: true });
});

router.put('/:group/reorder', (req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  const group = req.params.group as keyof PartnersData;
  if (!data[group]) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  data[group] = req.body;
  writeYaml(FILE, data);
  res.json({ success: true });
});

router.put('/:group/:index', (req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  const group = req.params.group as keyof PartnersData;
  const idx = parseInt(req.params.index as string);
  if (!data[group] || idx < 0 || idx >= data[group].length) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  data[group][idx] = req.body;
  writeYaml(FILE, data);
  res.json({ success: true });
});

router.delete('/:group/:index', (req: Request, res: Response) => {
  const data = readYaml<PartnersData>(FILE);
  const group = req.params.group as keyof PartnersData;
  const idx = parseInt(req.params.index as string);
  if (!data[group] || idx < 0 || idx >= data[group].length) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  data[group].splice(idx, 1);
  writeYaml(FILE, data);
  res.json({ success: true });
});

export default router;
