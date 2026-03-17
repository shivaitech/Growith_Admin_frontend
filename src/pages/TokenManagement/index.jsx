import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import { tokenList } from '../../data/mockData';

export default function TokenManagement() {
  const live = tokenList.filter((t) => t.status === 'LIVE');
  const pipeline = tokenList.filter((t) => t.status !== 'LIVE');

  const totalRaised = tokenList.reduce((s, t) => s + t.totalRaised, 0);
  const totalHolders = tokenList.reduce((s, t) => s + t.holders, 0);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Token Marketplace</div>
          <div className="page-sub">Manage all tokenised offerings on the Growith platform</div>
        </div>
        <button className="btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <Icon n="plus" size={13} /> Add Token
        </button>
      </div>

      {/* ── Summary ── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(92,39,254,0.1)', color: '#5C27FE' }}><Icon n="token" size={17} /></div>
          <div className="stat-label">Live Tokens</div>
          <div className="stat-value">{live.length}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />ShivAI active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--emerald)' }}><Icon n="coins" size={17} /></div>
          <div className="stat-label">Total Raised</div>
          <div className="stat-value">${(totalRaised / 1000).toFixed(1)}K</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />+134% MoM</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(26,86,219,0.1)', color: '#1a56db' }}><Icon n="users" size={17} /></div>
          <div className="stat-label">Total Holders</div>
          <div className="stat-value">{totalHolders}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />+19 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber)' }}><Icon n="airdrop" size={17} /></div>
          <div className="stat-label">In Pipeline</div>
          <div className="stat-value">{pipeline.length}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Awaiting launch</div>
        </div>
      </div>

      {/* ── Live tokens ── */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Live Offerings</div>
        {live.map((token) => {
          const raisePct = ((token.totalRaised / token.targetRaise) * 100).toFixed(1);
          return (
            <div key={token.id} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#5C27FE,#DEC7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {token.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 18 }}>{token.name}</span>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text3)' }}>({token.ticker})</span>
                        <span className="badge badge-green">● LIVE</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{token.description}</div>
                    </div>
                  </div>

                  {/* Key stats */}
                  <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[
                      { label: 'Issuance Price', value: `$${token.issuancePrice}` },
                      { label: 'Total Raised',   value: `$${(token.totalRaised / 1000).toFixed(1)}K` },
                      { label: 'Holders',        value: token.holders },
                      { label: 'Minted',         value: `${(token.tokensMinted / 1_000_000).toFixed(1)}M` },
                      { label: 'Network',        value: `${token.blockchain} ${token.standard}` },
                      { label: 'Lock Period',    value: token.lockPeriod },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontWeight: 600, fontFamily: 'DM Mono', fontSize: 13 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Raise progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text3)' }}>Capital Raise Progress</span>
                      <span style={{ fontFamily: 'DM Mono', fontWeight: 600, color: 'var(--accent)' }}>
                        ${token.totalRaised.toLocaleString()} / ${(token.targetRaise / 1_000_000).toFixed(0)}M ({raisePct}%)
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 8, borderRadius: 6 }}>
                      <div className="progress-fill" style={{ width: `${raisePct}%`, borderRadius: 6 }} />
                    </div>
                  </div>

                  {/* Contract */}
                  {token.contractAddress && (
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
                      Contract: {token.contractAddress}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  <Link to="/token/shivai" className="btn btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Open Dashboard →
                  </Link>
                  {token.pendingMints > 0 && (
                    <Link to="/token/shivai" className="btn" style={{ textDecoration: 'none', textAlign: 'center', background: 'rgba(217,119,6,0.1)', color: 'var(--amber)', borderColor: 'rgba(217,119,6,0.3)' }}>
                      <Icon n="token" size={12} /> {token.pendingMints} Pending Mints
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pipeline ── */}
      <div>
        <div className="section-title" style={{ marginBottom: 14 }}>In Pipeline</div>
        <div className="grid-3">
          {pipeline.map((token) => (
            <div key={token.id} className="card" style={{ opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontWeight: 700, fontSize: 12 }}>
                  {token.ticker.slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{token.name} <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>({token.ticker})</span></div>
                  <span className="badge badge-gray" style={{ fontSize: 10 }}>COMING SOON</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>{token.description}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text3)' }}>
                <span>Network: {token.blockchain}/{token.standard}</span>
                <span>Est: {token.launchDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
