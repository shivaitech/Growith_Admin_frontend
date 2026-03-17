import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import PaymentModal from '../../components/common/PaymentModal';
import { payments as initialPayments } from '../../data/mockData';

export default function Payments() {
  const [modal, setModal] = useState(null);
  const [items, setItems] = useState(initialPayments);

  const handleAction = (id, status) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setModal(null);
  };

  const pending = items.filter((i) => i.status === 'Pending');
  const completed = items.filter((i) => i.status === 'Completed');

  return (
    <div className="animate-in">
      {modal && <PaymentModal item={modal} onClose={() => setModal(null)} onAction={handleAction} />}

      <div className="page-header">
        <div>
          <div className="page-title">Payment Verification</div>
          <div className="page-sub">Approve and manage investor payments</div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-label">Total Collected</div>
          <div className="stat-value" style={{ fontSize: 22 }}>$373,000</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--amber)' }}>
            ${pending.reduce((a, p) => a + p.amount, 0).toLocaleString()}
          </div>
          <div className="stat-delta" style={{ color: 'var(--amber)' }}>{pending.length} awaiting approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--emerald)' }}>
            ${completed.reduce((a, p) => a + p.amount, 0).toLocaleString()}
          </div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />{completed.length} transactions</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th><th>Investor</th><th>Amount</th><th>Method</th>
                <th>Reference</th><th>Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{p.investor}</td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>${p.amount.toLocaleString()}</td>
                  <td><span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{p.method}</span></td>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)' }}>{p.ref}</td>
                  <td className="td-muted">{p.date}</td>
                  <td><Badge status={p.status} /></td>
                  <td>
                    {p.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>
                          <Icon n="eye" size={12} />View
                        </button>
                        <button className="btn btn-success btn-sm" onClick={() => handleAction(p.id, 'Completed')}>
                          <Icon n="check" size={12} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
