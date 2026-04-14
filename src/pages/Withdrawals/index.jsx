import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import adminService from '../../services/adminService';

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Withdrawals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const currentUser = useSelector((s) => s.auth.user?.fullName || 'Admin');
  const toast = useToast();

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getWalletRequests();
      const list = res?.data?.data || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id + action);
      await adminService.reviewWalletRequest(id, { status: action === 'approve' ? 'APPROVED' : 'REJECTED' });
      await fetchWithdrawals();
    } catch (err) {
      toast.error(err.message || `Failed to ${action} withdrawal`);
    } finally {
      setActionLoading(null);
    }
  };

  const pending = items.filter((i) => (i.status || '').toLowerCase() === 'pending').length;

  if (loading) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div><div className="page-title">Withdrawal Management</div></div>
        </div>
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading withdrawals…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div><div className="page-title">Withdrawal Management</div></div>
        </div>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ color: 'var(--crimson)', marginBottom: 12 }}>{error}</div>
          <button className="btn btn-primary btn-sm" onClick={fetchWithdrawals}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Withdrawal Management</div>
          <div className="page-sub">{pending} pending request{pending !== 1 ? 's' : ''} · {items.length} total</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>No withdrawal requests found.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th><th>Investor</th><th>Amount</th>
                  <th>Wallet Address</th><th>Requested</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => {
                  const id = w._id || w.id;
                  const name = w.user?.fullName || w.investor || w.fullName || '—';
                  const amount = w.amount ?? 0;
                  const wallet = w.walletAddress || w.wallet || '—';
                  const requested = w.createdAt || w.requestedAt || w.requested;
                  const status = w.status || 'Pending';
                  const statusLower = status.toLowerCase();
                  const reviewedBy = w.reviewedBy?.fullName || w.actionBy;
                  const reviewedAt = w.reviewedAt || w.actionAt;

                  return (
                    <tr key={id}>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{id?.slice?.(-8) || id}</td>
                      <td style={{ fontWeight: 500 }}>{name}</td>
                      <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>
                        ${typeof amount === 'number' ? amount.toLocaleString() : amount}
                      </td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)' }}>{wallet}</td>
                      <td className="td-muted">{fmtDate(requested)}</td>
                      <td>
                        <Badge status={status} />
                        {reviewedBy && (
                          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, whiteSpace: 'nowrap' }}>
                            By {reviewedBy} · {fmtDate(reviewedAt)}
                          </div>
                        )}
                      </td>
                      <td>
                        {statusLower === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-success btn-sm"
                              disabled={!!actionLoading}
                              onClick={() => handleAction(id, 'approve')}
                            >
                              {actionLoading === id + 'approve' ? '…' : <><Icon n="check" size={12} />Approve</>}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={!!actionLoading}
                              onClick={() => handleAction(id, 'reject')}
                            >
                              {actionLoading === id + 'reject' ? '…' : <><Icon n="x" size={12} />Reject</>}
                            </button>
                          </div>
                        )}
                        {statusLower !== 'pending' && <span className="td-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
