import Modal from './Modal';
import Badge from './Badge';
import Icon from './Icon';

export default function KYCModal({ item, onClose, onAction }) {
  return (
    <Modal title="KYC Document Review" sub={`Reviewing identity for ${item.name}`} onClose={onClose}>
      <div className="doc-preview">
        <Icon n="img" size={30} />
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>{item.docType}</span>
        <span style={{ fontSize: 11, color: 'var(--text3)' }}>Submitted {item.submitted}</span>
      </div>
      <div className="kv">
        <div className="kv-item"><div className="kv-label">Full Name</div><div className="kv-value">{item.name}</div></div>
        <div className="kv-item"><div className="kv-label">Country</div><div className="kv-value">{item.country}</div></div>
        <div className="kv-item"><div className="kv-label">Document</div><div className="kv-value">{item.doc}</div></div>
        <div className="kv-item"><div className="kv-label">Status</div><div className="kv-value"><Badge status={item.status} /></div></div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-success" onClick={() => onAction(item.id, 'Approved')}>
          <Icon n="check" size={13} />Approve KYC
        </button>
        <button className="btn btn-danger" onClick={() => onAction(item.id, 'Rejected')}>
          <Icon n="x" size={13} />Reject
        </button>
        <button className="btn btn-ghost" onClick={() => onAction(item.id, 'Manual Review')}>
          <Icon n="info" size={13} />Request Info
        </button>
      </div>
    </Modal>
  );
}
