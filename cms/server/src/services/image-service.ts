import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PATHS } from '../config.js';

interface ProcessOptions {
  maxWidth: number;
  maxHeight?: number;
  quality: number;
  format: 'jpeg' | 'png';
}

const PRESETS: Record<string, ProcessOptions> = {
  team: { maxWidth: 400, maxHeight: 400, quality: 80, format: 'jpeg' },
  partners: { maxWidth: 300, maxHeight: 150, quality: 90, format: 'png' },
  default: { maxWidth: 1200, quality: 80, format: 'jpeg' },
};

export async function processImage(
  inputBuffer: Buffer,
  outputPath: string,
  preset: string = 'default'
): Promise<string> {
  const opts = PRESETS[preset] || PRESETS.default;
  let pipeline = sharp(inputBuffer).rotate(); // auto-rotate from EXIF

  if (opts.maxHeight) {
    pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, { fit: 'inside', withoutEnlargement: true });
  } else {
    pipeline = pipeline.resize(opts.maxWidth, undefined, { fit: 'inside', withoutEnlargement: true });
  }

  // Strip EXIF
  pipeline = pipeline.withMetadata({ orientation: undefined } as any);

  if (opts.format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: opts.quality });
  } else {
    pipeline = pipeline.png({ quality: opts.quality });
  }

  // Ensure output has correct extension
  const ext = '.' + opts.format;
  const parsed = path.parse(outputPath);
  const finalPath = path.join(parsed.dir, parsed.name + ext);

  const tmpPath = finalPath + '.tmp';
  await pipeline.toFile(tmpPath);
  fs.renameSync(tmpPath, finalPath);

  // Return path relative to JEKYLL_ROOT for use in YAML
  return '/' + path.relative(PATHS.images, finalPath).replace(/\\/g, '/');
}

export function listImages(subdir?: string): string[] {
  const dir = subdir ? path.join(PATHS.images, subdir) : PATHS.images;
  if (!fs.existsSync(dir)) return [];

  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(entry.name)) {
      const relPath = path.relative(PATHS.images, path.join(dir, entry.name));
      results.push('/images/' + relPath.replace(/\\/g, '/'));
    } else if (entry.isDirectory()) {
      results.push(...listImages(subdir ? path.join(subdir, entry.name) : entry.name));
    }
  }
  return results;
}

export function deleteImage(imagePath: string): void {
  // imagePath is like /images/team/photo.jpg
  const fullPath = path.join(PATHS.images, '..', imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
