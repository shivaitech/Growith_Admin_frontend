import { useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import { referrals, affiliateLinks, affiliatePayouts } from '../../data/mockData';

const totalCommission = referrals.reduce((a, r) => a + r.commission, 0);
const pendingPayouts = affiliatePayouts.filter((p) => p.status === 'Pending');
const pendingAmount = pendingPayouts.reduce((a, p) => a + p.amount, 0);
const totalRevenue = referrals.reduce((a, r) => a + r.totalInvest, 0);
const totalClicks = affiliateLinks.reduce((a, l) => a + l.clicks, 0);
const totalSignups = affiliateLinks.reduce((a, l) => a + l.signups, 0);
const totalConverted = affiliateLinks.reduce((a, l) => a + l.converted, 0);
const convRate = totalSignups > 0 ? ((totalConverted / totalSignups) * 100).toFixed(1) : '0.0';

const stats = [
  { label: 'Active Affiliates', value: referrals.length, delta: '+2 this month', up: true, icon: 'referral', color: '#1a56db' },
  { label: 'Commission Paid', value: `$${totalCommission.toLocaleString()}`, delta: 'All time', up: null, icon: 'coins', color: '#059669' },
  { label: 'Pending Payouts', value: pendingPayouts.length, delta: `$${pendingAmount.toLocaleString()} waiting`, up: null, icon: 'payout', color: '#d97706' },
  { label: 'Affiliate Revenue', value: `$${totalRevenue.toLocaleString()}`, delta: '+18.2% this month', up: true, icon: 'affiliate', color: '#6366f1' },
];

const tierConfig = [
  { tier: 'L1', label: 'Direct Referral', rate: 5, desc: 'Direct sign-up + investment', color: '#1a56db' },
  { tier: 'L2', label: 'Second Level', rate: 3, desc: 'Referred by L1 affiliate', color: '#059669' },
  { tier: 'L3', label: 'Third Level', rate: 1.5, desc: 'Referred by L2 affiliate', color: '#9aa3b5' },
];

export default function AffiliateOverview() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Affiliate Program</div>
          <div className="page-sub">Manage referrals, track commissions, and grow your affiliate network</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/affiliate/payouts')}>
            <Icon n="payout" size={13} />Payouts
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/affiliate/create-link')}>
            <Icon n="plus" size={13} />Create Link
          </button>
        </div>
      </div>

      <div className="grid-4">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}><Icon n={s.icon} size={17} /></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-delta ${s.up === true ? 'delta-up' : ''}`} style={{ color: s.up === null ? 'var(--text3)' : undefined }}>
              {s.up === true && <Icon n="up" size={11} />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Link performance */}
        <div className="card">
          <div className="section-title">Link Performance</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Clicks', value: totalClicks, color: 'var(--accent)' },
              { label: 'Sign Ups', value: totalSignups, color: 'var(--emerald)' },
              { label: 'Conv. Rate', value: convRate + '%', color: 'var(--amber)' },
            ].map((m) => (
              <div key={m.label} style={{ flex: 1, background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontFamily: 'DM Mono' }}>{m.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div className="section-title">Active Referral Links</div>
          {affiliateLinks.filter((l) => l.status === 'Active').map((l) => (
            <div className="info-row" key={l.id}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{l.affiliate}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>nexusvault.io/ref/{l.code}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{l.clicks} clicks · {l.signups} signups</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--emerald)' }}>${l.revenue.toLocaleString()} revenue</div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }} onClick={() => navigate('/affiliate/create-link')}>
            <Icon n="link" size={13} />Manage All Links
          </button>
        </div>

        {/* Top affiliates */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-title" style={{ margin: 0 }}>Top Affiliates</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/affiliate/affiliates')}>View All</button>
          </div>
          {[...referrals].sort((a, b) => b.commission - a.commission).map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < referrals.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : i === 1 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : 'linear-gradient(135deg,#92400e,#78350f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <Initials name={r.investor} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{r.investor}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {r.referred} referrals · <Badge status={r.tier} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)', fontSize: 13 }}>${r.commission.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>commission</div>
              </div>
            </div>
          ))}

          {pendingPayouts.length > 0 && (
            <div style={{ marginTop: 16, background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 'var(--radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--amber)' }}>
                <span style={{ fontWeight: 600 }}>{pendingPayouts.length} payouts</span> awaiting approval
              </div>
              <button className="btn btn-sm" style={{ background: 'rgba(217,119,6,0.12)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.25)', flexShrink: 0 }} onClick={() => navigate('/affiliate/payouts')}>
                Review →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Commission structure overview */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="section-title" style={{ margin: 0 }}>Commission Structure</div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/affiliate/commissions')}>
            <Icon n="percent" size={13} />Edit Rates
          </button>
        </div>
        <div className="grid-3">
          {tierConfig.map((t) => (
            <div key={t.tier} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: 16, border: `1px solid ${t.color}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Badge status={t.tier} />
                <span style={{ fontSize: 22, fontWeight: 700, color: t.color, fontFamily: 'DM Mono' }}>{t.rate}%</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>{t.desc}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text2)' }}>
                {referrals.filter((r) => r.tier === t.tier).length} affiliate{referrals.filter((r) => r.tier === t.tier).length !== 1 ? 's' : ''} active
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
