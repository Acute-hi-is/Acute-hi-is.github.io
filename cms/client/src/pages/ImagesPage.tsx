import { useState, useRef } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Upload, Trash2, FolderOpen } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';

export function ImagesPage() {
  const [dir, setDir] = useState('');
  const { data: images, reload } = useData<string[]>(`/images?dir=${dir}`);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dirs = ['', 'team', 'partners'];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await api.upload(file, dir || '', dir === 'team' ? 'team' : dir === 'partners' ? 'partners' : 'default');
      }
      showToast(`${files.length} image(s) uploaded`);
      reload();
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const pathPart = deleting.replace(/^\/images\//, '');
      await api.del(`/images/${pathPart}`);
      showToast('Image deleted');
      setDeleting(null);
      reload();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <Shell
      title="Image Manager"
      actions={
        <>
          <button className="btn btn--primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
        </>
      }
    >
      <div className="filter-bar">
        {dirs.map(d => (
          <button
            key={d}
            className={`btn btn--sm ${dir === d ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setDir(d)}
          >
            <FolderOpen size={14} /> {d || 'All'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {images?.length || 0} image(s)
        </span>
      </div>

      <div className="grid-4">
        {images?.map(img => (
          <div key={img} className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
            <img
              src={img}
              alt=""
              style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
              {img}
            </div>
            <button className="btn--icon" onClick={() => setDeleting(img)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {images?.length === 0 && (
        <div className="empty-state">
          <p>No images found in this directory.</p>
        </div>
      )}

      {deleting && <ConfirmDialog message={`Delete ${deleting}?`} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </Shell>
  );
}
