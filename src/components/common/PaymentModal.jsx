import Modal from './Modal';
import Icon from './Icon';

export default function PaymentModal({ item, onClose, onAction }) {
  return (
    <Modal title="Payment Verification" sub={`${item.investor} · ${item.method}`} onClose={onClose}>
      <div className="doc-preview">
        <Icon n="img" size={30} />
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Payment receipt / screenshot</span>
      </div>
      <div className="kv">
        <div className="kv-item">
          <div className="kv-label">Amount</div>
          <div className="kv-value" style={{ color: 'var(--emerald)' }}>${item.amount.toLocaleString()}</div>
        </div>
        <div className="kv-item"><div className="kv-label">Method</div><div className="kv-value">{item.method}</div></div>
        <div className="kv-item">
          <div className="kv-label">Reference</div>
          <div className="kv-value" style={{ fontSize: 11, fontFamily: 'DM Mono' }}>{item.ref}</div>
        </div>
        <div className="kv-item"><div className="kv-label">Date</div><div className="kv-value">{item.date}</div></div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-success" onClick={() => onAction(item.id, 'Completed')}>
          <Icon n="check" size={13} />Approve Payment
        </button>
        <button className="btn btn-danger" onClick={() => onAction(item.id, 'Rejected')}>
          <Icon n="x" size={13} />Reject
        </button>
      </div>
    </Modal>
  );
}
