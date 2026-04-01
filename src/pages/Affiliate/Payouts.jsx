import { useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import { affiliatePayouts } from '../../data/mockData';

const fmtNow = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export default function AffiliatePayouts() {
  const [payouts, setPayouts] = useState(affiliatePayouts);
  const [tab, setTab] = useState('All');
  const currentUser = useSelector((s) => s.auth.user?.name || 'Admin');

  const pending = payouts.filter((p) => p.status === 'Pending');
  const approved = payouts.filter((p) => p.status === 'Approved');
  const pendingAmount = pending.reduce((a, p) => a + p.amount, 0);
  const approvedAmount = approved.reduce((a, p) => a + p.amount, 0);

  const filtered = tab === 'All' ? payouts : payouts.filter((p) => p.status === tab);

  const approve = (id) => setPayouts(payouts.map((p) => p.id === id ? { ...p, status: 'Approved', actionBy: currentUser, actionAt: fmtNow() } : p));
  const reject = (id) => setPayouts(payouts.map((p) => p.id === id ? { ...p, status: 'Rejected', actionBy: currentUser, actionAt: fmtNow() } : p));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Commission Payouts</div>
          <div className="page-sub">Review, approve, and process affiliate commission withdrawal requests</div>
        </div>
        {pending.length > 0 && (
          <span className="chip" style={{ color: 'var(--amber)', borderColor: 'rgba(217,119,6,0.3)', background: 'rgba(217,119,6,0.06)' }}>
            <Icon n="payout" size={12} />
            {pending.length} pending · ${pendingAmount.toLocaleString()}
          </span>
        )}
      </div>

      <div className="grid-2" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber)' }}><Icon n="payout" size={17} /></div>
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value">{pending.length}</div>
          <div className="stat-delta" style={{ color: 'var(--amber)' }}>${pendingAmount.toLocaleString()} awaiting approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--emerald)' }}><Icon n="check" size={17} /></div>
          <div className="stat-label">Paid This Cycle</div>
          <div className="stat-value">{approved.length}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />${approvedAmount.toLocaleString()} processed</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="tabs" style={{ margin: 0 }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((t) => (
              <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {t}
                {t === 'Pending' && pending.length > 0 && (
                  <span className="nav-badge">{pending.length}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Affiliate</th><th>Amount</th>
                <th>Method</th><th>Wallet / Account</th><th>Requested</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{p.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Initials name={p.affiliate} size={28} />
                      <span style={{ fontWeight: 500 }}>{p.affiliate}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)', fontSize: 14 }}>${p.amount.toLocaleString()}</td>
                  <td className="td-muted">{p.method}</td>
                  <td>
                    <span style={{ fontFamily: 'DM Mono', fontSize: 11, background: 'var(--surface2)', padding: '2px 8px', borderRadius: 4 }}>{p.wallet}</span>
                  </td>
                  <td className="td-muted">{p.requested}</td>
                  <td>
                    <Badge status={p.status === 'Rejected' ? 'Rejected' : p.status === 'Approved' ? 'Approved' : 'Pending'} />
                    {p.actionBy && (
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, whiteSpace: 'nowrap' }}>
                        By {p.actionBy} · {p.actionAt}
                      </div>
                    )}
                  </td>
                  <td>
                    {p.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => approve(p.id)}>
                          <Icon n="check" size={12} />Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => reject(p.id)}>
                          <Icon n="x" size={12} />Reject
                        </button>
                      </div>
                    )}
                    {p.status !== 'Pending' && <span className="td-muted">—</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-icon">✅</div>
                      <div className="empty-title">No Payouts in this category</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
