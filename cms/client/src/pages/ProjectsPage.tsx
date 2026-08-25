import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Film } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ImagePicker } from '../components/shared/ImagePicker';

interface ProjectPub { text: string; venue?: string; doi: string; }
interface GalleryItem {
  type: 'photo' | 'video';
  image?: string;
  video_url?: string;
  alt?: string;
  caption?: string;
}
interface ProjectFM {
  title: string;
  status: 'active' | 'completed' | 'emerging';
  tags: string[];
  order: number;
  team?: string;
  partners?: string;
  funding?: string;
  pubs?: ProjectPub[];
  gallery_enabled?: boolean;
  gallery?: GalleryItem[];
}
interface Project {
  slug: string;
  frontmatter: ProjectFM;
  content: string;
}

const EMPTY_FM: ProjectFM = {
  title: '',
  status: 'active',
  tags: [],
  order: 100,
  team: '',
  partners: '',
  funding: '',
  pubs: [],
  gallery_enabled: false,
  gallery: [],
};

export function ProjectsPage() {
  const { data: projects, reload } = useData<Project[]>('/projects');
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [fm, setFm] = useState<ProjectFM>(JSON.parse(JSON.stringify(EMPTY_FM)));
  const [content, setContent] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const openCreate = () => {
    setFm(JSON.parse(JSON.stringify(EMPTY_FM)));
    setContent('');
    setTagsInput('');
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Project) => {
    const safeFm: ProjectFM = {
      ...EMPTY_FM,
      ...p.frontmatter,
      tags: p.frontmatter.tags || [],
      pubs: p.frontmatter.pubs || [],
      gallery: p.frontmatter.gallery || [],
    };
    setFm(safeFm);
    setContent(p.content);
    setTagsInput((safeFm.tags || []).join(', '));
    setEditing(p);
    setCreating(false);
  };

  const update = <K extends keyof ProjectFM>(key: K, value: ProjectFM[K]) => {
    setFm((prev) => ({ ...prev, [key]: value }));
  };

  const commitTags = (raw: string) => {
    setTagsInput(raw);
    const list = raw.split(',').map((t) => t.trim()).filter(Boolean);
    update('tags', list);
  };

  const save = async () => {
    try {
      const { ...cleanFm } = fm as ProjectFM & { layout?: string };
      delete (cleanFm as { layout?: string }).layout;
      // Publications are managed in the Publications editor now; don't write a per-project pubs list.
      delete (cleanFm as { pubs?: unknown }).pubs;
      const payload = { frontmatter: cleanFm, content };
      if (creating) {
        await api.post('/projects', payload);
        showToast('Project created');
      } else if (editing) {
        await api.put(`/projects/${editing.slug}`, payload);
        showToast('Project updated');
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
      await api.del(`/projects/${deleting}`);
      showToast('Project deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };


  /* ── Gallery ── */
  const addGalleryItem = (type: 'photo' | 'video') => {
    const base: GalleryItem =
      type === 'photo'
        ? { type: 'photo', image: '', alt: '', caption: '' }
        : { type: 'video', video_url: '', caption: '' };
    update('gallery', [...(fm.gallery || []), base]);
  };
  const removeGalleryItem = (i: number) =>
    update('gallery', (fm.gallery || []).filter((_, j) => j !== i));
  const updateGalleryItem = (i: number, patch: Partial<GalleryItem>) => {
    const next = [...(fm.gallery || [])];
    next[i] = { ...next[i], ...patch };
    update('gallery', next);
  };
  const moveGalleryItem = (i: number, dir: -1 | 1) => {
    const list = [...(fm.gallery || [])];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    update('gallery', list);
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Projects"
      actions={
        !showForm && (
          <button className="btn btn--primary" onClick={openCreate}>
            <Plus size={16} /> Add Project
          </button>
        )
      }
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>
            {creating ? 'New Project' : `Edit: ${fm.title}`}
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-control"
                value={fm.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={fm.status}
                onChange={(e) =>
                  update('status', e.target.value as ProjectFM['status'])
                }
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="emerging">Emerging</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                className="form-control"
                value={tagsInput}
                onChange={(e) => commitTags(e.target.value)}
                placeholder="Haptics, Wearables"
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
            <label>Team</label>
            <input
              className="form-control"
              value={fm.team || ''}
              onChange={(e) => update('team', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Partners</label>
              <input
                className="form-control"
                value={fm.partners || ''}
                onChange={(e) => update('partners', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Funding</label>
              <input
                className="form-control"
                value={fm.funding || ''}
                onChange={(e) => update('funding', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description (Markdown — body content)</label>
            <textarea
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
          </div>

          <div className="form-group">
            <label>Key Publications</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Publications are managed in the <strong>Publications</strong> section. Open a paper there and tick this project under <strong>Projects</strong> — it will then appear under "Key publications" on this project's page automatically.
            </p>
          </div>

          <div
            className="form-group"
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
              }}
            >
              <input
                type="checkbox"
                checked={!!fm.gallery_enabled}
                onChange={(e) => update('gallery_enabled', e.target.checked)}
              />
              <span>Show photo &amp; video gallery on this project page</span>
            </label>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '0.4rem',
              }}
            >
              When enabled, the gallery section appears at the bottom of the project page. Uploaded photos receive the ACUTE watermark automatically.
            </p>
          </div>

          {fm.gallery_enabled && (
            <div className="form-group">
              <label>Gallery Items</label>
              {(fm.gallery || []).map((g, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    background: 'var(--bg-alt, #fafafa)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                      }}
                    >
                      #{i + 1}
                    </span>
                    {g.type === 'video' ? (
                      <Film size={14} />
                    ) : (
                      <ImageIcon size={14} />
                    )}
                    <strong style={{ fontSize: '0.85rem' }}>
                      {g.type === 'video' ? 'Video' : 'Photo'}
                    </strong>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                      <button
                        className="btn--icon"
                        onClick={() => moveGalleryItem(i, -1)}
                        disabled={i === 0}
                        style={{ fontSize: '0.7rem' }}
                      >
                        ▲
                      </button>
                      <button
                        className="btn--icon"
                        onClick={() => moveGalleryItem(i, 1)}
                        disabled={i === (fm.gallery || []).length - 1}
                        style={{ fontSize: '0.7rem' }}
                      >
                        ▼
                      </button>
                      <button
                        className="btn--icon"
                        onClick={() => removeGalleryItem(i)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {g.type === 'photo' ? (
                    <>
                      <div className="form-group">
                        <label>Image</label>
                        <ImagePicker
                          value={g.image || ''}
                          onChange={(v) => updateGalleryItem(i, { image: v })}
                          dir="projects"
                          preset="project"
                          allowWatermarkToggle
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Alt text</label>
                          <input
                            className="form-control"
                            value={g.alt || ''}
                            onChange={(e) =>
                              updateGalleryItem(i, { alt: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Caption</label>
                          <input
                            className="form-control"
                            value={g.caption || ''}
                            onChange={(e) =>
                              updateGalleryItem(i, { caption: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Video embed URL (YouTube or Vimeo embed link)</label>
                        <input
                          className="form-control"
                          value={g.video_url || ''}
                          onChange={(e) =>
                            updateGalleryItem(i, { video_url: e.target.value })
                          }
                          placeholder="https://www.youtube.com/embed/XYZ"
                        />
                      </div>
                      <div className="form-group">
                        <label>Caption</label>
                        <input
                          className="form-control"
                          value={g.caption || ''}
                          onChange={(e) =>
                            updateGalleryItem(i, { caption: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => addGalleryItem('photo')}
                >
                  <Plus size={14} /> Add Photo
                </button>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => addGalleryItem('video')}
                >
                  <Plus size={14} /> Add Video
                </button>
              </div>
            </div>
          )}

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
                <th>Title</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Gallery</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((p, i) => (
                <tr key={p.slug}>
                  <td
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.frontmatter.title}</td>
                  <td
                    style={{
                      fontSize: '0.8rem',
                      textTransform: 'capitalize',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {p.frontmatter.status}
                  </td>
                  <td
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  >
                    {(p.frontmatter.tags || []).join(', ')}
                  </td>
                  <td
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  >
                    {p.frontmatter.gallery_enabled
                      ? `On (${(p.frontmatter.gallery || []).length})`
                      : 'Off'}
                  </td>
                  <td className="actions">
                    <button className="btn--icon" onClick={() => openEdit(p)}>
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn--icon"
                      onClick={() => setDeleting(p.slug)}
                    >
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
          message="Delete this project? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Shell>
  );
}
