import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  topic: string;
  summary: string;
  image?: string;
  pdf?: string;
}

const EMPTY: Publication = {
  title: '', authors: '', venue: '', year: new Date().getFullYear(),
  doi: '', topic: 'haptics', summary: '', image: '', pdf: '',
};

export function PublicationsPage() {
  const { data: pubs, reload } = useData<Publication[]>('/publications');
  const [editing, setEditing] = useState<{ index: number; pub: Publication } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Publication>(EMPTY);
  const [filter, setFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<number | null>(null);

  const filtered = pubs?.filter(p => filter === 'all' || p.topic === filter) || [];

  const openCreate = () => {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (index: number, pub: Publication) => {
    setForm({ ...pub });
    setEditing({ index, pub });
    setCreating(false);
  };

  const save = async () => {
    try {
      if (creating) {
        await api.post('/publications', form);
        showToast('Publication created');
      } else if (editing) {
        await api.put(`/publications/${editing.index}`, form);
        showToast('Publication updated');
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
      await api.del(`/publications/${deleting}`);
      showToast('Publication deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const updateField = (field: keyof Publication, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Publications"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Publication' : 'Edit Publication'}</h2>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" value={form.title} onChange={e => updateField('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Authors</label>
            <input className="form-control" value={form.authors} onChange={e => updateField('authors', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Venue</label>
              <input className="form-control" value={form.venue} onChange={e => updateField('venue', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input className="form-control" type="number" value={form.year} onChange={e => updateField('year', parseInt(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>DOI</label>
              <input className="form-control" value={form.doi} onChange={e => updateField('doi', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Topic</label>
              <select className="form-control" value={form.topic} onChange={e => updateField('topic', e.target.value)}>
                <option value="haptics">Haptics</option>
                <option value="acoustics">Acoustics</option>
                <option value="perception">Perception</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Summary</label>
            <textarea className="form-control" value={form.summary} onChange={e => updateField('summary', e.target.value)} rows={4} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input className="form-control" value={form.image || ''} onChange={e => updateField('image', e.target.value)} />
            </div>
            <div className="form-group">
              <label>PDF path (optional)</label>
              <input className="form-control" value={form.pdf || ''} onChange={e => updateField('pdf', e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="filter-bar">
            {['all', 'haptics', 'acoustics', 'perception'].map(t => (
              <button
                key={t}
                className={`btn btn--sm ${filter === t ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setFilter(t)}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {filtered.length} publication{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="card card--flat">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Topic</th>
                  <th>DOI</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pub, i) => {
                  const realIndex = pubs!.indexOf(pub);
                  return (
                    <tr key={i}>
                      <td style={{ maxWidth: '400px' }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.15rem' }}>{pub.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pub.authors}</div>
                      </td>
                      <td>{pub.year}</td>
                      <td><span className={`badge badge--${pub.topic}`}>{pub.topic}</span></td>
                      <td>
                        {pub.doi && (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem' }}>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </td>
                      <td className="actions">
                        <button className="btn--icon" onClick={() => openEdit(realIndex, pub)}><Pencil size={16} /></button>
                        <button className="btn--icon" onClick={() => setDeleting(realIndex)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {deleting !== null && (
        <ConfirmDialog
          message="Delete this publication? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Shell>
  );
}
