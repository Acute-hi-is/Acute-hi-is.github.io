import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';

interface StatItem {
  number: string;
  label: string;
  link?: string;
}

const EMPTY: StatItem = { number: '', label: '', link: '' };

export function StatsPage() {
  const { data: items, reload } = useData<StatItem[]>('/stats');
  const [editing, setEditing] = useState<{ index: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<StatItem>(EMPTY);
  const [deleting, setDeleting] = useState<number | null>(null);

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); };
  const openEdit = (i: number, item: StatItem) => { setForm({ ...item }); setEditing({ index: i }); setCreating(false); };

  const save = async () => {
    try {
      const cleanForm = { ...form };
      if (!cleanForm.link) delete cleanForm.link;
      if (creating) {
        await api.post('/stats', cleanForm);
        showToast('Stat added');
      } else if (editing) {
        await api.put(`/stats/${editing.index}`, cleanForm);
        showToast('Stat updated');
      }
      setCreating(false); setEditing(null); reload();
    } catch (e) { showToast((e as Error).message, 'error'); }
  };

  const confirmDelete = async () => {
    if (deleting === null) return;
    await api.del(`/stats/${deleting}`);
    showToast('Stat deleted');
    setDeleting(null); reload();
  };

  const moveItem = async (from: number, to: number) => {
    if (!items || to < 0 || to >= items.length) return;
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    await api.put('/stats/reorder', arr);
    reload();
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Stats Ticker"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Stat</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Stat' : 'Edit Stat'}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Number</label>
              <input className="form-control" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder='e.g. "93%"' />
            </div>
            <div className="form-group">
              <label>Link (optional)</label>
              <input className="form-control" value={form.link || ''} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://doi.org/..." />
            </div>
          </div>
          <div className="form-group">
            <label>Label</label>
            <input className="form-control" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead><tr><th style={{ width: 40 }}></th><th>Number</th><th>Label</th><th></th></tr></thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button className="btn--icon" onClick={() => moveItem(i, i - 1)} disabled={i === 0} style={{ fontSize: '0.7rem' }}>&#9650;</button>
                      <button className="btn--icon" onClick={() => moveItem(i, i + 1)} disabled={i === (items?.length || 0) - 1} style={{ fontSize: '0.7rem' }}>&#9660;</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{item.number}</td>
                  <td>{item.label}</td>
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
      {deleting !== null && <ConfirmDialog message="Delete this stat?" onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </Shell>
  );
}
