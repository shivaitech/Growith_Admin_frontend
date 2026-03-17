import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { investors } from '../../data/mockData';

export default function Airdrop() {
  const [sel, setSel] = useState({});
  const [sent, setSent] = useState({});
  const [amount, setAmount] = useState(500);

  const totalSel = Object.values(sel).filter(Boolean).length;

  const handleSend = () => {
    if (totalSel === 0) return;
    const ns = { ...sent };
    Object.entries(sel).forEach(([id, v]) => { if (v) ns[id] = true; });
    setSent(ns);
    setSel({});
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Airdrop System</div>
          <div className="page-sub">Distribute tokens to selected investors</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ margin: 0 }}>Select Recipients</div>
            {totalSel > 0 && <span className="chip" style={{ color: 'var(--accent)' }}>{totalSel} selected</span>}
          </div>
          {investors.map((i) => (
            <div
              key={i.id}
              onClick={() => { if (!sent[i.id]) setSel((p) => ({ ...p, [i.id]: !p[i.id] })); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 'var(--radius)', cursor: sent[i.id] ? 'default' : 'pointer',
                background: sel[i.id] ? 'rgba(26,86,219,0.07)' : sent[i.id] ? 'rgba(5,150,105,0.05)' : 'transparent',
                border: '1px solid', borderColor: sel[i.id] ? 'rgba(26,86,219,0.25)' : 'transparent',
                marginBottom: 4, transition: 'all 0.1s', opacity: sent[i.id] ? 0.55 : 1,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: '1.5px solid',
                borderColor: sel[i.id] ? 'var(--accent)' : sent[i.id] ? 'var(--emerald)' : 'var(--border)',
                background: sel[i.id] ? 'var(--accent)' : sent[i.id] ? 'var(--emerald)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
              }}>
                {(sel[i.id] || sent[i.id]) && <Icon n="check" size={10} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{i.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{i.tokens.toLocaleString()} tokens</div>
              </div>
              {sent[i.id] ? <span className="badge badge-green" style={{ fontSize: 10 }}>Sent</span> : <Badge status={i.kyc} />}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title">Airdrop Configuration</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Token Amount per Recipient
            </label>
            <input
              className="filter-input"
              style={{ width: '100%' }}
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter token amount"
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Tag / Category
            </label>
            <select className="filter-input" style={{ width: '100%' }}>
              <option>Airdrop</option><option>Purchased</option>
              <option>Bonus</option><option>Referral Reward</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Campaign Notes
            </label>
            <textarea
              className="filter-input"
              style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
              placeholder="Optional notes about this airdrop..."
            />
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 14, border: '1px solid var(--border)' }}>
            <div className="info-row">
              <span className="info-label">Selected recipients</span>
              <span style={{ fontWeight: 600 }}>{totalSel}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Tokens per recipient</span>
              <span style={{ fontWeight: 600, fontFamily: 'DM Mono' }}>{amount.toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total tokens to distribute</span>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono' }}>{(totalSel * amount).toLocaleString()}</span>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px' }}
            onClick={handleSend}
            disabled={totalSel === 0}
          >
            <Icon n="airdrop" size={14} />
            Send Airdrop to {totalSel} Investor{totalSel !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
