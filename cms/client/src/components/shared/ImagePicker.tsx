import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { api } from '../../api/client';
import { showToast } from '../../api/hooks';

interface Props {
  value: string;
  onChange: (path: string) => void;
  dir?: string;
  preset?: string;
}

export function ImagePicker({ value, onChange, dir = '', preset = 'default' }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.upload(file, dir, preset);
      onChange(result.path);
      showToast('Image uploaded');
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/..."
          />
        </div>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>
      {value && (
        <img
          src={`/api/images/preview?path=${encodeURIComponent(value)}`}
          alt=""
          className="img-thumb img-thumb--lg"
          style={{ marginTop: '0.5rem' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
    </div>
  );
}
