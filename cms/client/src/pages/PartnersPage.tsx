import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface Partner { name: string; url: string; logo: string; alt: string; }
interface PartnersData { research: Partner[]; industry: Partner[]; funders: Partner[]; }

const EMPTY: Partner = { name: '', url: '', logo: '', alt: '' };
const GROUPS = ['research', 'industry', 'funders'] as const;

export function PartnersPage() {
  const { data, reload } = useData<PartnersData>('/partners');
  const [tab, setTab] = useState<typeof GROUPS[number]>('research');
  const [editing, setEditing] = useState<{ group: string; index: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Partner>(EMPTY);
  const [deleting, setDeleting] = useState<{ group: string; index: number } | null>(null);

  const items = data ? data[tab] : [];

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); };
  const openEdit = (group: string, i: number, p: Partner) => {
    setForm({ ...p }); setEditing({ group, index: i }); setCreating(false);
  };

  const save = async () => {
    try {
      if (creating) {
        await api.post(`/partners/${tab}`, form);
        showToast('Partner added');
      } else if (editing) {
        await api.put(`/partners/${editing.group}/${editing.index}`, form);
        showToast('Partner updated');
      }
      setCreating(false); setEditing(null); reload();
    } catch (e) { showToast((e as Error).message, 'error'); }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await api.del(`/partners/${deleting.group}/${deleting.index}`);
    showToast('Partner deleted');
    setDeleting(null); reload();
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Partners & Funders"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add to {tab}</button>}
    >
      {!showForm && (
        <div className="tabs">
          {GROUPS.map(g => (
            <button key={g} className={`tab ${tab === g ? 'tab--active' : ''}`} onClick={() => setTab(g)}>
              {g.charAt(0).toUpperCase() + g.slice(1)} ({data ? data[g].length : 0})
            </button>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'Add Partner' : 'Edit Partner'}</h2>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input className="form-control" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Logo</label>
            <ImagePicker value={form.logo} onChange={v => setForm({ ...form, logo: v })} dir="partners" preset="partners" />
          </div>
          <div className="form-group">
            <label>Alt Text</label>
            <input className="form-control" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead><tr><th>Logo</th><th>Name</th><th>URL</th><th></th></tr></thead>
            <tbody>
              {items?.map((p, i) => (
                <tr key={i}>
                  <td>
                    <img src={p.logo} alt={p.alt} className="img-thumb" style={{ objectFit: 'contain', background: '#fff' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></td>
                  <td className="actions">
                    <button className="btn--icon" onClick={() => openEdit(tab, i, p)}><Pencil size={16} /></button>
                    <button className="btn--icon" onClick={() => setDeleting({ group: tab, index: i })}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleting && <ConfirmDialog message="Delete this partner?" onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </Shell>
  );
}
