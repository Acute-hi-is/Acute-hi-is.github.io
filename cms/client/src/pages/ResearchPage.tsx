import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface ResearchPub { text: string; doi: string; }
interface ResearchArea {
  title: string; slug: string; image: string; image_alt: string;
  highlight_image: string; summary: string; description: string[];
  pubs: ResearchPub[];
}

const EMPTY: ResearchArea = {
  title: '', slug: '', image: '', image_alt: '', highlight_image: '',
  summary: '', description: [''], pubs: [{ text: '', doi: '' }],
};

export function ResearchPage() {
  const { data: items, reload } = useData<ResearchArea[]>('/research');
  const [editing, setEditing] = useState<{ index: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ResearchArea>(EMPTY);
  const [deleting, setDeleting] = useState<number | null>(null);

  const openCreate = () => { setForm(JSON.parse(JSON.stringify(EMPTY))); setCreating(true); setEditing(null); };
  const openEdit = (i: number, item: ResearchArea) => { setForm(JSON.parse(JSON.stringify(item))); setEditing({ index: i }); setCreating(false); };

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const save = async () => {
    try {
      if (!form.slug) form.slug = slugify(form.title);
      if (creating) {
        await api.post('/research', form);
        showToast('Research area added');
      } else if (editing) {
        await api.put(`/research/${editing.index}`, form);
        showToast('Research area updated');
      }
      setCreating(false); setEditing(null); reload();
    } catch (e) { showToast((e as Error).message, 'error'); }
  };

  const confirmDelete = async () => {
    if (deleting === null) return;
    await api.del(`/research/${deleting}`);
    showToast('Research area deleted');
    setDeleting(null); reload();
  };

  const addDesc = () => setForm({ ...form, description: [...form.description, ''] });
  const removeDesc = (i: number) => setForm({ ...form, description: form.description.filter((_, j) => j !== i) });
  const updateDesc = (i: number, v: string) => {
    const d = [...form.description]; d[i] = v;
    setForm({ ...form, description: d });
  };

  const addPub = () => setForm({ ...form, pubs: [...form.pubs, { text: '', doi: '' }] });
  const removePub = (i: number) => setForm({ ...form, pubs: form.pubs.filter((_, j) => j !== i) });
  const updatePub = (i: number, field: keyof ResearchPub, v: string) => {
    const p = [...form.pubs]; p[i] = { ...p[i], [field]: v };
    setForm({ ...form, pubs: p });
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Research Areas"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Area</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Research Area' : 'Edit Research Area'}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input className="form-control" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            </div>
          </div>
          <div className="form-group">
            <label>Summary</label>
            <input className="form-control" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image</label>
              <ImagePicker value={form.image} onChange={v => setForm({ ...form, image: v })} />
            </div>
            <div className="form-group">
              <label>Highlight Image</label>
              <ImagePicker value={form.highlight_image} onChange={v => setForm({ ...form, highlight_image: v })} />
            </div>
          </div>
          <div className="form-group">
            <label>Image Alt</label>
            <input className="form-control" value={form.image_alt} onChange={e => setForm({ ...form, image_alt: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Description Paragraphs</label>
            {form.description.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <textarea className="form-control" value={d} onChange={e => updateDesc(i, e.target.value)} rows={3} style={{ flex: 1 }} />
                <button className="btn--icon" onClick={() => removeDesc(i)}><X size={16} /></button>
              </div>
            ))}
            <button className="btn btn--secondary btn--sm" onClick={addDesc}><Plus size={14} /> Add Paragraph</button>
          </div>

          <div className="form-group">
            <label>Key Publications</label>
            {form.pubs.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input className="form-control" value={p.text} onChange={e => updatePub(i, 'text', e.target.value)} placeholder="Citation text (HTML ok)" style={{ flex: 2 }} />
                <input className="form-control" value={p.doi} onChange={e => updatePub(i, 'doi', e.target.value)} placeholder="DOI" style={{ flex: 1 }} />
                <button className="btn--icon" onClick={() => removePub(i)}><X size={16} /></button>
              </div>
            ))}
            <button className="btn btn--secondary btn--sm" onClick={addPub}><Plus size={14} /> Add Publication</button>
          </div>

          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead><tr><th>#</th><th>Title</th><th>Summary</th><th>Pubs</th><th></th></tr></thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 300 }}>{item.summary}</td>
                  <td>{item.pubs.length}</td>
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
      {deleting !== null && <ConfirmDialog message="Delete this research area?" onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </Shell>
  );
}
