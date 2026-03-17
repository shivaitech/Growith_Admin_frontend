import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import { investors } from '../../data/mockData';

export default function Investors() {
  const [search, setSearch] = useState('');
  const [kycF, setKycF] = useState('All');

  const filtered = investors.filter(
    (i) =>
      (i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase())) &&
      (kycF === 'All' || i.kyc === kycF)
  );

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Investor Management</div>
          <div className="page-sub">{investors.length} registered investors</div>
        </div>
        <button className="btn btn-primary"><Icon n="plus" size={13} />Add Investor</button>
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 12px', flex: 1, maxWidth: 300 }}>
          <Icon n="search" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, padding: '8px 0', color: 'var(--text)', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
        <select className="filter-input" value={kycF} onChange={(e) => setKycF(e.target.value)}>
          {['All', 'Approved', 'Pending', 'Manual Review', 'Rejected'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Investor</th><th>Country</th><th>KYC</th>
                <th>Invested</th><th>Tokens</th><th>Joined</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">👤</div>
                      <div className="empty-title">No investors match your filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={i.name} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{i.name}</div>
                          <div className="td-muted">{i.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{i.country}</span></td>
                    <td><Badge status={i.kyc} /></td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 600, color: 'var(--emerald)' }}>${i.invested.toLocaleString()}</td>
                    <td style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text2)' }}>{i.tokens.toLocaleString()}</td>
                    <td className="td-muted">{i.joined}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm"><Icon n="eye" size={12} />View</button>
                    </td>
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
