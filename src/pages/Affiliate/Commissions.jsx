import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';

const defaultStructure = [
  { tier: 'L1', label: 'Direct Referral', rate: 5, minPayout: 100, description: 'Commission earned when your direct referral makes a confirmed investment', color: '#1a56db', count: 2 },
  { tier: 'L2', label: 'Second Level', rate: 3, minPayout: 50, description: 'Earned on investments by investors that were referred by your L1 affiliates', color: '#059669', count: 1 },
  { tier: 'L3', label: 'Third Level', rate: 1.5, minPayout: 25, description: 'Earned on investments by investors that were referred by your L2 affiliates', color: '#9aa3b5', count: 1 },
];

const rules = [
  { id: 'first_investment', label: 'First Investment Only', desc: 'Commission only triggered on an investor\'s first investment' },
  { id: 'recurring', label: 'Recurring Investments', desc: 'Earn commission on all subsequent investments by referred investors' },
  { id: 'auto_payout', label: 'Auto-Payout on Threshold', desc: 'Automatically initiate payout when minimum threshold is reached' },
  { id: 'manual_approve', label: 'Manual Approval Required', desc: 'All payouts require admin approval before processing' },
  { id: 'kyc_required', label: 'KYC Required for Payout', desc: 'Affiliate must complete KYC verification before receiving any commission' },
  { id: 'self_refer', label: 'Block Self-Referrals', desc: 'Prevent affiliates from earning commission on their own investments' },
];

const defaultToggles = { first_investment: true, recurring: false, auto_payout: true, manual_approve: true, kyc_required: true, self_refer: true };

export default function Commissions() {
  const [structure, setStructure] = useState(defaultStructure);
  const [editing, setEditing] = useState(null);
  const [editVals, setEditVals] = useState({});
  const [toggles, setToggles] = useState(defaultToggles);
  const [saved, setSaved] = useState(false);

  const startEdit = (tier) => {
    const item = structure.find((s) => s.tier === tier);
    setEditVals({ rate: item.rate, minPayout: item.minPayout });
    setEditing(tier);
  };

  const saveEdit = (tier) => {
    setStructure(structure.map((s) => s.tier === tier ? { ...s, rate: parseFloat(editVals.rate) || s.rate, minPayout: parseFloat(editVals.minPayout) || s.minPayout } : s));
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Commission Structure</div>
          <div className="page-sub">Configure multi-tier commission rates, payout rules, and affiliate policies</div>
        </div>
        {saved && (
          <span className="chip" style={{ color: 'var(--emerald)', borderColor: 'rgba(5,150,105,0.3)', background: 'rgba(5,150,105,0.06)' }}>
            <Icon n="check" size={12} />Changes Saved
          </span>
        )}
      </div>

      {/* Tier cards */}
      <div className="grid-3" style={{ marginBottom: 18 }}>
        {structure.map((t) => (
          <div className="card" key={t.tier} style={{ border: `1px solid ${t.color}28` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <Badge status={t.tier} />
              {editing === t.tier ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-success btn-sm" onClick={() => saveEdit(t.tier)}><Icon n="check" size={12} />Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(t.tier)}>
                  <Icon n="percent" size={12} />Edit
                </button>
              )}
            </div>

            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 18 }}>{t.description}</div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>Commission Rate</div>
                {editing === t.tier ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input type="number" step="0.1" min="0" max="50"
                      style={{ width: 58, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 15, fontFamily: 'DM Mono', fontWeight: 700 }}
                      value={editVals.rate} onChange={(e) => setEditVals({ ...editVals, rate: e.target.value })} />
                    <span style={{ color: t.color, fontWeight: 700, fontSize: 16 }}>%</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 28, fontWeight: 700, color: t.color, fontFamily: 'DM Mono' }}>{t.rate}%</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>Min. Payout</div>
                {editing === t.tier ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--text2)', fontSize: 15 }}>$</span>
                    <input type="number" min="0"
                      style={{ width: 66, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 15, fontFamily: 'DM Mono', fontWeight: 700 }}
                      value={editVals.minPayout} onChange={(e) => setEditVals({ ...editVals, minPayout: e.target.value })} />
                  </div>
                ) : (
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'DM Mono' }}>${t.minPayout}</div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)' }}>
              {t.count} active affiliate{t.count !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Policies */}
      <div className="card">
        <div className="section-title">Commission Policies</div>
        {rules.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < rules.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{r.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{r.desc}</div>
            </div>
            <button
              className={`toggle ${toggles[r.id] ? 'on' : 'off'}`}
              onClick={() => setToggles({ ...toggles, [r.id]: !toggles[r.id] })}
            />
          </div>
        ))}
      </div>

      {/* Payout schedule */}
      <div className="card" style={{ marginTop: 18, background: 'rgba(26,86,219,0.02)', border: '1px solid rgba(26,86,219,0.1)' }}>
        <div className="section-title">Payout Schedule & Methods</div>
        <div className="grid-3">
          {[
            { label: 'Payout Cycle', value: 'Monthly', desc: 'Processed on the 1st of every month' },
            { label: 'Processing Time', value: '3–5 Days', desc: 'After admin approval is granted' },
            { label: 'Accepted Methods', value: 'Bank · USDT · Wire', desc: 'Based on affiliate preference at signup' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
