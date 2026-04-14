import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import adminService from '../../services/adminService';

const SHIVAI_ID = '69dcdd839e731266a8732e54';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function Token() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getToken(SHIVAI_ID);
      const t = res?.data?.token || res?.data?.data || res?.data || res;
      setToken(t);
    } catch (err) {
      setError(err.message || 'Failed to load token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, []);

  if (loading) {
    return (
      <div className="animate-in">
        <div className="page-header"><div><div className="page-title">ShivAI Token</div></div></div>
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading token data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in">
        <div className="page-header"><div><div className="page-title">ShivAI Token</div></div></div>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ color: 'var(--crimson)', marginBottom: 12 }}>{error}</div>
          <button className="btn btn-primary btn-sm" onClick={fetchToken}>Retry</button>
        </div>
      </div>
    );
  }

  const ticker = token?.symbol || 'SHIV';

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">{token?.name || 'ShivAI Token'}</div>
          <div className="page-sub">{token?.description || 'Token details'}</div>
        </div>
        <span className={`badge ${token?.isActive ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {token?.isActive ? '● LIVE' : '○ Inactive'}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(92,39,254,0.1)', color: '#5C27FE' }}><Icon n="token" size={17} /></div>
          <div className="stat-label">Symbol</div>
          <div className="stat-value" style={{ fontFamily: 'DM Mono' }}>{ticker}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Token ticker</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--emerald)' }}><Icon n="coins" size={17} /></div>
          <div className="stat-label">Price (USD)</div>
          <div className="stat-value">${token?.priceUsd ?? '—'}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Per token</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(26,86,219,0.1)', color: '#1a56db' }}><Icon n="airdrop" size={17} /></div>
          <div className="stat-label">Total Supply</div>
          <div className="stat-value">{Number(token?.totalSupply || 0).toLocaleString()}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Total minted</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber)' }}><Icon n="token" size={17} /></div>
          <div className="stat-label">Available Supply</div>
          <div className="stat-value">{Number(token?.availableSupply || 0).toLocaleString()}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Remaining</div>
        </div>
      </div>

      {/* Token details card */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>Token Details</div>
        <div className="kv">
          <div className="kv-item"><div className="kv-label">Token ID</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{token?.id || token?._id}</div></div>
          <div className="kv-item"><div className="kv-label">Name</div><div className="kv-value">{token?.name}</div></div>
          <div className="kv-item"><div className="kv-label">Symbol</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{ticker}</div></div>
          <div className="kv-item"><div className="kv-label">Description</div><div className="kv-value">{token?.description || '—'}</div></div>
          <div className="kv-item"><div className="kv-label">Price (USD)</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>${token?.priceUsd ?? '—'}</div></div>
          <div className="kv-item"><div className="kv-label">Network</div><div className="kv-value" style={{ textTransform: 'capitalize' }}>{token?.network || '—'}</div></div>
          <div className="kv-item"><div className="kv-label">Total Supply</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{Number(token?.totalSupply || 0).toLocaleString()}</div></div>
          <div className="kv-item"><div className="kv-label">Available Supply</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{Number(token?.availableSupply || 0).toLocaleString()}</div></div>
          <div className="kv-item"><div className="kv-label">Contract Address</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{token?.contractAddress || 'Not deployed'}</div></div>
          <div className="kv-item"><div className="kv-label">Status</div><div className="kv-value"><span className={`badge ${token?.isActive ? 'badge-green' : 'badge-gray'}`}>{token?.isActive ? 'Active' : 'Inactive'}</span></div></div>
          <div className="kv-item"><div className="kv-label">Created</div><div className="kv-value">{fmtDate(token?.createdAt)}</div></div>
          <div className="kv-item"><div className="kv-label">Last Updated</div><div className="kv-value">{fmtDate(token?.updatedAt)}</div></div>
        </div>
      </div>
    </div>
  );
}
