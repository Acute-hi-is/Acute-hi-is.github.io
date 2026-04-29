import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface TeamMember {
  slug: string;
  frontmatter: {
    title: string;
    role: string;
    photo: string;
    email?: string;
    profile?: string;
    status: string;
    order: number;
  };
  content: string;
}

const EMPTY_FM = {
  title: '', role: '', photo: '', email: '', profile: '',
  status: 'current', order: 10,
};

export function TeamPage() {
  const { data: members, reload } = useData<TeamMember[]>('/team');
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [creating, setCreating] = useState(false);
  const [fm, setFm] = useState<any>(EMPTY_FM);
  const [content, setContent] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const current = members?.filter(m => m.frontmatter.status === 'current') || [];
  const past = members?.filter(m => m.frontmatter.status !== 'current') || [];

  const openCreate = () => {
    setFm({ ...EMPTY_FM });
    setContent('');
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (m: TeamMember) => {
    setFm({ ...m.frontmatter });
    setContent(m.content);
    setEditing(m);
    setCreating(false);
  };

  const save = async () => {
    try {
      const { layout, ...cleanFm } = fm;
      const payload = { frontmatter: cleanFm, content };
      if (creating) {
        await api.post('/team', payload);
        showToast('Member created');
      } else if (editing) {
        await api.put(`/team/${editing.slug}`, payload);
        showToast('Member updated');
      }
      setCreating(false);
      setEditing(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await api.del(`/team/${deleting}`);
      showToast('Member deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const updateFm = (field: string, value: any) => {
    setFm((prev: any) => ({ ...prev, [field]: value }));
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Team"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> Add Member</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Member' : `Edit: ${fm.title}`}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={fm.title} onChange={e => updateFm('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input className="form-control" value={fm.role} onChange={e => updateFm('role', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Photo</label>
            <ImagePicker value={fm.photo} onChange={v => updateFm('photo', v)} dir="team" preset="team" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" value={fm.email || ''} onChange={e => updateFm('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Profile URL</label>
              <input className="form-control" value={fm.profile || ''} onChange={e => updateFm('profile', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={fm.status} onChange={e => updateFm('status', e.target.value)}>
                <option value="current">Current</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input className="form-control" type="number" value={fm.order} onChange={e => updateFm('order', parseInt(e.target.value))} />
            </div>
          </div>
          <div className="form-group">
            <label>Bio (Markdown)</label>
            <textarea
              className="form-control"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={12}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>Save</button>
            <button className="btn btn--secondary" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ marginBottom: '0.75rem' }}>Current Members ({current.length})</h3>
          <div className="card card--flat" style={{ marginBottom: '2rem' }}>
            <table className="data-table">
              <thead>
                <tr><th>Photo</th><th>Name</th><th>Role</th><th>Order</th><th></th></tr>
              </thead>
              <tbody>
                {current.map(m => (
                  <tr key={m.slug}>
                    <td>
                      {m.frontmatter.photo && (
                        <img src={m.frontmatter.photo} alt="" className="img-thumb" style={{ width: 40, height: 40, borderRadius: '50%' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{m.frontmatter.title}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.frontmatter.role}</td>
                    <td>{m.frontmatter.order}</td>
                    <td className="actions">
                      <button className="btn--icon" onClick={() => openEdit(m)}><Pencil size={16} /></button>
                      <button className="btn--icon" onClick={() => setDeleting(m.slug)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {past.length > 0 && (
            <>
              <h3 style={{ marginBottom: '0.75rem' }}>Past Members ({past.length})</h3>
              <div className="card card--flat">
                <table className="data-table">
                  <thead>
                    <tr><th>Name</th><th>Role</th><th></th></tr>
                  </thead>
                  <tbody>
                    {past.map(m => (
                      <tr key={m.slug}>
                        <td style={{ fontWeight: 500 }}>{m.frontmatter.title}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.frontmatter.role}</td>
                        <td className="actions">
                          <button className="btn--icon" onClick={() => openEdit(m)}><Pencil size={16} /></button>
                          <button className="btn--icon" onClick={() => setDeleting(m.slug)}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {deleting && (
        <ConfirmDialog
          message="Delete this team member? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Shell>
  );
}
