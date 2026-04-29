interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm</h2>
        <p style={{ marginBottom: '1.5rem' }}>{message}</p>
        <div className="form-actions" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
          <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
          <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
