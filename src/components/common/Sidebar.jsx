import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import Icon from './Icon';

const navMain = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/investors', label: 'Investors', icon: 'users' },
  { to: '/kyc', label: 'KYC Management', icon: 'kyc', badge: 3 },
  { to: '/payments', label: 'Payments', icon: 'payment', badge: 3 },
  { to: '/token', label: 'Token Allocation', icon: 'token' },
];

const navFinance = [
  { to: '/airdrop', label: 'Airdrops', icon: 'airdrop' },
  { to: '/withdrawals', label: 'Withdrawals', icon: 'withdraw', badge: 2 },
];

const navAffiliate = [
  { to: '/affiliate', label: 'Overview', icon: 'affiliate', end: true },
  { to: '/affiliate/create-link', label: 'Create Referral Link', icon: 'link' },
  { to: '/affiliate/affiliates', label: 'All Affiliates', icon: 'users' },
  { to: '/affiliate/commissions', label: 'Commissions', icon: 'percent' },
  { to: '/affiliate/payouts', label: 'Payouts', icon: 'payout', badge: 2 },
];

const navAdmin = [
  { to: '/settings', label: 'Settings', icon: 'settings' },
  { to: '/roles', label: 'Admin Roles', icon: 'roles' },
];

function NavItem({ to, label, icon, badge, end, collapsed, onNavClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
      title={label}
      onClick={onNavClick}
    >
      <div className="nav-icon"><Icon n={icon} size={16} /></div>
      {!collapsed && (
        <>
          <span style={{ flex: 1 }}>{label}</span>
          {badge && <span className="nav-badge">{badge}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onClose }) {
  const dispatch = useDispatch();
  const { sidebarCollapsed, sidebarOpen } = useSelector((s) => s.ui);

  const closeMobile = () => {
    if (window.innerWidth < 768) dispatch(setSidebarOpen(false));
  };

  const classes = [
    'nv-sidebar',
    sidebarCollapsed ? 'collapsed' : '',
    sidebarOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={classes}>
      <div className="sidebar-logo">
        <div className="logo-icon">NV</div>
        {!sidebarCollapsed && (
          <div className="logo-text">Nexus<span>Vault</span></div>
        )}
      </div>

      <nav className="sidebar-nav">
        {!sidebarCollapsed && <div className="nav-label">Main</div>}
        {navMain.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} onNavClick={closeMobile} />
        ))}

        {!sidebarCollapsed && <div className="nav-label">Finance</div>}
        {navFinance.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} onNavClick={closeMobile} />
        ))}

        {!sidebarCollapsed && <div className="nav-label">Affiliate Program</div>}
        {navAffiliate.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} onNavClick={closeMobile} />
        ))}

        {!sidebarCollapsed && <div className="nav-label">Admin</div>}
        {navAdmin.map((item) => (
          <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} onNavClick={closeMobile} />
        ))}
      </nav>

      {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <div style={{ background: 'linear-gradient(135deg,rgba(26,86,219,0.1),rgba(14,165,233,0.06))', borderRadius: 'var(--radius)', padding: 12, border: '1px solid rgba(26,86,219,0.15)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 3 }}>
              Phase 2 Coming
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
              Web3 + Smart Contracts
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
