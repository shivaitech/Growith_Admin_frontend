import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { withdrawals as initialWithdrawals } from '../../data/mockData';

export default function Withdrawals() {
  const [items, setItems] = useState(initialWithdrawals);

  const handleAction = (id, action) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: action } : i)));

  const pending = items.filter((i) => i.status === 'Pending').length;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Withdrawal Management</div>
          <div className="page-sub">{pending} pending request{pending !== 1 ? 's' : ''}</div>
        </div>
      </div>

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
              {items.map((w) => (
                <tr key={w.id}>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{w.id}</td>
                  <td style={{ fontWeight: 500 }}>{w.investor}</td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>${w.amount.toLocaleString()}</td>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)' }}>{w.wallet}</td>
                  <td className="td-muted">{w.requested}</td>
                  <td><Badge status={w.status} /></td>
                  <td>
                    {w.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleAction(w.id, 'Approved')}>
                          <Icon n="check" size={12} />Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleAction(w.id, 'Rejected')}>
                          <Icon n="x" size={12} />Reject
                        </button>
                      </div>
                    )}
                    {w.status !== 'Pending' && <Badge status={w.status} />}
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
