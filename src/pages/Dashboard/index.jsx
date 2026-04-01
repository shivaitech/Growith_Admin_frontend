import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import BarLineChart from '../../components/charts/BarLineChart';
import DonutChart from '../../components/charts/DonutChart';
import adminService from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const dark = useSelector((s) => s.ui.theme) === 'dark';
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers();
      const list = res?.data?.users || res?.data || res?.users || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Compute real stats from users
  const totalInvestors = users.length;
  const pendingKyc = users.filter((u) => u.kycStatus === 'Pending' || u.kycStatus === 'Manual Review').length;
  const approvedKyc = users.filter((u) => u.kycStatus === 'Approved').length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const verifiedEmails = users.filter((u) => u.emailVerified).length;

  const stats = [
    { label: 'Total Investors', value: totalInvestors.toString(), delta: `${activeUsers} active`, up: true, icon: 'users', color: '#1a56db' },
    { label: 'Verified Emails', value: verifiedEmails.toString(), delta: `${totalInvestors - verifiedEmails} unverified`, up: verifiedEmails > 0, icon: 'check', color: '#059669' },
    { label: 'Pending KYC', value: pendingKyc.toString(), delta: pendingKyc > 0 ? 'Needs review' : 'All clear', up: false, icon: 'kyc', color: '#d97706' },
    { label: 'KYC Approved', value: approvedKyc.toString(), delta: `${totalInvestors > 0 ? Math.round((approvedKyc / totalInvestors) * 100) : 0}% approval rate`, up: null, icon: 'shield', color: '#6366f1' },
  ];

  // Sort by newest first for the activity table
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard Overview</div>
          <div className="page-sub">Welcome back, {user?.fullName || 'Admin'}. Platform is running smoothly.</div>
        </div>
        <span className="chip"><Icon n="filter" size={12} />Last 30 days</span>
      </div>

      <div className="grid-4">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>
              <Icon n={s.icon} size={17} />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div
              className={`stat-delta ${s.up === true ? 'delta-up' : s.up === false ? 'delta-down' : ''}`}
              style={{ color: s.up === null ? 'var(--text3)' : undefined }}
            >
              {s.up === true && <Icon n="up" size={11} />}
              {s.up === false && <Icon n="down" size={11} />}
              {loading ? 'Loading…' : s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Investment & Growth (6 Months)</div>
          <div className="chart-wrap"><BarLineChart dark={dark} /></div>
        </div>
        <div className="card">
          <div className="section-title">KYC Status Breakdown</div>
          <div className="chart-wrap"><DonutChart dark={dark} /></div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Recent Investor Activity</div>

        {error && (
          <div style={{ padding: '12px 16px', marginBottom: 14, borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
            {error}
            <button style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }} onClick={fetchUsers}>Retry</button>
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Investor</th><th>KYC Status</th><th>Email Verified</th>
                <th>Status</th><th>Last Login</th><th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">Loading investors…</div></div></td></tr>
              ) : recentUsers.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No investors yet</div></div></td></tr>
              ) : (
                recentUsers.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={i.fullName || i.email || '?'} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{i.fullName || '—'}</div>
                          <div className="td-muted">{i.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge status={i.kycStatus || 'Not Started'} /></td>
                    <td>
                      <span className={`badge ${i.emailVerified ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 11 }}>
                        {i.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${i.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11 }}>
                        {i.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td-muted">{i.lastLoginAt ? new Date(i.lastLoginAt).toLocaleDateString() : '—'}</td>
                    <td className="td-muted">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
