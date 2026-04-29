import { Router, Request, Response } from 'express';
import * as gitService from '../services/git-service.js';
import * as jekyllService from '../services/jekyll-service.js';

const router = Router();

router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await gitService.getStatus();
    const log = await gitService.getLog(5);
    res.json({ status, log });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/diff', async (_req: Request, res: Response) => {
  try {
    const diff = await gitService.getDiff();
    res.json({ diff });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/build', async (_req: Request, res: Response) => {
  try {
    const code = await jekyllService.build();
    res.json({ success: code === 0, code });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/commit', async (req: Request, res: Response) => {
  try {
    const { message, files } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Commit message required' });
      return;
    }
    const result = await gitService.stageAndCommit(message, files);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/push', async (_req: Request, res: Response) => {
  try {
    const result = await gitService.push();
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post('/deploy', async (req: Request, res: Response) => {
  try {
    // Build
    const buildCode = await jekyllService.build();
    if (buildCode !== 0) {
      res.status(500).json({ error: 'Build failed', step: 'build' });
      return;
    }

    // Commit
    const message = req.body.message || `Content update ${new Date().toISOString().split('T')[0]}`;
    await gitService.stageAndCommit(message);

    // Push
    await gitService.push();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Preview management
router.post('/preview/start', (_req: Request, res: Response) => {
  const started = jekyllService.startPreview();
  res.json({ success: started, running: jekyllService.isPreviewRunning() });
});

router.post('/preview/stop', (_req: Request, res: Response) => {
  const stopped = jekyllService.stopPreview();
  res.json({ success: stopped, running: jekyllService.isPreviewRunning() });
});

router.get('/preview/status', (_req: Request, res: Response) => {
  res.json({ running: jekyllService.isPreviewRunning() });
});

export default router;
