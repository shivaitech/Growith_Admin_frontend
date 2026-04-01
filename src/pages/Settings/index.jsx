import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/common/Icon';
import Initials from '../../components/common/Initials';

const tabMap = { 'sub-admins': 'Sub Admins', 'platform': 'Platform' };
const tabs = ['Profile', 'Sub Admins', 'Platform'];

const tokenConfig = [
  { l: 'Token Name', v: 'GWT (Growith Token)' },
  { l: 'Contract Address', v: '0x742d...8e4f' },
  { l: 'Token Price', v: '$0.05 / NVT' },
  { l: 'Total Supply', v: '100,000,000 NVT' },
  { l: 'Min Investment', v: '$500 USD' },
  { l: 'Max Investment', v: '$500,000 USD' },
  { l: 'Vesting Period', v: '24 months' },
  { l: 'TGE Unlock', v: '10%' },
];

const commRates = [
  { l: 'Level 1 — Direct Referral', v: '5.0%' },
  { l: 'Level 2', v: '3.0%' },
  { l: 'Level 3', v: '1.5%' },
  { l: 'Minimum Payout', v: '$50' },
  { l: 'Payout Frequency', v: 'Monthly' },
];

export default function Settings() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Profile');
  const [subAdmins, setSubAdmins] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Sub Admin' });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabMap[tab]) setActiveTab(tabMap[tab]);
  }, [searchParams]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;
    setSubAdmins((prev) => [
      ...prev,
      { id: Date.now(), ...inviteForm, status: 'Pending', createdAt: new Date().toLocaleDateString() },
    ]);
    setInviteForm({ name: '', email: '', role: 'Sub Admin' });
    setShowInvite(false);
  };

  const removeSubAdmin = (id) => {
    setSubAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Manage your profile, team, and platform configuration</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? 'var(--accent)' : 'var(--text2)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'Profile' && (
        <div className="grid-2">
          <div className="card">
            <div className="section-title">Admin Profile</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <Initials
                name={user?.name || user?.email || 'A'}
                gradient="linear-gradient(135deg,#1a56db,#0ea5e9)"
                size={56}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{user?.email || '—'}</div>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Name</span>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{user?.email || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="badge badge-blue" style={{ fontSize: 11 }}>{user?.role || 'Admin'}</span>
            </div>
            {user?.phone && (
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{user.phone}</span>
              </div>
            )}
            {user?.createdAt && (
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            {user?.lastLogin && (
              <div className="info-row">
                <span className="info-label">Last Login</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-title">Security</div>
            <div className="info-row">
              <span className="info-label">Password</span>
              <span style={{ fontSize: 13 }}>••••••••</span>
            </div>
            <div className="info-row">
              <span className="info-label">Two-Factor Auth</span>
              <span className="badge badge-gray" style={{ fontSize: 11 }}>Not Enabled</span>
            </div>
            <div style={{ marginTop: 16, padding: 14, borderRadius: 'var(--radius)', background: 'rgba(26,86,219,0.06)', border: '1px solid rgba(26,86,219,0.12)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                <Icon n="shield" size={14} /> 2FA and password change will be available in a future update.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Admins Tab */}
      {activeTab === 'Sub Admins' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              {subAdmins.length} sub-admin{subAdmins.length !== 1 ? 's' : ''} added
            </div>
            <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
              <Icon n="plus" size={13} />Add Sub Admin
            </button>
          </div>

          {/* Invite modal */}
          {showInvite && (
            <div className="card" style={{ marginBottom: 16, border: '1px solid var(--accent)', background: 'rgba(26,86,219,0.03)' }}>
              <div className="section-title">Invite New Sub Admin</div>
              <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Name</label>
                    <input
                      className="filter-input"
                      style={{ width: '100%' }}
                      placeholder="Full name"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Email</label>
                    <input
                      className="filter-input"
                      style={{ width: '100%' }}
                      type="email"
                      placeholder="email@example.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Role</label>
                  <select
                    className="filter-input"
                    style={{ width: '100%' }}
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  >
                    <option value="Sub Admin">Sub Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-gray" onClick={() => setShowInvite(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send Invite</button>
                </div>
              </form>
            </div>
          )}

          {/* Sub admin list */}
          {subAdmins.length === 0 && !showInvite ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <Icon n="roles" size={28} />
              <div style={{ marginTop: 12, fontWeight: 700, fontSize: 15 }}>No Sub Admins Yet</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Add team members to help manage the platform</div>
            </div>
          ) : (
            subAdmins.map((admin) => (
              <div className="card" key={admin.id} style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Initials
                    name={admin.name}
                    gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                    size={38}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{admin.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{admin.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-gray" style={{ fontSize: 11 }}>{admin.role}</span>
                  <span className="badge badge-yellow" style={{ fontSize: 11 }}>{admin.status}</span>
                  <button
                    className="icon-btn"
                    title="Remove"
                    onClick={() => removeSubAdmin(admin.id)}
                    style={{ color: 'var(--red)' }}
                  >
                    <Icon n="close" size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Platform Tab */}
      {activeTab === 'Platform' && (
        <div className="grid-2">
          <div className="card">
            <div className="section-title">Token Configuration</div>
            {tokenConfig.map(({ l, v }) => (
              <div className="info-row" key={l}>
                <span className="info-label">{l}</span>
                <span style={{ fontFamily: 'DM Mono', fontSize: 12, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">Referral Commission Rates</div>
              {commRates.map(({ l, v }) => (
                <div className="info-row" key={l}>
                  <span className="info-label">{l}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono', fontSize: 12 }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg,rgba(26,86,219,0.06),rgba(14,165,233,0.04))', border: '1px solid rgba(26,86,219,0.15)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(26,86,219,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Icon n="shield" size={17} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 4, fontSize: 13 }}>Phase 2 — Web3 Integration</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                    Smart contract automation, on-chain token distribution, MetaMask wallet connect, and real-time blockchain verification coming in Phase 2.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
