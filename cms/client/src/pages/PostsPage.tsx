import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';

interface Post {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    date: string;
    category: string;
  };
  content: string;
}

const EMPTY_FM = { title: '', excerpt: '', date: new Date().toISOString().split('T')[0], category: 'lab' };

export function PostsPage() {
  const { data: posts, reload } = useData<Post[]>('/posts');
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [fm, setFm] = useState<any>(EMPTY_FM);
  const [content, setContent] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const openCreate = () => {
    setFm({ ...EMPTY_FM });
    setContent('');
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Post) => {
    setFm({ ...p.frontmatter });
    setContent(p.content);
    setEditing(p);
    setCreating(false);
  };

  const save = async () => {
    try {
      const payload = { frontmatter: fm, content };
      if (creating) {
        await api.post('/posts', payload);
        showToast('Post created');
      } else if (editing) {
        await api.put(`/posts/${editing.slug}`, payload);
        showToast('Post updated');
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
      await api.del(`/posts/${deleting}`);
      showToast('Post deleted');
      setDeleting(null);
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const showForm = creating || editing;

  return (
    <Shell
      title="Posts"
      actions={!showForm && <button className="btn btn--primary" onClick={openCreate}><Plus size={16} /> New Post</button>}
    >
      {showForm ? (
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{creating ? 'New Post' : 'Edit Post'}</h2>
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" value={fm.title} onChange={e => setFm({ ...fm, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Excerpt</label>
            <input className="form-control" value={fm.excerpt} onChange={e => setFm({ ...fm, excerpt: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input className="form-control" type="date" value={fm.date} onChange={e => setFm({ ...fm, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input className="form-control" value={fm.category} onChange={e => setFm({ ...fm, category: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Content (Markdown)</label>
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
        <div className="card card--flat">
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Date</th><th>Category</th><th></th></tr>
            </thead>
            <tbody>
              {posts?.length === 0 && (
                <tr><td colSpan={4} className="empty-state">No posts yet</td></tr>
              )}
              {posts?.map(p => (
                <tr key={p.slug}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.frontmatter.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.frontmatter.excerpt}</div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.frontmatter.date}</td>
                  <td><span className="badge" style={{ background: 'var(--bg-alt)' }}>{p.frontmatter.category}</span></td>
                  <td className="actions">
                    <button className="btn--icon" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                    <button className="btn--icon" onClick={() => setDeleting(p.slug)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          message="Delete this post?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </Shell>
  );
}
