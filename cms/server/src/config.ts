import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Jekyll project root is two levels up from cms/server/src/
export const JEKYLL_ROOT = path.resolve(__dirname, '..', '..', '..');

export const PATHS = {
  data: path.join(JEKYLL_ROOT, '_data'),
  team: path.join(JEKYLL_ROOT, '_team'),
  posts: path.join(JEKYLL_ROOT, '_posts'),
  images: path.join(JEKYLL_ROOT, 'images'),
  config: path.join(JEKYLL_ROOT, '_config.yml'),
};

export const PORT = 3001;
export const WS_PORT = 3002;
