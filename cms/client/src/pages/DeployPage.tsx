import { useState, useEffect, useRef } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Rocket, GitCommit, Upload, RefreshCw } from 'lucide-react';

interface DeployStatus {
  status: {
    modified: string[];
    created: string[];
    deleted: string[];
    not_added: string[];
    staged: string[];
    isClean: boolean;
    current: string;
  };
  log: Array<{ hash: string; date: string; message: string }>;
}

export function DeployPage() {
  const { data, reload } = useData<DeployStatus>('/deploy/status');
  const [diff, setDiff] = useState('');
  const [commitMsg, setCommitMsg] = useState('');
  const [buildLog, setBuildLog] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [building, setBuilding] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // WebSocket for build logs
  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:3002');
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'build') {
        setBuildLog(prev => prev + msg.message);
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    };
    return () => ws.close();
  }, []);

  const loadDiff = async () => {
    const { diff } = await api.get<{ diff: string }>('/deploy/diff');
    setDiff(diff);
  };

  const handleBuild = async () => {
    setBuilding(true);
    setBuildLog('');
    try {
      const result = await api.post<{ success: boolean }>('/deploy/build', {});
      showToast(result.success ? 'Build successful' : 'Build failed', result.success ? 'success' : 'error');
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setBuilding(false);
      reload();
    }
  };

  const handleCommit = async () => {
    if (!commitMsg.trim()) { showToast('Enter a commit message', 'error'); return; }
    try {
      await api.post('/deploy/commit', { message: commitMsg });
      showToast('Changes committed');
      setCommitMsg('');
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const handlePush = async () => {
    try {
      await api.post('/deploy/push', {});
      showToast('Pushed to remote');
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    }
  };

  const handleDeploy = async () => {
    if (!commitMsg.trim()) { showToast('Enter a commit message', 'error'); return; }
    setDeploying(true);
    setBuildLog('');
    try {
      await api.post('/deploy/deploy', { message: commitMsg });
      showToast('Deployed successfully!');
      setCommitMsg('');
      reload();
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setDeploying(false);
    }
  };

  const status = data?.status;
  const allChanges = [
    ...(status?.modified || []),
    ...(status?.created || []),
    ...(status?.deleted || []),
    ...(status?.not_added || []),
  ];

  return (
    <Shell title="Deploy" actions={
      <button className="btn btn--secondary btn--sm" onClick={reload}><RefreshCw size={14} /> Refresh</button>
    }>
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Current Branch</h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{status?.current || '...'}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: status?.isClean ? 'var(--success)' : 'var(--accent)' }}>
            {status?.isClean ? 'Working tree clean' : `${allChanges.length} changed file(s)`}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Recent Commits</h3>
          {data?.log?.slice(0, 3).map((c: any) => (
            <div key={c.hash} style={{ fontSize: '0.8rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.hash?.slice(0, 7)}</span>{' '}
              {c.message}
            </div>
          ))}
        </div>
      </div>

      {allChanges.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3>Changed Files</h3>
            <button className="btn btn--secondary btn--sm" onClick={loadDiff}>Show Diff</button>
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            {status?.modified?.map(f => <div key={f} style={{ color: '#c96800' }}>M {f}</div>)}
            {status?.created?.map(f => <div key={f} style={{ color: 'var(--success)' }}>A {f}</div>)}
            {status?.not_added?.map(f => <div key={f} style={{ color: 'var(--success)' }}>? {f}</div>)}
            {status?.deleted?.map(f => <div key={f} style={{ color: 'var(--danger)' }}>D {f}</div>)}
          </div>
          {diff && <div className="diff-view" style={{ marginTop: '1rem' }}>{diff}</div>}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Commit & Deploy</h3>
        <div className="form-group">
          <label>Commit Message</label>
          <input
            className="form-control"
            value={commitMsg}
            onChange={e => setCommitMsg(e.target.value)}
            placeholder="e.g. Update publications and team bios"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn--secondary" onClick={handleBuild} disabled={building}>
            <RefreshCw size={16} /> {building ? 'Building...' : 'Build Only'}
          </button>
          <button className="btn btn--secondary" onClick={handleCommit} disabled={!commitMsg.trim() || status?.isClean}>
            <GitCommit size={16} /> Commit
          </button>
          <button className="btn btn--secondary" onClick={handlePush}>
            <Upload size={16} /> Push
          </button>
          <button className="btn btn--primary" onClick={handleDeploy} disabled={deploying || !commitMsg.trim()}>
            <Rocket size={16} /> {deploying ? 'Deploying...' : 'Build + Commit + Push'}
          </button>
        </div>
      </div>

      {buildLog && (
        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Build Log</h3>
          <div className="build-log" ref={logRef}>{buildLog}</div>
        </div>
      )}
    </Shell>
  );
}
