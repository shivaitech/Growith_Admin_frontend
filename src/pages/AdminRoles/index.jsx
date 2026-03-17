import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import { adminRoles as initialRoles } from '../../data/mockData';

const permList = ['kyc', 'payments', 'investors', 'token', 'airdrop', 'referrals', 'withdrawals', 'settings'];

export default function AdminRoles() {
  const [roles, setRoles] = useState(initialRoles);

  const toggle = (roleId, perm) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId || r.role === 'Master Admin') return r;
        const has = r.permissions.includes(perm);
        return { ...r, permissions: has ? r.permissions.filter((x) => x !== perm) : [...r.permissions, perm] };
      })
    );
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Admin Role Control</div>
          <div className="page-sub">Manage team access and permission levels</div>
        </div>
        <button className="btn btn-primary"><Icon n="plus" size={13} />Invite Admin</button>
      </div>

      {roles.map((r) => (
        <div className="card" key={r.id} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Initials
                name={r.name}
                gradient={r.role === 'Master Admin' ? 'linear-gradient(135deg,#1a56db,#0ea5e9)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)'}
                size={44}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{r.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${r.role === 'Master Admin' ? 'badge-blue' : 'badge-gray'}`} style={{ fontSize: 12 }}>
                {r.role}
              </span>
              <Badge status={r.status} />
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Module Permissions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {permList.map((p) => {
              const has = r.permissions.includes('all') || r.permissions.includes(p);
              return (
                <div
                  key={p}
                  onClick={() => toggle(r.id, p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px',
                    borderRadius: 'var(--radius)',
                    background: has ? 'rgba(26,86,219,0.08)' : 'var(--surface2)',
                    border: '1px solid', borderColor: has ? 'rgba(26,86,219,0.25)' : 'var(--border)',
                    cursor: r.role === 'Master Admin' ? 'not-allowed' : 'pointer',
                    fontSize: 12, color: has ? 'var(--accent)' : 'var(--text3)',
                    fontWeight: has ? 600 : 400, transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: has ? 'var(--accent)' : 'var(--border)' }} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </div>
              );
            })}
          </div>
          {r.role !== 'Master Admin' && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>
              Click a permission to toggle. Changes are applied immediately.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
