import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleSidebarCollapse, toggleSidebar, setTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import Icon from './Icon';
import { notifications } from '../../data/mockData';

const routeLabels = {
  '/': 'Dashboard',
  '/investors': 'Investor Management',
  '/kyc': 'KYC Management',
  '/payments': 'Payment Verification',
  '/token': 'Token Allocation',
  '/airdrop': 'Airdrop System',
  '/withdrawals': 'Withdrawal Management',
  '/affiliate': 'Affiliate Program',
  '/affiliate/create-link': 'Create Referral Link',
  '/affiliate/affiliates': 'All Affiliates',
  '/affiliate/commissions': 'Commission Structure',
  '/affiliate/payouts': 'Commission Payouts',
  '/roles': 'Admin Role Control',
  '/settings': 'Platform Settings',
};

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);
  const dark = theme === 'dark';

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false); };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AM';

  return (
    <header className="topbar" onClick={closeAll}>
      <button
        className="topbar-toggle"
        onClick={(e) => {
          e.stopPropagation();
          if (window.innerWidth < 768) {
            dispatch(toggleSidebar());
          } else {
            dispatch(toggleSidebarCollapse());
          }
        }}
      >
        <Icon n="menu" size={16} />
      </button>

      <div className="topbar-title">{routeLabels[location.pathname] || 'Dashboard'}</div>

      <div className="search-wrap">
        <Icon n="search" size={14} />
        <input placeholder="Search investors, payments..." />
      </div>

      <div className="topbar-actions">
        {/* Theme toggle */}
        <button
          className="icon-btn"
          onClick={(e) => { e.stopPropagation(); dispatch(setTheme(dark ? 'light' : 'dark')); }}
          title="Toggle theme"
        >
          <Icon n={dark ? 'sun' : 'moon'} size={15} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); setNotifOpen((o) => !o); setProfileOpen(false); }}
          >
            <Icon n="bell" size={15} />
            <span className="notif-dot" />
          </button>
          {notifOpen && (
            <div className="notif-panel animate-in" onClick={(e) => e.stopPropagation()}>
              <div className="notif-header">
                Notifications
                <span className="badge badge-red" style={{ fontSize: 10, padding: '2px 8px' }}>4 new</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className="notif-item" onClick={closeAll}>
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-body">{n.body}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <div
            className="avatar"
            onClick={(e) => { e.stopPropagation(); setProfileOpen((o) => !o); setNotifOpen(false); }}
          >
            {initials}
          </div>
          {profileOpen && (
            <div className="profile-panel animate-in" onClick={(e) => e.stopPropagation()}>
              <div className="profile-header">
                <div className="profile-name">{user?.name ?? 'Alex Morgan'}</div>
                <div className="profile-role">Master Admin · NexusVault</div>
              </div>
              {[
                { icon: 'user', label: 'Profile Settings' },
                { icon: 'roles', label: 'Security & 2FA' },
                { icon: 'settings', label: 'Preferences' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="profile-item"
                  onClick={() => { navigate('/settings'); closeAll(); }}
                >
                  <Icon n={item.icon} size={14} />{item.label}
                </div>
              ))}
              <div
                className="profile-item"
                style={{ color: 'var(--red)', borderTop: '1px solid var(--border)' }}
                onClick={handleLogout}
              >
                <Icon n="logout" size={14} />Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
