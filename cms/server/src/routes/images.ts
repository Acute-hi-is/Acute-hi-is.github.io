import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PATHS } from '../config.js';
import { processImage, listImages, deleteImage } from '../services/image-service.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/', (req: Request, res: Response) => {
  const subdir = req.query.dir as string | undefined;
  const images = listImages(subdir);
  res.json(images);
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const subdir = (req.body.dir as string) || '';
    const preset = (req.body.preset as string) || 'default';
    const filename = (req.body.filename as string) || req.file.originalname;

    const outputDir = path.join(PATHS.images, subdir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    const relativePath = await processImage(req.file.buffer, outputPath, preset);

    res.json({ success: true, path: '/images' + (subdir ? '/' + subdir : '') + '/' + path.basename(outputPath).replace(path.extname(outputPath), '.' + (preset === 'partners' ? 'png' : 'jpeg')) });
  } catch (err) {
    res.status(500).json({ error: 'Image processing failed: ' + (err as Error).message });
  }
});

router.delete('/*', (req: Request, res: Response) => {
  const imagePath = '/images/' + req.params[0];
  try {
    deleteImage(imagePath);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
