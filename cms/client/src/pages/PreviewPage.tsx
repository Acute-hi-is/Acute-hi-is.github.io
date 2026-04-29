import { useState } from 'react';
import { Shell } from '../components/layout/Shell';
import { useData, showToast } from '../api/hooks';
import { api } from '../api/client';
import { Play, Square, Monitor, Tablet, Smartphone } from 'lucide-react';

const WIDTHS = [
  { label: 'Desktop', icon: Monitor, width: '100%' },
  { label: 'Tablet', icon: Tablet, width: '768px' },
  { label: 'Mobile', icon: Smartphone, width: '375px' },
];

export function PreviewPage() {
  const { data: status, reload } = useData<{ running: boolean }>('/deploy/preview/status');
  const [width, setWidth] = useState('100%');
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      if (status?.running) {
        await api.post('/deploy/preview/stop', {});
        showToast('Preview stopped');
      } else {
        await api.post('/deploy/preview/start', {});
        showToast('Preview starting...');
      }
      setTimeout(reload, 1000);
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell
      title="Preview"
      actions={
        <>
          <div className="filter-bar" style={{ margin: 0 }}>
            {WIDTHS.map(w => (
              <button
                key={w.label}
                className={`btn btn--sm ${width === w.width ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setWidth(w.width)}
              >
                <w.icon size={14} /> {w.label}
              </button>
            ))}
          </div>
          <button className={`btn ${status?.running ? 'btn--danger' : 'btn--primary'}`} onClick={toggle} disabled={loading}>
            {status?.running ? <><Square size={16} /> Stop</> : <><Play size={16} /> Start</>}
          </button>
        </>
      }
    >
      {status?.running ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <iframe
            src="http://127.0.0.1:4001"
            style={{
              width,
              height: 'calc(100vh - 160px)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'white',
              transition: 'width 0.3s',
            }}
            title="Jekyll Preview"
          />
        </div>
      ) : (
        <div className="empty-state">
          <p>Preview server is not running.</p>
          <p>Click "Start" to launch Jekyll serve on port 4001.</p>
        </div>
      )}
    </Shell>
  );
}
