import { useState } from 'react';
import Modal from './Modal';
import Badge from './Badge';
import Icon from './Icon';

export default function KYCModal({ item, onClose, onAction, actionLoading }) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');

  const kycId = item.id || item._id;
  const rawStatus = item.status || item.kycStatus || 'PENDING';
  const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  const name = item.fullLegalName || item.user?.fullName || item.fullName || '—';
  const email = item.user?.email || item.email || '';
  const isPending = rawStatus.toUpperCase() === 'PENDING';

  const handleReject = () => {
    if (!reason.trim()) return;
    onAction(kycId, 'Rejected', reason.trim());
  };

  return (
    <Modal title="KYC Document Review" sub={`Reviewing identity for ${name}`} onClose={onClose}>
      <div className="kv">
        <div className="kv-item"><div className="kv-label">Full Name</div><div className="kv-value">{name}</div></div>
        {email && <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value">{email}</div></div>}
        {item.panNumber && <div className="kv-item"><div className="kv-label">PAN Number</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{item.panNumber}</div></div>}
        {item.aadhaarNumber && <div className="kv-item"><div className="kv-label">Aadhaar Number</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{item.aadhaarNumber}</div></div>}
        <div className="kv-item"><div className="kv-label">Status</div><div className="kv-value"><Badge status={status} /></div></div>
        {(item.submittedAt || item.createdAt) && (
          <div className="kv-item"><div className="kv-label">Submitted</div><div className="kv-value">{new Date(item.submittedAt || item.createdAt).toLocaleString()}</div></div>
        )}
        {item.reviewedAt && (
          <div className="kv-item"><div className="kv-label">Reviewed</div><div className="kv-value">{new Date(item.reviewedAt).toLocaleString()}</div></div>
        )}
        {item.rejectionReason && (
          <div className="kv-item"><div className="kv-label">Rejection Reason</div><div className="kv-value" style={{ color: '#ef4444' }}>{item.rejectionReason}</div></div>
        )}
      </div>

      {/* Document preview if available */}
      {(item.documentFrontUrl || item.documentBackUrl) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {item.documentFrontUrl && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 4 }}>Front</div>
              <img src={item.documentFrontUrl} alt="Document front" style={{ maxWidth: 220, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
          )}
          {item.documentBackUrl && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 4 }}>Back</div>
              <img src={item.documentBackUrl} alt="Document back" style={{ maxWidth: 220, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
            </div>
          )}
        </div>
      )}

      {isPending && !showReject && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-success" onClick={() => onAction(kycId, 'Approved')} disabled={!!actionLoading}>
            <Icon n="check" size={13} />{actionLoading === kycId ? 'Approving…' : 'Approve KYC'}
          </button>
          <button className="btn btn-danger" onClick={() => setShowReject(true)} disabled={!!actionLoading}>
            <Icon n="x" size={13} />Reject
          </button>
        </div>
      )}

      {isPending && showReject && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Rejection Reason</label>
          <textarea
            className="filter-input"
            style={{ width: '100%', minHeight: 70, resize: 'vertical' }}
            placeholder="Provide a reason for rejection…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-danger" onClick={handleReject} disabled={!reason.trim() || !!actionLoading}>
              <Icon n="x" size={13} />{actionLoading === kycId ? 'Rejecting…' : 'Confirm Reject'}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowReject(false)}>Cancel</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
