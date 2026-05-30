import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PATHS } from '../config.js';

interface ProcessOptions {
  maxWidth: number;
  maxHeight?: number;
  quality: number;
  format: 'jpeg' | 'png';
  watermark?: boolean;
}

const PRESETS: Record<string, ProcessOptions> = {
  team: { maxWidth: 400, maxHeight: 400, quality: 80, format: 'jpeg' },
  partners: { maxWidth: 300, maxHeight: 150, quality: 90, format: 'png' },
  project: { maxWidth: 1400, quality: 82, format: 'jpeg', watermark: true },
  default: { maxWidth: 1200, quality: 80, format: 'jpeg' },
};

const WATERMARK_LOGO = path.join(PATHS.images, 'logo_horizontal_white.svg');

async function buildWatermark(targetWidth: number): Promise<Buffer> {
  // Watermark is ~16% of image width, capped at 220px
  const wmWidth = Math.max(80, Math.min(220, Math.round(targetWidth * 0.16)));
  // Margin scales with image
  const margin = Math.max(12, Math.round(targetWidth * 0.02));

  // Render the white SVG logo, resize, then knock alpha down to ~45%
  const base = sharp(WATERMARK_LOGO, { density: 220 })
    .resize({ width: wmWidth })
    .ensureAlpha();

  const dimmed = await base
    .composite([
      {
        // Solid translucent layer; 'dest-in' keeps only intersection,
        // which effectively multiplies the alpha channel by ~115/255 ≈ 0.45.
        input: Buffer.from([255, 255, 255, 115]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  // Pad the watermark with margin space so it sits inset from the bottom-right
  // when composited with gravity: 'southeast'.
  return sharp(dimmed)
    .extend({
      top: 0,
      bottom: margin,
      left: 0,
      right: margin,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

export async function processImage(
  inputBuffer: Buffer,
  outputPath: string,
  preset: string = 'default',
  watermarkOverride?: boolean
): Promise<string> {
  const baseOpts = PRESETS[preset] || PRESETS.default;
  const opts: ProcessOptions = {
    ...baseOpts,
    watermark:
      watermarkOverride === undefined ? baseOpts.watermark : watermarkOverride,
  };
  let pipeline = sharp(inputBuffer).rotate(); // auto-rotate from EXIF

  if (opts.maxHeight) {
    pipeline = pipeline.resize(opts.maxWidth, opts.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  } else {
    pipeline = pipeline.resize(opts.maxWidth, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Strip EXIF
  pipeline = pipeline.withMetadata({ orientation: undefined } as any);

  // Apply watermark before format conversion so we keep alpha
  if (opts.watermark && fs.existsSync(WATERMARK_LOGO)) {
    const resizedPng = await pipeline.png().toBuffer();
    const meta = await sharp(resizedPng).metadata();
    const watermark = await buildWatermark(meta.width || opts.maxWidth);
    pipeline = sharp(resizedPng).composite([
      { input: watermark, gravity: 'southeast' },
    ]);
  }

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
