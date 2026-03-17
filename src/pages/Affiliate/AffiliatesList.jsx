import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import { referrals, affiliateLinks } from '../../data/mockData';

const totalCommission = referrals.reduce((a, r) => a + r.commission, 0);
const totalInvest = referrals.reduce((a, r) => a + r.totalInvest, 0);

export default function AffiliatesList() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const filtered = referrals.filter((r) => {
    const matchSearch = r.investor.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'All' || r.tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">All Affiliates</div>
          <div className="page-sub">Multi-tier affiliate tracking · L1 5% · L2 3% · L3 1.5%</div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(26,86,219,0.1)', color: '#1a56db' }}><Icon n="referral" size={17} /></div>
          <div className="stat-label">Total Affiliates</div>
          <div className="stat-value">{referrals.length}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Across all tiers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}><Icon n="affiliate" size={17} /></div>
          <div className="stat-label">Referred Investment</div>
          <div className="stat-value" style={{ fontSize: 22 }}>${totalInvest.toLocaleString()}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />L1 + L2 + L3</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}><Icon n="coins" size={17} /></div>
          <div className="stat-label">Total Commission</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--emerald)' }}>${totalCommission.toLocaleString()}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>All affiliates</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap" style={{ display: 'flex', width: 220 }}>
            <Icon n="search" size={14} />
            <input
              placeholder="Search affiliates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, padding: '8px 0', width: '100%', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'L1', 'L2', 'L3'].map((t) => (
              <button key={t} className={`btn btn-sm ${tierFilter === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTierFilter(t)}>
                {t === 'All' ? 'All Tiers' : `Tier ${t}`}
              </button>
            ))}
          </div>
          <span className="chip" style={{ marginLeft: 'auto' }}>{filtered.length} affiliates</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Affiliate</th><th>Tier</th><th>Links</th>
                <th>Referrals</th><th>Total Investment</th><th>Commission Earned</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const linkCount = affiliateLinks.filter((l) => l.affiliate === r.investor).length || 1;
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={r.investor} size={30} />
                        <span style={{ fontWeight: 500 }}>{r.investor}</span>
                      </div>
                    </td>
                    <td><Badge status={r.tier} /></td>
                    <td>{linkCount} link{linkCount !== 1 ? 's' : ''}</td>
                    <td>{r.referred} investors</td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>${r.totalInvest.toLocaleString()}</td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>${r.commission.toLocaleString()}</td>
                    <td><Badge status={r.status} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <div className="empty-title">No affiliates found</div>
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
