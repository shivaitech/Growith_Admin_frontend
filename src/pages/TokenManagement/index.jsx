import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import adminService from '../../services/adminService';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const normalizeStatus = (s = '') => {
  const u = s.toUpperCase();
  if (u === 'APPROVED' || u === 'ACCEPTED') return 'Approved';
  if (u === 'REJECTED') return 'Rejected';
  return 'Pending';
};

const PAGE_TABS = ['Marketplace', 'Token Requests'];

export default function TokenManagement() {
  const [pageTab, setPageTab] = useState('Marketplace');
  const toast = useToast();

  // ── Token Requests state ──────────────────────────────────────────
  const [requests, setRequests]         = useState([]);
  const [reqLoading, setReqLoading]     = useState(true);
  const [reqError, setReqError]         = useState(null);
  const [reqFilter, setReqFilter]       = useState('All');
  const [viewReq, setViewReq]           = useState(null);
  // approve modal
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveNote, setApproveNote]   = useState('');
  const [airdropRef, setAirdropRef]     = useState('');
  // reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote]     = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // ── Fetch Shiv AI token ──────────────────────────────────────────
  const SHIVAI_ID = '69dcdd839e731266a8732e54';
  const [shivToken, setShivToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState(null);

  const fetchToken = async () => {
    setTokenLoading(true);
    setTokenError(null);
    try {
      const res = await adminService.getToken(SHIVAI_ID);
      const t = res?.data?.token || res?.data?.data || res?.data || res;
      setShivToken(t);
    } catch (err) {
      setTokenError(err.message || 'Failed to load token data');
    } finally {
      setTokenLoading(false);
    }
  };

  // ── Fetch token requests ──────────────────────────────────────────
  const fetchRequests = async () => {
    setReqLoading(true);
    setReqError(null);
    try {
      const res = await adminService.getTokenRequests();
      const list = res?.data?.data || res?.data?.requests || res?.data || res || [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      setReqError(err.message || 'Failed to load token requests');
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); fetchToken(); }, []);

  // ── Accept request ────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!approveTarget) return;
    try {
      setActionLoading(approveTarget + 'accept');
      await adminService.approveTokenRequest(approveTarget, {
        ...(approveNote.trim() ? { adminNote: approveNote.trim() } : {}),
        ...(airdropRef.trim()  ? { airdropReference: airdropRef.trim() } : {}),
      });
      setApproveTarget(null);
      setApproveNote('');
      setAirdropRef('');
      await fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject request ────────────────────────────────────────────────
  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    try {
      setActionLoading(rejectTarget + 'reject');
      await adminService.rejectTokenRequest(rejectTarget, rejectReason.trim(), rejectNote.trim());
      setRejectTarget(null);
      setRejectReason('');
      setRejectNote('');
      await fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingReqs  = requests.filter((r) => normalizeStatus(r.status) === 'Pending');
  const approvedReqs = requests.filter((r) => normalizeStatus(r.status) === 'Approved');
  const rejectedReqs = requests.filter((r) => normalizeStatus(r.status) === 'Rejected');

  const displayedReqs =
    reqFilter === 'Pending'  ? pendingReqs  :
    reqFilter === 'Approved' ? approvedReqs :
    reqFilter === 'Rejected' ? rejectedReqs :
    requests;

  return (
    <div className="animate-in">
      {/* ── View Request Modal ── */}
      {viewReq && (() => {
        const vStatus = normalizeStatus(viewReq.status);
        const vColor = vStatus === 'Approved' ? 'var(--emerald)' : vStatus === 'Rejected' ? 'var(--red)' : 'var(--amber)';
        const vBg = vStatus === 'Approved' ? 'rgba(5,150,105,0.08)' : vStatus === 'Rejected' ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.08)';
        return (
          <Modal
            title="Token Request"
            sub={`${viewReq.user?.fullName || '—'} · ${viewReq.tokenName || '—'} (${viewReq.ticker || ''})`}
            onClose={() => setViewReq(null)}
          >
            {/* Status banner */}
            <div style={{ background: vBg, border: `1px solid ${vColor}33`, borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>Request #{String(viewReq.id || viewReq._id).slice(-8)}</span>
              <span style={{ background: vColor, color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                {vStatus === 'Pending' ? '⏳' : vStatus === 'Approved' ? '✓' : '✕'} {vStatus}
              </span>
            </div>

            {/* Screenshot */}
            {viewReq.screenshotUrl && (
              <a href={viewReq.screenshotUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                  src={viewReq.screenshotUrl}
                  alt="Payment screenshot"
                  style={{ width: '100%', maxHeight: 240, objectFit: 'contain', background: 'var(--surface2)', display: 'block' }}
                />
                <div style={{ padding: '8px 12px', background: 'var(--surface2)', fontSize: 11, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon n="eye" size={11} /> View full screenshot ↗
                </div>
              </a>
            )}

            {/* Highlight: Amount + Qty */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Investment</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--emerald)', fontFamily: 'DM Mono', lineHeight: 1 }}>${Number(viewReq.amountUsd || 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>USD</div>
              </div>
              <div style={{ background: 'rgba(92,39,254,0.06)', border: '1px solid rgba(92,39,254,0.12)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Tokens</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#5C27FE', fontFamily: 'DM Mono', lineHeight: 1 }}>{Number(viewReq.tokenQty || 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{viewReq.ticker || 'tokens'}</div>
              </div>
            </div>

            {/* Details grid */}
            <div className="kv" style={{ marginBottom: 14 }}>
              <div className="kv-item"><div className="kv-label">Investor</div><div className="kv-value">{viewReq.user?.fullName || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value" style={{ fontSize: 12 }}>{viewReq.user?.email || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Token</div><div className="kv-value">{viewReq.tokenName || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Ticker</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{viewReq.ticker || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Payment Method</div><div className="kv-value">{viewReq.method || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Purchase Ref</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewReq.purchaseRef || '—'}</div></div>
              <div className="kv-item"><div className="kv-label">Requested</div><div className="kv-value">{fmtDate(viewReq.createdAt)}</div></div>
              {viewReq.reviewedBy && (
                <div className="kv-item"><div className="kv-label">Reviewed By</div><div className="kv-value">{viewReq.reviewedBy?.fullName || viewReq.reviewedBy}</div></div>
              )}
              {viewReq.reviewedAt && (
                <div className="kv-item"><div className="kv-label">Reviewed At</div><div className="kv-value">{fmtDate(viewReq.reviewedAt)}</div></div>
              )}
            </div>

            {/* Notes / extras */}
            {(viewReq.adminNote || viewReq.rejectionReason || viewReq.airdropReference) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {viewReq.adminNote && (
                  <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Note · </span>
                    {viewReq.adminNote}
                  </div>
                )}
                {viewReq.rejectionReason && (
                  <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--red)' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rejection Reason · </span>
                    {viewReq.rejectionReason}
                  </div>
                )}
                {viewReq.airdropReference && (
                  <div style={{ background: 'rgba(92,39,254,0.05)', border: '1px solid rgba(92,39,254,0.12)', borderRadius: 8, padding: '10px 12px', fontSize: 13 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Airdrop Ref · </span>
                    <span style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewReq.airdropReference}</span>
                  </div>
                )}
              </div>
            )}

            {vStatus === 'Pending' && (
              <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                <button
                  className="btn btn-success btn-sm"
                  disabled={!!actionLoading}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => { setApproveTarget(viewReq.id || viewReq._id); setViewReq(null); }}
                >
                  <Icon n="check" size={13} /> Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={!!actionLoading}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => { setRejectTarget(viewReq.id || viewReq._id); setViewReq(null); }}
                >
                  <Icon n="x" size={13} /> Reject
                </button>
              </div>
            )}
          </Modal>
        );
      })()}

      {/* ── Approve Modal ── */}
      {approveTarget && (
        <Modal title="Approve Token Request" sub="Optional: add a note or airdrop reference" onClose={() => { setApproveTarget(null); setApproveNote(''); setAirdropRef(''); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Admin Note (optional)</label>
              <input
                type="text"
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="e.g. Payment verified"
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Airdrop Reference (optional)</label>
              <input
                type="text"
                value={airdropRef}
                onChange={(e) => setAirdropRef(e.target.value)}
                placeholder="e.g. TRX-123"
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, boxSizing: 'border-box', fontFamily: 'DM Mono' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => { setApproveTarget(null); setApproveNote(''); setAirdropRef(''); }}>Cancel</button>
            <button
              className="btn btn-success btn-sm"
              style={{ flex: 1 }}
              disabled={!!actionLoading}
              onClick={handleAccept}
            >
              {actionLoading ? '…' : <><Icon n="check" size={13} /> Confirm Approve</>}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reject Reason Modal ── */}
      {rejectTarget && (
        <Modal title="Reject Token Request" sub="Rejection reason is required" onClose={() => { setRejectTarget(null); setRejectReason(''); setRejectNote(''); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Rejection Reason *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Screenshot does not match the transfer amount"
                rows={3}
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, resize: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text3)', display: 'block', marginBottom: 4 }}>Admin Note (optional)</label>
              <input
                type="text"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g. Image mismatch"
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13, boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => { setRejectTarget(null); setRejectReason(''); setRejectNote(''); }}>Cancel</button>
            <button
              className="btn btn-danger btn-sm"
              style={{ flex: 1 }}
              disabled={!rejectReason.trim() || !!actionLoading}
              onClick={handleReject}
            >
              {actionLoading ? '…' : <><Icon n="x" size={13} /> Confirm Reject</>}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Token Marketplace</div>
          <div className="page-sub">Manage all tokenised offerings on the Growith platform</div>
        </div>
        <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', padding: '10px 20px', fontSize: 14, fontWeight: 600, gap: 8 }}>
          <Icon n="plus" size={15} /> Add Token
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {PAGE_TABS.map((t) => (
          <button
            key={t}
            className={`tab ${pageTab === t ? 'active' : ''}`}
            onClick={() => setPageTab(t)}
          >
            {t}
            {t === 'Token Requests' && pendingReqs.length > 0 && (
              <span className="badge badge-amber" style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px' }}>{pendingReqs.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          MARKETPLACE TAB
      ══════════════════════════════════════════ */}
      {pageTab === 'Marketplace' && (
        <>
      {/* ── Summary ── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(92,39,254,0.1)', color: '#5C27FE' }}><Icon n="token" size={17} /></div>
          <div className="stat-label">Live Tokens</div>
          <div className="stat-value">{shivToken ? 1 : '—'}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />{shivToken?.name || 'ShivAI'} active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--emerald)' }}><Icon n="coins" size={17} /></div>
          <div className="stat-label">Total Supply</div>
          <div className="stat-value">
            {shivToken ? Number(shivToken.totalSupply || 0).toLocaleString() : '—'}
          </div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />Total supply</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(26,86,219,0.1)', color: '#1a56db' }}><Icon n="users" size={17} /></div>
          <div className="stat-label">Available Supply</div>
          <div className="stat-value">{shivToken ? Number(shivToken.availableSupply || 0).toLocaleString() : '—'}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber)' }}><Icon n="airdrop" size={17} /></div>
          <div className="stat-label">Price (USD)</div>
          <div className="stat-value">
            {shivToken ? `$${shivToken.priceUsd ?? '—'}` : '—'}
          </div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>Per token</div>
        </div>
      </div>

      {/* ── Live tokens ── */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Live Offerings</div>
        {tokenLoading ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading token data…</div>
        ) : tokenError ? (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ color: 'var(--crimson)', marginBottom: 10 }}>{tokenError}</div>
            <button className="btn btn-sm btn-primary" onClick={fetchToken}>Retry</button>
          </div>
        ) : shivToken ? (() => {
          const ticker = shivToken.symbol || 'SHIV';
          const network = shivToken.network || '—';
          return (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#5C27FE,#DEC7FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 18 }}>{shivToken.name}</span>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text3)' }}>({ticker})</span>
                        <span className="badge badge-green">● LIVE</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{shivToken.description}</div>
                    </div>
                  </div>

                  {/* Key stats */}
                  <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[
                      { label: 'Price (USD)',      value: shivToken.priceUsd != null ? `$${shivToken.priceUsd}` : '—' },
                      { label: 'Total Supply',    value: Number(shivToken.totalSupply || 0).toLocaleString() },
                      { label: 'Available',       value: Number(shivToken.availableSupply || 0).toLocaleString() },
                      { label: 'Network',         value: network },
                      { label: 'Status',          value: shivToken.isActive ? 'Active' : 'Inactive' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontWeight: 600, fontFamily: 'DM Mono', fontSize: 13 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Raise progress — hidden (no raise data in API) */}

                  {/* Contract */}
                  {(shivToken.contractAddress || shivToken.contract) && (
                    <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
                      Contract: {shivToken.contractAddress || shivToken.contract}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                  <Link to="/token/shivai" className="btn btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Open Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          );
        })() : (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>No token data found.</div>
        )}
      </div>


        </>
      )}

      {/* ══════════════════════════════════════════
          TOKEN REQUESTS TAB
      ══════════════════════════════════════════ */}
      {pageTab === 'Token Requests' && (
        <>
          {/* ── Toolbar ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: 'All',      count: requests.length },
                { label: 'Pending',  count: pendingReqs.length },
                { label: 'Approved', count: approvedReqs.length },
                { label: 'Rejected', count: rejectedReqs.length },
              ].map(({ label, count }) => {
                const active = reqFilter === label;
                const accent = label === 'Pending' ? 'var(--amber)' : label === 'Approved' ? 'var(--emerald)' : label === 'Rejected' ? 'var(--red)' : 'var(--accent)';
                return (
                  <button
                    key={label}
                    onClick={() => setReqFilter(label)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
                      background: active ? accent : 'var(--surface)',
                      color: active ? '#fff' : 'var(--text2)',
                      boxShadow: active ? `0 2px 8px ${accent}44` : '0 1px 3px rgba(0,0,0,0.06)',
                      outline: active ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {label}
                    {count > 0 && (
                      <span style={{
                        background: active ? 'rgba(255,255,255,0.25)' : 'var(--surface2)',
                        color: active ? '#fff' : 'var(--text3)',
                        borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Refresh */}
            <button
              className="btn btn-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)', gap: 6 }}
              onClick={fetchRequests}
              disabled={reqLoading}
            >
              <Icon n="refresh" size={13} /> Refresh
            </button>
          </div>

          {/* ── Summary strip ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Requests', value: requests.length, color: 'var(--accent)', bg: 'rgba(26,86,219,0.07)' },
              { label: 'Pending Review', value: pendingReqs.length, color: 'var(--amber)', bg: 'rgba(217,119,6,0.07)' },
              { label: 'Approved', value: approvedReqs.length, color: 'var(--emerald)', bg: 'rgba(5,150,105,0.07)' },
              { label: 'Rejected', value: rejectedReqs.length, color: 'var(--red)', bg: 'rgba(220,38,38,0.07)' },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'DM Mono', lineHeight: 1 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── List ── */}
          {reqLoading ? (
            <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading token requests…</div>
          ) : reqError ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ color: 'var(--red)', marginBottom: 12, fontWeight: 500 }}>{reqError}</div>
              <button className="btn btn-primary btn-sm" onClick={fetchRequests}>Retry</button>
            </div>
          ) : displayedReqs.length === 0 ? (
            <div className="card" style={{ padding: 56, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text2)', marginBottom: 6 }}>No requests found</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>No {reqFilter !== 'All' ? reqFilter.toLowerCase() + ' ' : ''}token requests at the moment.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayedReqs.map((r) => {
                const id = r._id || r.id;
                const name = r.user?.fullName || '—';
                const email = r.user?.email || '';
                const status = normalizeStatus(r.status);
                const isPending = status === 'Pending';
                const statusColor = status === 'Approved' ? 'var(--emerald)' : status === 'Rejected' ? 'var(--red)' : 'var(--amber)';
                const statusBg = status === 'Approved' ? 'rgba(5,150,105,0.08)' : status === 'Rejected' ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.08)';

                return (
                  <div
                    key={id}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      transition: 'box-shadow 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--accent)44'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {/* Left: info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '10px 20px', alignItems: 'start' }}>

                      {/* Investor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <Initials name={name} gradient="linear-gradient(135deg,#5C27FE,#DEC7FF)" />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                          {email && <div style={{ fontSize: 11, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>}
                          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, fontFamily: 'DM Mono' }}>#{String(id).slice(-8)}</div>
                        </div>
                      </div>

                      {/* Token */}
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Token</div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{r.tokenName || '—'}</div>
                        <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{r.ticker || ''}</div>
                      </div>

                      {/* Amount */}
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Investment</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--emerald)', fontFamily: 'DM Mono' }}>${Number(r.amountUsd || 0).toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>USD</div>
                      </div>

                      {/* Token qty */}
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Token Qty</div>
                        <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'DM Mono' }}>{Number(r.tokenQty || 0).toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.ticker || 'tokens'}</div>
                      </div>

                      {/* Ref & Date */}
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Payment Ref</div>
                        <div style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text2)' }}>{r.purchaseRef || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{fmtDate(r.createdAt)}</div>
                      </div>

                      {/* Method */}
                      {r.method && (
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Method</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>{r.method}</div>
                        </div>
                      )}
                    </div>

                    {/* Right: status + actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, minWidth: 0 }}>
                      {/* Status */}
                      <div style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}33`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {status === 'Pending' ? '⏳' : status === 'Approved' ? '✓' : '✕'} {status}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch', width: '100%', minWidth: 110 }}>
                        <button
                          className="btn btn-sm"
                          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', justifyContent: 'center', width: '100%' }}
                          onClick={() => setViewReq(r)}
                        >
                          <Icon n="eye" size={12} /> View
                        </button>
                        {isPending && (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              disabled={!!actionLoading}
                              style={{ justifyContent: 'center', width: '100%' }}
                              onClick={() => setApproveTarget(id)}
                            >
                              {actionLoading === id + 'accept' ? '…' : <><Icon n="check" size={12} /> Approve</>}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={!!actionLoading}
                              style={{ justifyContent: 'center', width: '100%' }}
                              onClick={() => { setRejectTarget(id); setRejectReason(''); setRejectNote(''); }}
                            >
                              {actionLoading === id + 'reject' ? '…' : <><Icon n="x" size={12} /> Reject</>}
                            </button>
                          </>
                        )}
                        {!isPending && r.reviewedBy && (
                          <div style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.4 }}>
                            {fmtDate(r.reviewedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
