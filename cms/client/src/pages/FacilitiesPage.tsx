import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface FacilityFM {
  title: string;
  tag: string;
  summary: string;
  image?: string;
  link?: string;
  order: number;
}
interface Facility {
  slug: string;
  frontmatter: FacilityFM;
  content: string;
}

const EMPTY_FM: FacilityFM = {
  title: '',
  tag: '',
  summary: '',
  image: '',
  link: '',
  order: 100,
};

export function FacilitiesPage() {
  const { data: facilities, reload } = useData<Facility[]>('/facilities');
  const [editing, setEditing] = useState<Facility | null>(null);
  const [creating, setCreating] = useState(false);
  const [fm, setFm] = useState<FacilityFM>({ ...EMPTY_FM });
  const [content, setContent] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const openCreate = () => {
    setFm({ ...EMPTY_FM });
    setContent('');
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (f: Facility) => {
    setFm({ ...EMPTY_FM, ...f.frontmatter });
    setContent(f.content);
    setEditing(f);
    setCreating(false);
  };

  const update = <K extends keyof FacilityFM>(key: K, value: FacilityFM[K]) => {
    setFm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    try {
      const cleanFm = { ...fm } as FacilityFM & { layout?: string };
      delete cleanFm.layout;
      const payload = { frontmatter: cleanFm, content };
      if (creating) {
        await api.post('/facilities', payload);
        showToast('Facility created');
      } else if (editing) {
        await api.put(`/facilities/${editing.slug}`, payload);
        showToast('Facility updated');
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
      await api.del(`/facilities/${deleting}`);
      showToast('Facility deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Facilities"
      actions={
        !showForm && (
          <button className="btn btn--primary" onClick={openCreate}>
            <Plus size={16} /> Add Facility
          </button>
        )
      }
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>
            {creating ? 'New Facility' : `Edit: ${fm.title}`}
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                value={fm.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Anechoic chamber"
              />
            </div>
            <div className="form-group">
              <label>Tag (short category)</label>
              <input
                className="form-control"
                value={fm.tag}
                onChange={(e) => update('tag', e.target.value)}
                placeholder="Acoustics"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Summary (one or two sentences — shown on cards &amp; listing)</label>
            <textarea
              className="form-control"
              value={fm.summary}
              onChange={(e) => update('summary', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <ImagePicker
              value={fm.image || ''}
              onChange={(v) => update('image', v)}
              dir="facilities"
              preset="default"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>External link (optional — e.g. manufacturer page)</label>
              <input
                className="form-control"
                value={fm.link || ''}
                onChange={(e) => update('link', e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                className="form-control"
                type="number"
                value={fm.order}
                onChange={(e) => update('order', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Details (Markdown — full text on the facility's own page)</label>
            <textarea
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
          </div>

          <div className="form-actions">
            <button className="btn btn--primary" onClick={save}>
              Save
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card card--flat">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Tag</th>
                <th>Photo</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {facilities?.map((f, i) => (
                <tr key={f.slug}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{f.frontmatter.title}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {f.frontmatter.tag}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {f.frontmatter.image ? 'Yes' : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {f.frontmatter.order}
                  </td>
                  <td className="actions">
                    <button className="btn--icon" onClick={() => openEdit(f)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn--icon" onClick={() => setDeleting(f.slug)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          message="Delete this facility? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Shell>
  );
}
