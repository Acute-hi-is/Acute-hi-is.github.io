import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../components/layout/Shell';
import { api } from '../api/client';
import { BookOpen, Users, FileText, FlaskConical, Rocket, Plus } from 'lucide-react';

interface Counts {
  publications: number;
  team: number;
  posts: number;
  research: number;
}

export function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({ publications: 0, team: 0, posts: 0, research: 0 });
  const [gitStatus, setGitStatus] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get<any[]>('/publications'),
      api.get<any[]>('/team'),
      api.get<any[]>('/posts'),
      api.get<any[]>('/research'),
      api.get<any>('/deploy/status').catch(() => null),
    ]).then(([pubs, team, posts, research, deploy]) => {
      setCounts({
        publications: pubs.length,
        team: team.length,
        posts: posts.length,
        research: research.length,
      });
      if (deploy) setGitStatus(deploy.status);
    });
  }, []);

  const hasChanges = gitStatus && !gitStatus.isClean;

  return (
    <Shell title="Dashboard">
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <Link to="/publications" className="card dash-stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <BookOpen size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
          <div className="dash-stat__number">{counts.publications}</div>
          <div className="dash-stat__label">Publications</div>
        </Link>
        <Link to="/team" className="card dash-stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Users size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
          <div className="dash-stat__number">{counts.team}</div>
          <div className="dash-stat__label">Team Members</div>
        </Link>
        <Link to="/posts" className="card dash-stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FileText size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
          <div className="dash-stat__number">{counts.posts}</div>
          <div className="dash-stat__label">Posts</div>
        </Link>
        <Link to="/research" className="card dash-stat" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FlaskConical size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
          <div className="dash-stat__number">{counts.research}</div>
          <div className="dash-stat__label">Research Areas</div>
        </Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/publications" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} /> New Publication
            </Link>
            <Link to="/team" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} /> New Team Member
            </Link>
            <Link to="/posts" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} /> New Post
            </Link>
            <Link to="/deploy" className="btn btn--primary" style={{ justifyContent: 'flex-start' }}>
              <Rocket size={16} /> Deploy
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Git Status</h3>
          {gitStatus ? (
            hasChanges ? (
              <div>
                <p style={{ color: 'var(--accent)', fontWeight: 500, marginBottom: '0.5rem' }}>
                  Uncommitted changes
                </p>
                {gitStatus.modified?.length > 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {gitStatus.modified.length} modified file(s)
                  </p>
                )}
                {gitStatus.not_added?.length > 0 && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {gitStatus.not_added.length} untracked file(s)
                  </p>
                )}
                <Link to="/deploy" className="btn btn--primary btn--sm" style={{ marginTop: '0.75rem' }}>
                  Review & Deploy
                </Link>
              </div>
            ) : (
              <p style={{ color: 'var(--success)' }}>Working tree clean</p>
            )
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          )}
        </div>
      </div>
    </Shell>
  );
}
