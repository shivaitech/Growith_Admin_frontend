import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { referrals } from '../../data/mockData';

const totalRef = referrals.reduce((a, r) => a + r.referred, 0);
const totalInvest = referrals.reduce((a, r) => a + r.totalInvest, 0);
const totalComm = referrals.reduce((a, r) => a + r.commission, 0);

export default function Referrals() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Referral & Affiliate Program</div>
          <div className="page-sub">Multi-tier referral tracking · L1 5% · L2 3% · L3 1.5%</div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-label">Total Referrals</div>
          <div className="stat-value">{totalRef}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Across all tiers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Referred Investment</div>
          <div className="stat-value" style={{ fontSize: 22 }}>${totalInvest.toLocaleString()}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />L1 + L2 + L3</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Commission Paid</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--emerald)' }}>${totalComm.toLocaleString()}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>All affiliates</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Referrer</th><th>Tier</th><th>Referred Investors</th>
                <th>Total Investment</th><th>Commission Earned</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.investor}</td>
                  <td><Badge status={r.tier} /></td>
                  <td>{r.referred} investors</td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>${r.totalInvest.toLocaleString()}</td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>${r.commission.toLocaleString()}</td>
                  <td><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
