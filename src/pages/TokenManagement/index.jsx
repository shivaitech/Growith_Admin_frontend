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
      {viewReq && (
        <Modal
          title="Token Request Details"
          sub={`${viewReq.user?.fullName || '—'} · ${viewReq.tokenName || '—'} (${viewReq.ticker || ''})`}
          onClose={() => setViewReq(null)}
        >
          {/* Screenshot */}
          {viewReq.screenshotUrl && (
            <a href={viewReq.screenshotUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: 16 }}>
              <img
                src={viewReq.screenshotUrl}
                alt="Payment screenshot"
                style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', maxHeight: 260, objectFit: 'contain', background: 'var(--bg2)' }}
              />
            </a>
          )}
          <div className="kv" style={{ marginBottom: 16 }}>
            <div className="kv-item"><div className="kv-label">Request ID</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewReq.id || viewReq._id}</div></div>
            <div className="kv-item"><div className="kv-label">Investor</div><div className="kv-value">{viewReq.user?.fullName || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value">{viewReq.user?.email || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Token</div><div className="kv-value">{viewReq.tokenName || '—'} ({viewReq.ticker || '—'})</div></div>
            <div className="kv-item"><div className="kv-label">Investment Amount</div><div className="kv-value" style={{ color: 'var(--emerald)', fontWeight: 700 }}>${Number(viewReq.amountUsd || 0).toLocaleString()}</div></div>
            <div className="kv-item"><div className="kv-label">Tokens Requested</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>{Number(viewReq.tokenQty || 0).toLocaleString()}</div></div>
            <div className="kv-item"><div className="kv-label">Payment Method</div><div className="kv-value">{viewReq.method || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Purchase Ref</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewReq.purchaseRef || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Requested</div><div className="kv-value">{fmtDate(viewReq.createdAt)}</div></div>
            <div className="kv-item"><div className="kv-label">Status</div><div className="kv-value"><Badge status={normalizeStatus(viewReq.status)} /></div></div>
            {viewReq.reviewedBy && (
              <>
                <div className="kv-item"><div className="kv-label">Reviewed By</div><div className="kv-value">{viewReq.reviewedBy?.fullName || viewReq.reviewedBy}</div></div>
                <div className="kv-item"><div className="kv-label">Reviewed At</div><div className="kv-value">{fmtDate(viewReq.reviewedAt)}</div></div>
              </>
            )}
            {viewReq.adminNote && (
              <div className="kv-item"><div className="kv-label">Admin Note</div><div className="kv-value">{viewReq.adminNote}</div></div>
            )}
            {viewReq.rejectionReason && (
              <div className="kv-item"><div className="kv-label">Rejection Reason</div><div className="kv-value" style={{ color: 'var(--crimson)' }}>{viewReq.rejectionReason}</div></div>
            )}
            {viewReq.airdropReference && (
              <div className="kv-item"><div className="kv-label">Airdrop Reference</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewReq.airdropReference}</div></div>
            )}
          </div>
          {normalizeStatus(viewReq.status) === 'Pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-success btn-sm"
                disabled={!!actionLoading}
                style={{ flex: 1 }}
                onClick={() => { setApproveTarget(viewReq.id || viewReq._id); setViewReq(null); }}
              >
                <Icon n="check" size={13} /> Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={!!actionLoading}
                style={{ flex: 1 }}
                onClick={() => { setRejectTarget(viewReq.id || viewReq._id); setViewReq(null); }}
              >
                <Icon n="x" size={13} /> Reject
              </button>
            </div>
          )}
        </Modal>
      )}

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
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${reqFilter === f ? 'btn-primary' : ''}`}
                style={reqFilter !== f ? { background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' } : {}}
                onClick={() => setReqFilter(f)}
              >
                {f}
                {f === 'Pending' && pendingReqs.length > 0 && (
                  <span style={{ marginLeft: 6, background: 'rgba(217,119,6,0.15)', color: 'var(--amber)', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>{pendingReqs.length}</span>
                )}
              </button>
            ))}
            <button
              className="btn btn-sm"
              style={{ marginLeft: 'auto', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}
              onClick={fetchRequests}
              disabled={reqLoading}
            >
              <Icon n="refresh" size={12} /> Refresh
            </button>
          </div>

          {reqLoading ? (
            <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading token requests…</div>
          ) : reqError ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ color: 'var(--crimson)', marginBottom: 12 }}>{reqError}</div>
              <button className="btn btn-primary btn-sm" onClick={fetchRequests}>Retry</button>
            </div>
          ) : displayedReqs.length === 0 ? (
            <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>
              No {reqFilter !== 'All' ? reqFilter.toLowerCase() + ' ' : ''}token requests found.
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Investor</th>
                      <th>Token</th>
                      <th>Amount (USD)</th>
                      <th>Token Qty</th>
                      <th>Purchase Ref</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedReqs.map((r) => {
                      const id = r._id || r.id;
                      const name = r.user?.fullName || '—';
                      const email = r.user?.email || '';
                      const status = normalizeStatus(r.status);
                      const isPending = status === 'Pending';
                      return (
                        <tr key={id}>
                          <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{String(id).slice(-8)}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              <Initials name={name} gradient="linear-gradient(135deg,#5C27FE,#DEC7FF)" />
                              <div>
                                <div style={{ fontWeight: 500, fontSize: 13 }}>{name}</div>
                                {email && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{email}</div>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.tokenName || '—'}</div>
                            <div style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{r.ticker || ''}</div>
                          </td>
                          <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>
                            ${Number(r.amountUsd || 0).toLocaleString()}
                          </td>
                          <td style={{ fontFamily: 'DM Mono', fontSize: 12 }}>
                            {Number(r.tokenQty || 0).toLocaleString()}
                          </td>
                          <td className="td-muted" style={{ fontFamily: 'DM Mono', fontSize: 11 }}>{r.purchaseRef || '—'}</td>
                          <td className="td-muted">{fmtDate(r.createdAt)}</td>
                          <td>
                            <Badge status={normalizeStatus(r.status)} />
                            {r.reviewedBy && (
                              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, whiteSpace: 'nowrap' }}>
                                {fmtDate(r.reviewedAt)}
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                              <button
                                className="btn btn-sm"
                                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 10px' }}
                                onClick={() => setViewReq(r)}
                              >
                                <Icon n="eye" size={12} /> View
                              </button>
                              {isPending && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm"
                                    disabled={!!actionLoading}
                                    onClick={() => setApproveTarget(id)}
                                  >
                                    {actionLoading === id + 'accept' ? '…' : <><Icon n="check" size={12} /> Accept</>}
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    disabled={!!actionLoading}
                                    onClick={() => { setRejectTarget(id); setRejectReason(''); setRejectNote(''); }}
                                  >
                                    {actionLoading === id + 'reject' ? '…' : <><Icon n="x" size={12} /> Reject</>}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
