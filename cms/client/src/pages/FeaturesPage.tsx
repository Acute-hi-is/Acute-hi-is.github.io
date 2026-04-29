import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface FeatureItem {
  label: string;
  title: string;
  image: string;
  image_alt: string;
  text: string;
  meta: string;
  doi: string;
  reverse: boolean;
}

const EMPTY: FeatureItem = {
  label: '', title: '', image: '', image_alt: '', text: '', meta: '', doi: '', reverse: false,
};

export function FeaturesPage() {
  const { data: items, reload } = useData<FeatureItem[]>('/features');
  const [editing, setEditing] = useState<{ index: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FeatureItem>(EMPTY);
  const [deleting, setDeleting] = useState<number | null>(null);

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); };
  const openEdit = (i: number, item: FeatureItem) => { setForm({ ...item }); setEditing({ index: i }); setCreating(false); };

  const save = async () => {
    try {
      if (creating) {
        await api.post('/features', form);
        showToast('Feature added');
      } else if (editing) {
        await api.put(`/features/${editing.index}`, form);
        showToast('Feature updated');
      }
      setCreating(false); setEditing(null); reload();
    } catch (e) { showToast((e as Error).message, 'error'); }
  };

  const confirmDelete = async () => {
    if (deleting === null) return;
    await api.del(`/features/${deleting}`);
    showToast('Feature deleted');
    setDeleting(null); reload();
  };

  const moveItem = async (from: number, to: number) => {
    if (!items || to < 0 || to >= items.length) return;
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    await api.put('/features/reorder', arr);
    reload();
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Featured Research"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Feature</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Feature' : 'Edit Feature'}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Label</label>
              <input className="form-control" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Haptic interfaces" />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Image</label>
            <ImagePicker value={form.image} onChange={v => setForm({ ...form, image: v })} />
          </div>
          <div className="form-group">
            <label>Image Alt</label>
            <input className="form-control" value={form.image_alt} onChange={e => setForm({ ...form, image_alt: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Text</label>
            <textarea className="form-control" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={4} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Meta</label>
              <input className="form-control" value={form.meta} onChange={e => setForm({ ...form, meta: e.target.value })} placeholder="Author et al. · Journal 2024" />
            </div>
            <div className="form-group">
              <label>DOI</label>
              <input className="form-control" value={form.doi} onChange={e => setForm({ ...form, doi: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.reverse} onChange={e => setForm({ ...form, reverse: e.target.checked })} />
              Reverse layout (image on right)
            </label>
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead><tr><th style={{ width: 40 }}></th><th>Label</th><th>Title</th><th>Layout</th><th></th></tr></thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button className="btn--icon" onClick={() => moveItem(i, i - 1)} disabled={i === 0} style={{ fontSize: '0.7rem' }}>&#9650;</button>
                      <button className="btn--icon" onClick={() => moveItem(i, i + 1)} disabled={i === (items?.length || 0) - 1} style={{ fontSize: '0.7rem' }}>&#9660;</button>
                    </div>
                  </td>
                  <td><span className="badge badge--haptics">{item.label}</span></td>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.reverse ? 'Reversed' : 'Normal'}</td>
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
      {deleting !== null && <ConfirmDialog message="Delete this feature?" onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </Shell>
  );
}
