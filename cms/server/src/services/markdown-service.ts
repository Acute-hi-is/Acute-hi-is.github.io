import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MarkdownFile {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export function readMarkdownDir(dirPath: string): MarkdownFile[] {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  return files.map(f => readMarkdownFile(path.join(dirPath, f)));
}

export function readMarkdownFile(filePath: string): MarkdownFile {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, '.md');
  return { slug, frontmatter: data, content: content.trim() };
}

export function writeMarkdownFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  content: string
): void {
  const output = matter.stringify('\n' + content.trim() + '\n', frontmatter);
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, output, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

export function deleteMarkdownFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
