import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Initials from '../../components/common/Initials';
import adminService from '../../services/adminService';
import { tokenInvestors, pendingMints, vestingSchedule, shivaiRaiseHistory } from '../../data/mockData';

const SHIVAI_ID = '69dcdd839e731266a8732e54';

const ALLOCATION = [
  { label: 'Public Sale',          pct: 40, color: '#5C27FE' },
  { label: 'Ecosystem Fund',       pct: 20, color: '#7c3aed' },
  { label: 'Team & Advisors',      pct: 15, color: '#a855f7' },
  { label: 'Treasury Reserve',     pct: 15, color: '#c084fc' },
  { label: 'Liquidity & Partners', pct: 10, color: '#ddd6fe' },
];

const RECENT_ACTIVITY = [
  { actor: 'Chen Wei',       detail: 'Payment confirmed — pending mint',    amount: '$110,000 USDT', time: '2h ago',  color: '#d97806' },
  { actor: 'Arjun Mehta',   detail: 'Tokens minted successfully',           amount: '4,250,000 SHVAI', time: '1d ago', color: '#059669' },
  { actor: "James O'Brien", detail: 'Tokens minted successfully',           amount: '9,500,000 SHVAI', time: '2d ago', color: '#059669' },
  { actor: 'Yuki Tanaka',   detail: 'KYC submitted — under manual review',  amount: null,           time: '3d ago',  color: '#6366f1' },
  { actor: 'Marco Bianchi', detail: 'Payment confirmed — minted',           amount: '$67,000 SWIFT', time: '3d ago', color: '#059669' },
];

const TABS = ['Overview', 'Investors', 'Mint Queue', 'Vesting', 'Settings'];

const MINT_STATUS_BADGE = {
  'Minted':       'badge badge-green',
  'Pending Mint': 'badge badge-amber',
  'KYC Review':   'badge badge-amber',
  'KYC Pending':  'badge badge-gray',
};

