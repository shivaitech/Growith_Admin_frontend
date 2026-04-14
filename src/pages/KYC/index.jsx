import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import adminService from '../../services/adminService';

const tabs = ['Pending', 'Approved', 'Rejected'];

const normalizeStatus = (s) => {
  if (!s) return 'Pending';
  const lower = s.toLowerCase();
  if (lower === 'approved') return 'Approved';
  if (lower === 'rejected') return 'Rejected';
  if (lower === 'manual_review' || lower === 'manual review') return 'Manual Review';
  if (lower === 'pending_approval' || lower === 'pending') return 'Pending';
  return 'Pending';
};

export default function KYC() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKyc = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getKycRequests();
      const list = res?.data?.requests || res?.data?.data || res?.data?.submissions || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKyc(); }, [fetchKyc]);

  // Normalize fields from real API
  const getStatus = (k) => normalizeStatus(k.status || k.kycStatus);
  const getName = (k) => k.fullLegalName || k.user?.fullName || k.fullName || '—';
  const getEmail = (k) => k.user?.email || k.email || '';

  const filtered = items.filter((i) => getStatus(i) === tab);

  // Count per tab
  const counts = {};
  tabs.forEach((t) => { counts[t] = items.filter((i) => getStatus(i) === t).length; });

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">KYC Management</div>
          <div className="page-sub">{items.length} total submission{items.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? 'var(--accent)' : 'var(--surface)',
              color: tab === t ? '#fff' : 'var(--text2)',
              border: '1px solid',
              borderColor: tab === t ? 'var(--accent)' : 'var(--border)',
              borderRadius: 'var(--radius)',
              padding: '8px 18px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            {t}
            <span style={{ background: tab === t ? 'rgba(255,255,255,0.2)' : 'var(--surface2)', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
              {counts[t]}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: 14, borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
          {error}
          <button style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }} onClick={fetchKyc}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="empty-state"><div className="empty-title">Loading KYC submissions…</div></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">No {tab.toLowerCase()} KYC submissions</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>All caught up!</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th><th>Document Type</th>
                  <th>Submitted</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id || k._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={getName(k)} gradient="linear-gradient(135deg,#1a56db,#0ea5e9)" />
                        <div>
                          <div style={{ fontWeight: 500 }}>{getName(k)}</div>
                          <div className="td-muted">{getEmail(k)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">
                          {k.panNumber ? 'PAN' : k.aadhaarNumber ? 'Aadhaar' : '—'}
                          {(k.panNumber || k.aadhaarNumber) && (
                            <div style={{ fontSize: 11, fontFamily: 'DM Mono', color: 'var(--text3)' }}>{k.panNumber || k.aadhaarNumber}</div>
                          )}
                        </td>
                    <td className="td-muted">{(k.submittedAt || k.createdAt) ? new Date(k.submittedAt || k.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <Badge status={getStatus(k)} />
                      {k.reviewedBy && (
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, whiteSpace: 'nowrap' }}>
                          By {k.reviewedBy}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/kyc/${k.id || k._id}`)}>
                          <Icon n="eye" size={12} />Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
