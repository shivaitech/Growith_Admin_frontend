import { useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import KYCModal from '../../components/common/KYCModal';
import { kycItems as initialKYC } from '../../data/mockData';

const tabs = ['Pending', 'Approved', 'Rejected', 'Manual Review'];

const fmtNow = () => {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

export default function KYC() {
  const [tab, setTab] = useState('Pending');
  const [modal, setModal] = useState(null);
  const [items, setItems] = useState(initialKYC);
  const currentUser = useSelector((s) => s.auth.user?.name || 'Admin');

  const filtered = items.filter((i) => i.status === tab);

  const handleAction = (id, action) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: action, actionBy: currentUser, actionAt: fmtNow() } : i)));
    setModal(null);
  };

  return (
    <div className="animate-in">
      {modal && <KYCModal item={modal} onClose={() => setModal(null)} onAction={handleAction} />}

      <div className="page-header">
        <div>
          <div className="page-title">KYC Management</div>
          <div className="page-sub">Review and verify investor identity documents</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {tabs.map((t) => {
          const count = items.filter((i) => i.status === t).length;
          return (
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
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
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
                  <th>Applicant</th><th>Country</th><th>Document Type</th>
                  <th>Submitted</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={k.name} gradient="linear-gradient(135deg,#1a56db,#0ea5e9)" />
                        <div>
                          <div style={{ fontWeight: 500 }}>{k.name}</div>
                          <div className="td-muted">{k.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{k.country}</span></td>
                    <td className="td-muted">{k.docType}</td>
                    <td className="td-muted">{k.submitted}</td>
                    <td>
                      <Badge status={k.status} />
                      {k.actionBy && (
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, whiteSpace: 'nowrap' }}>
                          By {k.actionBy} · {k.actionAt}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(k)}>
                          <Icon n="eye" size={12} />Review
                        </button>
                        {k.status === 'Pending' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleAction(k.id, 'Approved')}>
                              <Icon n="check" size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleAction(k.id, 'Rejected')}>
                              <Icon n="x" size={12} />
                            </button>
                          </>
                        )}
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