export default function ShivAI() {
  const [tab, setTab]                   = useState('Overview');
  const [investorFilter, setInvFilter]  = useState('All');
  const [mintActions, setMintActions]   = useState({});
  const [copied, setCopied]             = useState(false);

  // Real token data
  const [token, setToken]         = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError]     = useState(null);

  useEffect(() => {
    adminService.getToken(SHIVAI_ID)
      .then((res) => {
        const t = res?.data?.token || res?.data?.data || res?.data || res;
        setToken(t);
      })
      .catch((err) => setTokenError(err.message || 'Failed to load token'))
      .finally(() => setTokenLoading(false));
  }, []);

  const [settings, setSettings] = useState({
    name: '', ticker: '', supply: '', price: '', network: '', access: 'OPEN',
  });

  // Populate settings once token loads
  useEffect(() => {
    if (token) {
      setSettings({
        name:    token.name    || '',
        ticker:  token.symbol  || '',
        supply:  String(token.totalSupply || ''),
        price:   String(token.priceUsd    || ''),
        network: token.network || '',
        access:  'OPEN',
      });
    }
  }, [token]);

  const ticker   = token?.symbol || 'SHIV';
  const network  = token?.network || '—';
  const maxRaise = Math.max(...shivaiRaiseHistory.map((r) => r.raised));

  const filteredInvestors =
    investorFilter === 'All'     ? tokenInvestors :
    investorFilter === 'Minted'  ? tokenInvestors.filter((i) => i.mintStatus === 'Minted') :
    investorFilter === 'Pending' ? tokenInvestors.filter((i) => i.mintStatus === 'Pending Mint') :
                                   tokenInvestors.filter((i) => i.mintStatus.includes('KYC'));

  const vestingReleased = vestingSchedule.filter((v) => v.status === 'Released').reduce((s, v) => s + v.pct, 0);
  const totalAllocated  = tokenInvestors.reduce((s, i) => s + i.tokens, 0);
  const totalInvested   = tokenInvestors.reduce((s, i) => s + i.invested, 0);

  const copyAddress = () => {
    const addr = token?.contractAddress;
    if (!addr) return;
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const settingField = (label, key, readOnly = false) => (
    <div key={label}>
      <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{label}</label>
      <input
        type="text"
        value={settings[key]}
        readOnly={readOnly}
        onChange={(e) => !readOnly && setSettings((p) => ({ ...p, [key]: e.target.value }))}
        style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: readOnly ? 'var(--text3)' : 'var(--text)', fontSize: 13, fontFamily: key === 'price' ? 'DM Mono' : 'inherit', boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <div className="animate-in">
      {tokenLoading && (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', marginBottom: 20 }}>Loading token data…</div>
      )}
      {tokenError && (
        <div className="card" style={{ padding: 24, color: 'var(--crimson)', marginBottom: 20 }}>{tokenError}</div>
      )}

      {/* ── HEADER ── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#5C27FE,#DEC7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>AI</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="page-title" style={{ marginBottom: 0 }}>{token?.name || 'ShivAI Token'}</span>
                <span style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text3)' }}>{ticker}</span>
                <span className={`badge ${token?.isActive ? 'badge-green' : 'badge-gray'}`}>{token?.isActive ? '● LIVE' : '○ Inactive'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'capitalize' }}>{network} · Launched {token?.createdAt ? new Date(token.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div>
            </div>
          </div>
          {token?.contractAddress ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text3)' }}>
              <span>Contract:</span>
              <span style={{ fontFamily: 'DM Mono' }}>{token.contractAddress}</span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#059669' : 'var(--text3)', padding: '0 2px' }} title="Copy address">
                <Icon n={copied ? 'check' : 'copy'} size={12} />
              </button>
              {copied && <span style={{ color: '#059669', fontSize: 11 }}>Copied!</span>}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Contract: Not deployed</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/token" style={{ textDecoration: 'none' }} className="btn">← All Tokens</Link>
          <button className="btn btn-primary" onClick={() => setTab('Mint Queue')}>
            <Icon n="token" size={13} /> Mint Queue
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="card" style={{ padding: 0, marginBottom: 20, overflowX: 'auto' }}>
        <div className="tabs" style={{ padding: '0 16px', flexWrap: 'nowrap', width: 'max-content', minWidth: '100%' }}>
          {TABS.map((t) => (
            <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              {t}
              {t === 'Mint Queue' && pendingMints.length > 0 && (
                <span className="nav-badge">{pendingMints.length}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* TAB: OVERVIEW                                   */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === 'Overview' && (
        <>
          {/* 6 KPI cards */}
          <div className="grid-3" style={{ marginBottom: 18 }}>
            {[
              { label: 'Price (USD)',      value: token?.priceUsd != null ? `$${token.priceUsd}` : '—',                  sub: 'Per token',                                                        icon: 'coins',     color: '#059669', up: null },
              { label: 'Total Supply',    value: Number(token?.totalSupply || 0).toLocaleString(),                            sub: `${ticker} total`,                                                  icon: 'token',     color: '#5C27FE', up: null },
              { label: 'Available',       value: Number(token?.availableSupply || 0).toLocaleString(),                        sub: 'Available tokens',                                                 icon: 'airdrop',   color: '#d97806', up: null },
              { label: 'Network',         value: token?.network ? token.network.charAt(0).toUpperCase() + token.network.slice(1) : '—', sub: 'Blockchain',                                        icon: 'payment',   color: '#6366f1', up: null },
              { label: 'Status',          value: token?.isActive ? 'Active' : 'Inactive',                                    sub: token?.isActive ? 'Token is live' : 'Token inactive',              icon: 'shield',    color: token?.isActive ? '#059669' : '#6b7280', up: null },
              { label: 'Supply Used',     value: token?.totalSupply > 0 ? `${(((token.totalSupply - (token.availableSupply || 0)) / token.totalSupply) * 100).toFixed(1)}%` : '—', sub: 'Of total supply allocated', icon: 'affiliate', color: '#7c3aed', up: null },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}><Icon n={s.icon} size={17} /></div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-delta" style={{ color: 'var(--text3)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Token info card */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Token Info</div>
            </div>
            <div className="kv">
              <div className="kv-item"><div className="kv-label">Token ID</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{token?.id || token?._id || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Description</div><div className="kv-value">{token?.description || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Contract</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{token?.contractAddress || 'Not deployed'}</div></div>
              <div className="kv-item"><div className="kv-label">Created</div><div className="kv-value">{token?.createdAt ? new Date(token.createdAt).toLocaleString() : '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Updated</div><div className="kv-value">{token?.updatedAt ? new Date(token.updatedAt).toLocaleString() : '—'}</div></div>
            </div>
          </div>

          {/* 2-col: Monthly raise + Token allocation */}
          <div className="grid-2" style={{ marginBottom: 18 }}>
            <div className="card">
              <div className="section-title">Monthly Raise History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                {shivaiRaiseHistory.map((r, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                      <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{r.month}</span>
                      <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>
                        ${r.raised.toLocaleString()} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>· {r.investors} investors</span>
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 7 }}>
                      <div className="progress-fill" style={{ width: `${(r.raised / maxRaise) * 100}%`, background: i === shivaiRaiseHistory.length - 1 ? 'var(--accent)' : 'var(--accent2)', borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Token Allocation Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                {ALLOCATION.map((a, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                        <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{a.label}</span>
                      </div>
                      <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>
                        {a.pct}% <span style={{ color: 'var(--text3)', fontWeight: 400 }}>({((token?.totalSupply || 0) * a.pct / 100).toLocaleString()})</span>
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 7 }}>
                      <div style={{ height: '100%', width: `${a.pct}%`, background: a.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2-col: Recent activity + Top holders */}
          <div className="grid-2">
            <div className="card">
              <div className="section-title">Recent Activity</div>
              <div style={{ marginTop: 12 }}>
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{a.actor}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{a.detail}</div>
                      {a.amount && <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: a.color, marginTop: 2 }}>{a.amount}</div>}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Top Token Holders</div>
              <div style={{ marginTop: 12 }}>
                {[...tokenInvestors].sort((a, b) => b.tokens - a.tokens).map((inv, i) => (
                  <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < tokenInvestors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 20, textAlign: 'right', fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono', fontWeight: 700, flexShrink: 0 }}>#{i + 1}</div>
                    <Initials name={inv.name} size={28} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.name}</div>
                      <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{inv.tokens.toLocaleString()} SHVAI</div>
                    </div>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>${inv.invested.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TAB: INVESTORS                                  */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === 'Investors' && (
        <>
          {/* Summary chips */}
          <div className="filter-bar" style={{ marginBottom: 16 }}>
            {[
              { label: 'Total Investors', value: tokenInvestors.length },
              { label: 'KYC Approved',   value: tokenInvestors.filter((i) => i.kyc === 'Approved').length },
              { label: 'Minted',         value: tokenInvestors.filter((i) => i.mintStatus === 'Minted').length },
              { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}` },
              { label: 'Total Allocated', value: `${(totalAllocated / 1_000_000).toFixed(1)}M SHVAI` },
            ].map((s) => (
              <span key={s.label} className="chip">
                <span style={{ color: 'var(--text3)', fontSize: 11 }}>{s.label}: </span>
                <span style={{ fontWeight: 700, fontFamily: 'DM Mono' }}>{s.value}</span>
              </span>
            ))}
          </div>

          {/* Filter + export */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tabs" style={{ margin: 0 }}>
              {['All', 'Minted', 'Pending', 'KYC Issues'].map((f) => (
                <div key={f} className={`tab${investorFilter === f ? ' active' : ''}`} onClick={() => setInvFilter(f)} style={{ cursor: 'pointer' }}>{f}</div>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn" style={{ fontSize: 12 }}><Icon n="filter" size={12} /> Export CSV</button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Investor</th><th>Country</th><th>Invested</th><th>Tokens Held</th>
                    <th>Vesting</th><th>Lock Expiry</th><th>Mint Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvestors.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Initials name={inv.name} size={30} />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{inv.name}</div>
                            <div className="td-muted">{inv.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{inv.country}</span></td>
                      <td style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>${inv.invested.toLocaleString()}</td>
                      <td style={{ fontFamily: 'DM Mono', color: 'var(--accent)', fontWeight: 700 }}>{inv.tokens.toLocaleString()}</td>
                      <td>
                        {inv.vestingPct > 0 ? (
                          <div style={{ minWidth: 110 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3, color: 'var(--text3)' }}>
                              <span>Vested</span><span style={{ fontFamily: 'DM Mono' }}>{inv.vestingPct}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${inv.vestingPct}%` }} /></div>
                          </div>
                        ) : <span className="td-muted">Not started</span>}
                      </td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{inv.lockExpiry || <span className="td-muted">—</span>}</td>
                      <td><span className={MINT_STATUS_BADGE[inv.mintStatus] || 'badge badge-gray'}>{inv.mintStatus}</span></td>
                      <td>
                        {inv.mintStatus === 'Pending Mint' && (
                          <button className="btn" style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(92,39,254,0.12)', color: '#5C27FE', borderColor: 'rgba(92,39,254,0.3)' }} onClick={() => setTab('Mint Queue')}>
                            Mint Now
                          </button>
                        )}
                        {inv.mintStatus === 'Minted' && <span style={{ fontSize: 11, color: 'var(--text3)' }}>Minted {inv.mintDate}</span>}
                        {inv.mintStatus.includes('KYC') && <span className="td-muted" style={{ fontSize: 11 }}>Awaiting KYC</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TAB: MINT QUEUE                                 */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === 'Mint Queue' && (
        <>
          {pendingMints.filter((m) => !mintActions[m.id]).length > 0 ? (
            <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon n="token" size={16} />
              <span style={{ fontWeight: 600 }}>
                {pendingMints.filter((m) => !mintActions[m.id]).length} payment{pendingMints.filter((m) => !mintActions[m.id]).length > 1 ? 's' : ''} awaiting token minting
              </span>
              <span style={{ color: 'var(--text3)', fontSize: 13 }}>
                · Total: ${pendingMints.filter((m) => !mintActions[m.id]).reduce((s, m) => s + m.amount, 0).toLocaleString()}
                · {pendingMints.filter((m) => !mintActions[m.id]).reduce((s, m) => s + m.tokens, 0).toLocaleString()} SHVAI
              </span>
            </div>
          ) : (
            <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon n="check" size={16} />
              <span style={{ fontWeight: 600 }}>All mints processed — queue is empty.</span>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mint ID</th><th>Investor</th><th>Amount</th><th>Tokens</th>
                    <th>Payment Ref</th><th>Method</th><th>Date</th><th>KYC</th><th>Wallet</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMints.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--accent)' }}>{m.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Initials name={m.investor} size={28} />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 13 }}>{m.investor}</div>
                            <div className="td-muted">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>${m.amount.toLocaleString()}</td>
                      <td style={{ fontFamily: 'DM Mono', color: 'var(--accent)', fontWeight: 700 }}>{m.tokens.toLocaleString()}</td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{m.paymentRef}</td>
                      <td><span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>{m.method}</span></td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{m.paymentDate}</td>
                      <td><span className="badge badge-green" style={{ fontSize: 11 }}>{m.kyc}</span></td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.wallet}</td>
                      <td>
                        {mintActions[m.id] === 'minted' ? (
                          <span className="badge badge-green">Minted ✓</span>
                        ) : mintActions[m.id] === 'rejected' ? (
                          <span className="badge badge-red">Rejected</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-primary" style={{ fontSize: 11, padding: '4px 10px' }}
                              onClick={() => setMintActions((p) => ({ ...p, [m.id]: 'minted' }))}>
                              Mint
                            </button>
                            <button className="btn" style={{ fontSize: 11, padding: '4px 10px', color: 'var(--red)', borderColor: 'var(--red)' }}
                              onClick={() => setMintActions((p) => ({ ...p, [m.id]: 'rejected' }))}>
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TAB: VESTING                                    */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === 'Vesting' && (
        <>
          {/* Summary stats */}
          <div className="grid-4" style={{ marginBottom: 18 }}>
            {[
              { label: 'Vesting Released',  value: `${vestingReleased}%`,   sub: `${vestingSchedule.filter((v) => v.status === 'Released' && v.pct > 0).reduce((s, v) => s + v.tokens, 0).toLocaleString()} SHVAI`, color: '#059669' },
              { label: 'Remaining Unlock',  value: `${100 - vestingReleased}%`, sub: 'Across future milestones',       color: '#d97806' },
              { label: 'Lock Period',       value: '12 months',              sub: 'From individual mint date',          color: '#5C27FE' },
              { label: 'Next Release',      value: 'Month 9',                sub: 'Jan 2025 — 15% unlock',              color: '#6366f1' },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ fontSize: 18, color: s.color }}>{s.value}</div>
                <div className="stat-delta" style={{ color: 'var(--text3)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Policy */}
          <div className="card" style={{ marginBottom: 18, background: 'rgba(92,39,254,0.04)', borderColor: 'rgba(92,39,254,0.18)' }}>
            <div className="section-title">Vesting Policy</div>
            <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7, marginTop: 8 }}>
              ShivAI tokens are subject to a <strong>12-month lock-in period</strong> from each investor's individual mint date. No tokens are released at TGE.
              Subsequent unlocks happen at scheduled milestones: <strong>10%</strong> at Month 3, <strong>15%</strong> at Month 6,
              then equal tranches through Month 24. This structure prevents market flooding while rewarding long-term holders.
              All vesting is enforced at the smart contract level on Polygon mainnet.
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="section-title">Vesting Schedule</div>
            <div style={{ marginTop: 20, paddingLeft: 8 }}>
              {vestingSchedule.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, paddingBottom: 24 }}>
                  {/* Dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: v.status === 'Released' ? '#059669' : 'var(--bg2)', border: `2px solid ${v.status === 'Released' ? '#059669' : 'var(--border)'}`, transition: 'all 0.2s', flexShrink: 0, marginTop: 2 }} />
                    {i < vestingSchedule.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: v.status === 'Released' ? '#059669' : 'var(--border)', marginTop: 4 }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{v.milestone}</span>
                        <span style={{ color: 'var(--text3)', fontSize: 13, marginLeft: 10 }}>— {v.date}</span>
                        {v.note && <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8, fontStyle: 'italic' }}>({v.note})</span>}
                      </div>
                      <span className={`badge ${v.status === 'Released' ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: 11 }}>{v.status}</span>
                    </div>
                    {v.pct > 0 && (
                      <>
                        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>
                          <span style={{ fontFamily: 'DM Mono', fontWeight: 700, color: v.status === 'Released' ? '#059669' : 'var(--accent)' }}>{v.pct}%</span>
                          <span style={{ color: 'var(--text3)', marginLeft: 8 }}>· {v.tokens.toLocaleString()} SHVAI · {v.releaseType}</span>
                        </div>
                        <div className="progress-bar" style={{ height: 5, maxWidth: 320 }}>
                          <div style={{ height: '100%', width: `${v.pct * 2}%`, background: v.status === 'Released' ? '#059669' : 'var(--accent)', borderRadius: 4 }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TAB: SETTINGS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === 'Settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Token Config */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>Token Configuration</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 16 }}>
              {[['Token Name', 'name'], ['Symbol', 'ticker'], ['Total Supply', 'supply', true], ['Price (USD)', 'price'], ['Network', 'network', true]].map(([label, key, readOnly]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    type="text"
                    value={settings[key] || ''}
                    readOnly={!!readOnly}
                    onChange={(e) => !readOnly && setSettings((p) => ({ ...p, [key]: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: readOnly ? 'var(--text3)' : 'var(--text)', fontSize: 13, fontFamily: key === 'price' || key === 'supply' ? 'DM Mono' : 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Investment Rules */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>Offering Status</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {['OPEN', 'INVITE_ONLY', 'CLOSED'].map((s) => (
                <button
                  key={s}
                  className={`btn${s === settings.access ? ' btn-primary' : ''}`}
                  style={{ fontSize: 12 }}
                  onClick={() => setSettings((p) => ({ ...p, access: s }))}
                >{s}</button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text3)', margin: 0 }}>
              <strong>OPEN</strong> — All KYC-approved users can invest.&nbsp;
              <strong>INVITE_ONLY</strong> — Requires access codes.&nbsp;
              <strong>CLOSED</strong> — No new investments accepted.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn">Discard</button>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
