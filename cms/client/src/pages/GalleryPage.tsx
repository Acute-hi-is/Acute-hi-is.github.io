import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface GalleryItem {
  image: string;
  alt: string;
  caption: string;
}

const EMPTY: GalleryItem = { image: '', alt: '', caption: '' };

export function GalleryPage() {
  const { data: items, reload } = useData<GalleryItem[]>('/gallery');
  const [editing, setEditing] = useState<{ index: number; item: GalleryItem } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<GalleryItem>(EMPTY);
  const [deleting, setDeleting] = useState<number | null>(null);

  const openCreate = () => {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (index: number, item: GalleryItem) => {
    setForm({ ...item });
    setEditing({ index, item });
    setCreating(false);
  };

  const save = async () => {
    try {
      if (creating) {
        await api.post('/gallery', form);
        showToast('Gallery item added');
      } else if (editing) {
        await api.put(`/gallery/${editing.index}`, form);
        showToast('Gallery item updated');
      }
      setCreating(false);
      setEditing(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const confirmDelete = async () => {
    if (deleting === null) return;
    try {
      await api.del(`/gallery/${deleting}`);
      showToast('Item deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const moveItem = async (from: number, to: number) => {
    if (!items || to < 0 || to >= items.length) return;
    const newItems = [...items];
    const [item] = newItems.splice(from, 1);
    newItems.splice(to, 0, item);
    try {
      await api.put('/gallery/reorder', newItems);
      reload();
    } catch (e) {
      showToast('Reorder failed', 'error');
    }
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Gallery"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Photo</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'Add Gallery Item' : 'Edit Gallery Item'}</h2>
          <div className="form-group">
            <label>Image</label>
            <ImagePicker value={form.image} onChange={v => setForm({ ...form, image: v })} />
          </div>
          <div className="form-group">
            <label>Alt Text</label>
            <input className="form-control" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input className="form-control" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead>
              <tr><th style={{ width: 40 }}></th><th>Preview</th><th>Caption</th><th>Alt</th><th></th></tr>
            </thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button className="btn--icon" onClick={() => moveItem(i, i - 1)} disabled={i === 0} style={{ fontSize: '0.7rem' }}>&#9650;</button>
                      <button className="btn--icon" onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1} style={{ fontSize: '0.7rem' }}>&#9660;</button>
                    </div>
                  </td>
                  <td>
                    <img src={item.image} alt={item.alt} className="img-thumb"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{item.caption}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.alt}</td>
                  <td className="actions">
                    <button className="btn--icon" onClick={() => openEdit(i, item)}><Pencil size={16} /></button>
                    <button className="btn--icon" onClick={() => setDeleting(i)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleting !== null && (
        <ConfirmDialog message="Delete this gallery item?" onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />
      )}
    </Shell>
  );
}
