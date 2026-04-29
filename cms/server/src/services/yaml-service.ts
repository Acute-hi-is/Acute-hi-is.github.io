import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { PATHS } from '../config.js';

// Header comments that js-yaml strips — we preserve them on write
const FILE_HEADERS: Record<string, string> = {
  'gallery.yml': '# Gallery items — homepage "Inside the lab" section\n\n',
  'stats.yml': '# Stats ticker items — displayed as a seamless scrolling ribbon on the homepage\n# The Liquid template duplicates the set automatically for the CSS loop\n\n',
  'features.yml': '# Featured research — homepage 50/50 feature rows\n# "reverse: true" flips the image/text layout\n\n',
  'partners.yml': '# Partners & funders — single source of truth\n\n',
  'publications.yml': '# Publications — ordered by date (newest first)\n# To add a publication: add a new entry here. The template handles rendering.\n# Fields: title, authors, venue, year, doi, topic (haptics|acoustics|perception), summary, image (optional)\n\n',
  'research.yml': '# Research areas — single source of truth\n# Used by research/index.md (full view) and index.md (highlight cards)\n# Order determines display order and numbering (01, 02, ...)\n\n',
};

export function readYaml<T = unknown>(filename: string): T {
  const filePath = path.join(PATHS.data, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content) as T;
}

export function writeYaml(filename: string, data: unknown): void {
  const filePath = path.join(PATHS.data, filename);
  const header = FILE_HEADERS[filename] || '';
  const yamlStr = yaml.dump(data, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: false,
    noRefs: true,
    sortKeys: false,
  });
  // Atomic write: write to .tmp then rename
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, header + yamlStr, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

export function readYamlArray(filename: string): unknown[] {
  const data = readYaml(filename);
  return Array.isArray(data) ? data : [];
}
