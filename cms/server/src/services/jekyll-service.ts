import { spawn, ChildProcess } from 'child_process';
import { JEKYLL_ROOT } from '../config.js';
import { WebSocket } from 'ws';

let jekyllProcess: ChildProcess | null = null;
let wsClients: Set<WebSocket> = new Set();

export function registerWsClient(ws: WebSocket) {
  wsClients.add(ws);
  ws.on('close', () => wsClients.delete(ws));
}

function broadcast(data: { type: string; message: string }) {
  const payload = JSON.stringify(data);
  for (const ws of wsClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

export function startPreview(): boolean {
  if (jekyllProcess) return false;

  jekyllProcess = spawn('bundle', ['exec', 'jekyll', 'serve', '--port', '4001', '--incremental', '--livereload'], {
    cwd: JEKYLL_ROOT,
    shell: true,
  });

  jekyllProcess.stdout?.on('data', (data: Buffer) => {
    broadcast({ type: 'preview', message: data.toString() });
  });

  jekyllProcess.stderr?.on('data', (data: Buffer) => {
    broadcast({ type: 'preview', message: data.toString() });
  });

  jekyllProcess.on('exit', () => {
    jekyllProcess = null;
    broadcast({ type: 'preview', message: '[Preview server stopped]' });
  });

  return true;
}

export function stopPreview(): boolean {
  if (!jekyllProcess) return false;
  jekyllProcess.kill('SIGTERM');
  jekyllProcess = null;
  return true;
}

export function isPreviewRunning(): boolean {
  return jekyllProcess !== null;
}

export async function build(): Promise<number> {
  return new Promise((resolve) => {
    broadcast({ type: 'build', message: '[Starting Jekyll build...]\n' });

    const proc = spawn('bundle', ['exec', 'jekyll', 'build'], {
      cwd: JEKYLL_ROOT,
      shell: true,
    });

    proc.stdout?.on('data', (data: Buffer) => {
      broadcast({ type: 'build', message: data.toString() });
    });

    proc.stderr?.on('data', (data: Buffer) => {
      broadcast({ type: 'build', message: data.toString() });
    });

    proc.on('exit', (code) => {
      broadcast({ type: 'build', message: `\n[Build finished with code ${code}]\n` });
      resolve(code ?? 1);
    });
  });
}

// Cleanup on process exit
process.on('SIGINT', () => {
  stopPreview();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopPreview();
  process.exit(0);
});
