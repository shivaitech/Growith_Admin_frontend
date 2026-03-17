import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { affiliateLinks } from '../../data/mockData';

const BASE_URL = 'https://growith.io/ref/';

function genCode(name) {
  return name.trim().toUpperCase().replace(/\s+/g, '-').slice(0, 10) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export default function CreateLink() {
  const [links, setLinks] = useState(affiliateLinks);
  const [form, setForm] = useState({ affiliate: '', campaign: '', code: '', tier: 'L1' });
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    const code = form.code || genCode(form.affiliate);
    setLinks([
      { id: `LNK-00${links.length + 1}`, affiliate: form.affiliate, campaign: form.campaign, code, clicks: 0, signups: 0, converted: 0, revenue: 0, created: new Date().toISOString().slice(0, 10), status: 'Active' },
      ...links,
    ]);
    setGenerated(BASE_URL + code);
    setForm({ affiliate: '', campaign: '', code: '', tier: 'L1' });
  };

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleStatus = (id) =>
    setLinks(links.map((l) => l.id === id ? { ...l, status: l.status === 'Active' ? 'Paused' : 'Active' } : l));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Create Referral Link</div>
          <div className="page-sub">Generate tracked referral links for your affiliates</div>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Generator form */}
        <div className="card">
          <div className="section-title">Generate New Link</div>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Affiliate Name *</label>
              <input className="filter-input" style={{ width: '100%' }} placeholder="e.g. Arjun Mehta"
                value={form.affiliate} onChange={(e) => setForm({ ...form, affiliate: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Campaign Name *</label>
              <input className="filter-input" style={{ width: '100%' }} placeholder="e.g. Q2 Launch Campaign"
                value={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Commission Tier</label>
              <select className="filter-input" style={{ width: '100%' }} value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                <option value="L1">L1 — Direct Referral (5%)</option>
                <option value="L2">L2 — Second Level (3%)</option>
                <option value="L3">L3 — Third Level (1.5%)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
                Custom Code <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional — auto-generated if blank)</span>
              </label>
              <input className="filter-input" style={{ width: '100%', fontFamily: 'DM Mono' }} placeholder="e.g. ARJUN2024"
                value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
              <Icon n="link" size={14} />Generate Referral Link
            </button>
          </form>

          {generated && (
            <div style={{ marginTop: 20, background: 'rgba(26,86,219,0.06)', border: '1px solid rgba(26,86,219,0.2)', borderRadius: 'var(--radius)', padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 8 }}>LINK GENERATED</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1, fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text)', wordBreak: 'break-all' }}>{generated}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => copy(generated, 'gen')} style={{ flexShrink: 0 }}>
                  {copied === 'gen' ? <><Icon n="check" size={12} />Copied!</> : <><Icon n="link" size={12} />Copy</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card">
            <div className="section-title">How It Works</div>
            {[
              { icon: 'link', title: 'Share the Link', desc: 'Affiliate shares their unique link across channels' },
              { icon: 'users', title: 'Investor Signs Up', desc: 'New investor registers via the referral link' },
              { icon: 'payment', title: 'Investment Made', desc: 'Commission triggers on successful investment completion' },
              { icon: 'coins', title: 'Commission Paid', desc: 'Affiliate earns % based on their tier at monthly payout cycle' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius)', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Icon n={s.icon} size={14} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--emerald)', marginBottom: 8 }}>COMMISSION RATES</div>
            {[['L1 — Direct Referral', '5.0%'], ['L2 — Second Level', '3.0%'], ['L3 — Third Level', '1.5%']].map(([l, r]) => (
              <div key={l} className="info-row" style={{ fontSize: 12 }}>
                <span style={{ color: 'var(--text2)' }}>{l}</span>
                <span style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>{r}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>Paid monthly · Manual approval required</div>
          </div>
        </div>
      </div>

      {/* All links table */}
      <div className="card" style={{ marginTop: 18, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title" style={{ margin: 0 }}>All Referral Links</div>
          <span className="chip">{links.length} links total</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Affiliate</th><th>Campaign</th><th>Code</th>
                <th>Clicks</th><th>Signups</th><th>Revenue</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.affiliate}</td>
                  <td className="td-muted">{l.campaign}</td>
                  <td>
                    <span style={{ fontFamily: 'DM Mono', fontSize: 11, background: 'var(--surface2)', padding: '2px 8px', borderRadius: 4 }}>{l.code}</span>
                  </td>
                  <td>{l.clicks}</td>
                  <td>{l.signups}</td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 600, color: 'var(--emerald)' }}>${l.revenue.toLocaleString()}</td>
                  <td><Badge status={l.status === 'Active' ? 'Active' : 'Rejected'} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => copy(BASE_URL + l.code, l.id)}>
                        {copied === l.id ? <><Icon n="check" size={12} />Copied</> : <Icon n="link" size={12} />}
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: l.status === 'Active' ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)', color: l.status === 'Active' ? 'var(--red)' : 'var(--emerald)', border: `1px solid ${l.status === 'Active' ? 'rgba(220,38,38,0.2)' : 'rgba(5,150,105,0.2)'}` }}
                        onClick={() => toggleStatus(l.id)}
                      >
                        {l.status === 'Active' ? 'Pause' : 'Activate'}
                      </button>
                    </div>
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
