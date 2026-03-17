import Icon from '../../components/common/Icon';

const tokenConfig = [
  { l: 'Token Name', v: 'GWT (Growith Token)' },
  { l: 'Contract Address', v: '0x742d...8e4f' },
  { l: 'Token Price', v: '$0.05 / NVT' },
  { l: 'Total Supply', v: '100,000,000 NVT' },
  { l: 'Min Investment', v: '$500 USD' },
  { l: 'Max Investment', v: '$500,000 USD' },
  { l: 'Vesting Period', v: '24 months' },
  { l: 'TGE Unlock', v: '10%' },
];

const commRates = [
  { l: 'Level 1 — Direct Referral', v: '5.0%' },
  { l: 'Level 2', v: '3.0%' },
  { l: 'Level 3', v: '1.5%' },
  { l: 'Minimum Payout', v: '$50' },
  { l: 'Payout Frequency', v: 'Monthly' },
];

export default function Settings() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Platform Settings</div>
          <div className="page-sub">Configure your Growith investment platform</div>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Token Configuration</div>
          {tokenConfig.map(({ l, v }) => (
            <div className="info-row" key={l}>
              <span className="info-label">{l}</span>
              <span style={{ fontFamily: 'DM Mono', fontSize: 12, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-title">Referral Commission Rates</div>
            {commRates.map(({ l, v }) => (
              <div className="info-row" key={l}>
                <span className="info-label">{l}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono', fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg,rgba(26,86,219,0.06),rgba(14,165,233,0.04))', border: '1px solid rgba(26,86,219,0.15)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(26,86,219,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                <Icon n="shield" size={17} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 4, fontSize: 13 }}>Phase 2 — Web3 Integration</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Smart contract automation, on-chain token distribution, MetaMask wallet connect, and real-time blockchain verification coming in Phase 2.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
