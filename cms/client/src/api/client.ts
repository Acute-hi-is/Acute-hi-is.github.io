const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  upload: async (file: File, dir: string, preset: string, filename?: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('dir', dir);
    form.append('preset', preset);
    if (filename) form.append('filename', filename);
    const res = await fetch(BASE + '/images/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
