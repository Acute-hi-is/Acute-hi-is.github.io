import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PORT, WS_PORT } from './config.js';
import { registerWsClient } from './services/jekyll-service.js';

import galleryRouter from './routes/gallery.js';
import statsRouter from './routes/stats.js';
import featuresRouter from './routes/features.js';
import publicationsRouter from './routes/publications.js';
import partnersRouter from './routes/partners.js';
import researchRouter from './routes/research.js';
import teamRouter from './routes/team.js';
import postsRouter from './routes/posts.js';
import imagesRouter from './routes/images.js';
import deployRouter from './routes/deploy.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/gallery', galleryRouter);
app.use('/api/stats', statsRouter);
app.use('/api/features', featuresRouter);
app.use('/api/publications', publicationsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/research', researchRouter);
app.use('/api/team', teamRouter);
app.use('/api/posts', postsRouter);
app.use('/api/images', imagesRouter);
app.use('/api/deploy', deployRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Start HTTP server
const server = createServer(app);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`CMS API server running at http://127.0.0.1:${PORT}`);
});

// WebSocket server for build/preview log streaming
const wss = new WebSocketServer({ port: WS_PORT, host: '127.0.0.1' });
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  registerWsClient(ws);
});
console.log(`WebSocket server running at ws://127.0.0.1:${WS_PORT}`);
