import { useState, useEffect, useRef } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import adminService from '../../services/adminService';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const normalizeStatus = (s = '') => {
  const u = s.toUpperCase();
  if (u === 'APPROVED' || u === 'COMPLETED') return 'Approved';
  if (u === 'REJECTED') return 'Rejected';
  return 'Pending';
};

const TABS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function Payments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('All');

  // modals
  const [viewItem, setViewItem] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveNote, setApproveNote] = useState('');
  const [airdropRef, setAirdropRef] = useState('');
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // OTP approve flow
  const [otpModal, setOtpModal] = useState(false);
  const [pendingApproveItem, setPendingApproveItem] = useState(null);
  const [otpSending, setOtpSending] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(null);
  const [otpConfirming, setOtpConfirming] = useState(false);
  const otpRefs = useRef([]);

  const toast = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true); setError(null);
      const res = await adminService.getTokenRequests();
      const list = res?.data?.requests || res?.data?.data || res?.data || res || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Failed to load token payment requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  // Step 1: send OTP → open OTP modal
  const handleSendOtp = async () => {
    if (!approveItem) return;
    setOtpSending(true);
    try {
      await adminService.sendAirdropOtp(approveItem._id || approveItem.id);
      setPendingApproveItem(approveItem);
      setApproveItem(null);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setOtpModal(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setOtpSending(false);
    }
  };

  // Step 2: verify OTP → approve
  const handleApprove = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 6) { setOtpError('Enter the full 6-digit code.'); return; }
    setOtpConfirming(true);
    setOtpError(null);
    try {
      await adminService.verifyAirdropOtp(pendingApproveItem._id || pendingApproveItem.id, otp);
      await adminService.approveTokenRequest(
        pendingApproveItem._id || pendingApproveItem.id,
        { ...(approveNote.trim() ? { adminNote: approveNote.trim() } : {}), ...(airdropRef.trim() ? { airdropReference: airdropRef.trim() } : {}) },
      );
      setOtpModal(false);
      setPendingApproveItem(null);
      setApproveNote('');
      setAirdropRef('');
      toast.success('Token request approved and airdrop complete!');
      await fetchPayments();
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Please try again.');
    } finally {
      setOtpConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!rejectItem || !rejectReason.trim()) return;
    try {
      setActionLoading(true);
      await adminService.rejectTokenRequest(
        rejectItem._id || rejectItem.id,
        rejectReason.trim(),
        rejectNote.trim() || undefined,
      );
      setRejectItem(null);
      setRejectReason('');
      setRejectNote('');
      await fetchPayments();
    } catch (err) {
      toast.error(err.message || 'Failed to reject token request');
    } finally {
      setActionLoading(false);
    }
  };

  const pending  = items.filter((i) => normalizeStatus(i.status) === 'Pending');
  const approved = items.filter((i) => normalizeStatus(i.status) === 'Approved');
  const rejected = items.filter((i) => normalizeStatus(i.status) === 'Rejected');

  const displayed = tab === 'All' ? items
    : tab === 'Pending'  ? pending
    : tab === 'Approved' ? approved
    : rejected;

  const pendingAmt  = pending.reduce((a, p) => a + (Number(p.amountUsd) || 0), 0);
  const approvedAmt = approved.reduce((a, p) => a + (Number(p.amountUsd) || 0), 0);

  if (loading) return (
    <div className="animate-in">
      <div className="page-header"><div><div className="page-title">Token Payment Requests</div></div></div>
      <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading payment requests…</div>
    </div>
  );

  if (error) return (
    <div className="animate-in">
      <div className="page-header"><div><div className="page-title">Token Payment Requests</div></div></div>
      <div className="card" style={{ padding: 48, textAlign: 'center' }}>
        <div style={{ color: 'var(--crimson)', marginBottom: 12 }}>{error}</div>
        <button className="btn btn-primary btn-sm" onClick={fetchPayments}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="animate-in">
      {/* ── Screenshot Viewer ── */}
      {viewItem && (
        <Modal
          title="Payment Screenshot"
          sub={`${viewItem.user?.fullName || viewItem.investor || '—'} · ${viewItem.paymentMethod || viewItem.method || '—'}`}
          onClose={() => setViewItem(null)}
        >
          {/* Screenshot */}
          {viewItem.screenshotUrl ? (
            <a
              href={viewItem.screenshotUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', marginBottom: 16 }}
            >
              <img
                src={viewItem.screenshotUrl}
                alt="Payment proof"
                style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', cursor: 'zoom-in', maxHeight: 340, objectFit: 'contain', background: 'var(--bg2)' }}
              />
            </a>
          ) : (
            <div className="doc-preview" style={{ marginBottom: 16 }}>
              <Icon n="img" size={30} />
              <span style={{ fontSize: 13, color: 'var(--text3)' }}>No screenshot uploaded</span>
            </div>
          )}

          {/* Details */}
          <div className="kv" style={{ marginBottom: 16 }}>
            <div className="kv-item"><div className="kv-label">Investor</div><div className="kv-value">{viewItem.user?.fullName || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Email</div><div className="kv-value">{viewItem.user?.email || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Amount (USD)</div><div className="kv-value" style={{ color: 'var(--emerald)', fontWeight: 700 }}>${Number(viewItem.amountUsd || 0).toLocaleString()}</div></div>
            <div className="kv-item"><div className="kv-label">Token</div><div className="kv-value">{viewItem.tokenName || '—'}{viewItem.ticker ? <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text3)' }}>({viewItem.ticker})</span> : null}</div></div>
            <div className="kv-item"><div className="kv-label">Token Qty</div><div className="kv-value" style={{ fontFamily: 'DM Mono' }}>{Number(viewItem.tokenQty || 0).toLocaleString()}</div></div>
            <div className="kv-item"><div className="kv-label">Method</div><div className="kv-value">{viewItem.method || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Purchase Ref</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewItem.purchaseRef || '—'}</div></div>
            <div className="kv-item"><div className="kv-label">Submitted</div><div className="kv-value">{fmtDate(viewItem.createdAt)}</div></div>
            {viewItem.adminNote && <div className="kv-item"><div className="kv-label">Admin Note</div><div className="kv-value">{viewItem.adminNote}</div></div>}
            {viewItem.rejectionReason && <div className="kv-item"><div className="kv-label">Rejection Reason</div><div className="kv-value" style={{ color: 'var(--crimson)' }}>{viewItem.rejectionReason}</div></div>}
            {viewItem.airdropReference && <div className="kv-item"><div className="kv-label">Airdrop Ref</div><div className="kv-value" style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{viewItem.airdropReference}</div></div>}
          </div>

          {normalizeStatus(viewItem.status) === 'Pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-success" onClick={() => { setViewItem(null); setApproveItem(viewItem); setApproveNote(''); setAirdropRef(''); }}>
                <Icon n="check" size={13} />Approve &amp; Drop Tokens
              </button>
              <button className="btn btn-danger" onClick={() => { setViewItem(null); setRejectItem(viewItem); setRejectReason(''); setRejectNote(''); }}>
                <Icon n="x" size={13} />Reject
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* ── OTP Verification Modal ── */}
      {otpModal && pendingApproveItem && (
        <Modal
          title="Verify OTP to Approve"
          onClose={() => { if (!otpConfirming) { setOtpModal(false); setPendingApproveItem(null); } }}
        >
          <div style={{ background: 'rgba(54,183,132,0.08)', border: '1px solid rgba(54,183,132,0.25)', borderRadius: 8, padding: '12px 14px', marginBottom: 18, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            An OTP has been sent to your admin email. Enter the 6-digit code to approve the token request for{' '}
            <strong>{pendingApproveItem.user?.fullName || 'this investor'}</strong>.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {otpDigits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                style={{
                  width: 42, height: 48, textAlign: 'center', fontSize: 20, fontFamily: 'DM Mono',
                  fontWeight: 600, borderRadius: 8, border: `1.5px solid ${otpError ? 'var(--crimson)' : 'var(--border)'}`,
                  background: 'var(--bg2)', color: 'var(--text1)', outline: 'none',
                }}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  if (!v && !d) return;
                  const next = [...otpDigits];
                  next[i] = v.slice(-1);
                  setOtpDigits(next);
                  setOtpError(null);
                  if (v && i < 5) otpRefs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                  if (!paste) return;
                  const next = ['', '', '', '', '', ''];
                  paste.split('').forEach((c, idx) => { next[idx] = c; });
                  setOtpDigits(next);
                  otpRefs.current[Math.min(paste.length, 5)]?.focus();
                }}
                disabled={otpConfirming}
              />
            ))}
          </div>
          {otpError && <p style={{ color: 'var(--crimson)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{otpError}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { setOtpModal(false); setPendingApproveItem(null); }} disabled={otpConfirming}>Cancel</button>
            <button className="btn btn-success" onClick={handleApprove} disabled={otpConfirming || otpDigits.join('').length < 6}>
              <Icon n="check" size={13} />{otpConfirming ? 'Verifying…' : 'Verify & Approve'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Approve Confirm ── */}
      {approveItem && (
        <Modal title="Approve Token Request" onClose={() => { setApproveItem(null); setApproveNote(''); setAirdropRef(''); }}>
          <p style={{ color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
            Approving token request for{' '}
            <strong>{approveItem.user?.fullName || 'this investor'}</strong>
            {' '}— <strong style={{ color: 'var(--emerald)' }}>${Number(approveItem.amountUsd || 0).toLocaleString()}</strong>
            {' '}({Number(approveItem.tokenQty || 0).toLocaleString()} tokens).
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Admin Note <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span></label>
            <input className="filter-input" style={{ width: '100%' }} placeholder="Internal note…" value={approveNote} onChange={(e) => setApproveNote(e.target.value)} /></div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Airdrop Reference <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span></label>
            <input className="filter-input" style={{ width: '100%' }} placeholder="Airdrop transaction ref…" value={airdropRef} onChange={(e) => setAirdropRef(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { setApproveItem(null); setApproveNote(''); setAirdropRef(''); }} disabled={actionLoading}>Cancel</button>
            <button className="btn btn-success" onClick={handleSendOtp} disabled={otpSending}>
              <Icon n="check" size={13} />{otpSending ? 'Sending OTP…' : 'Approve & Drop Tokens'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reject Confirm ── */}
      {rejectItem && (
        <Modal title="Reject Token Request" onClose={() => { setRejectItem(null); setRejectReason(''); setRejectNote(''); }}>
          <p style={{ color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6 }}>
            Reject request from <strong>{rejectItem.user?.fullName || 'this investor'}</strong>?
            Please provide a reason — this will be visible to the investor.
          </p>
          <textarea
            className="filter-input"
            rows={3}
            placeholder="Reason for rejection (required)…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ width: '100%', resize: 'vertical', marginBottom: 10 }}
          />
          <input
            className="filter-input"
            placeholder="Admin note (optional)…"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            style={{ width: '100%', marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { setRejectItem(null); setRejectReason(''); setRejectNote(''); }} disabled={actionLoading}>Cancel</button>
            <button className="btn btn-danger" onClick={handleReject} disabled={actionLoading || !rejectReason.trim()}>
              <Icon n="x" size={13} />{actionLoading ? 'Rejecting…' : 'Reject Payment'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">Token Payment Requests</div>
          <div className="page-sub">Review purchase screenshots and approve or reject token allocations</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchPayments}>
          <Icon n="refresh" size={13} />Refresh
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid-3" style={{ marginBottom: 18 }}>
        <div className="stat-card">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--amber)' }}>{pending.length}</div>
          <div className="stat-delta" style={{ color: 'var(--amber)' }}>${pendingAmt.toLocaleString()} awaiting</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--emerald)' }}>{approved.length}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />${approvedAmt.toLocaleString()} collected</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-value" style={{ fontSize: 22, color: 'var(--crimson)' }}>{rejected.length}</div>
          <div className="stat-delta" style={{ color: 'var(--text3)' }}>{items.length} total requests</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}{t !== 'All' && (
              <span className="tab-count">
                {t === 'Pending' ? pending.length : t === 'Approved' ? approved.length : rejected.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {displayed.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>No {tab !== 'All' ? tab.toLowerCase() : ''} payment requests found.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Investor</th>
                  <th>Amount</th>
                  <th>Token</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Screenshot</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((p) => {
                  const id = p._id || p.id;
                  const name = p.user?.fullName || '—';
                  const email = p.user?.email;
                  const amount = Number(p.amountUsd || 0);
                  const tokenName = p.tokenName || '—';
                  const ticker = p.ticker || '';
                  const method = p.method || '—';
                  const ref = p.purchaseRef || '—';
                  const proof = p.screenshotUrl;
                  const date = p.createdAt;
                  const status = normalizeStatus(p.status);

                  return (
                    <tr key={id}>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)' }}>{String(id).slice(-8)}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        {email && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{email}</div>}
                      </td>
                      <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)', whiteSpace: 'nowrap' }}>
                        ${amount.toLocaleString()}
                      </td>
                      <td><span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{tokenName}{ticker ? ` (${ticker})` : ''}</span></td>
                      <td style={{ fontSize: 12 }}>{method}</td>
                      <td style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)' }}>{ref}</td>
                      <td>
                        {proof ? (
                          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => setViewItem(p)}>
                            <Icon n="img" size={12} />View
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text3)' }}>None</span>
                        )}
                      </td>
                      <td className="td-muted">{fmtDate(date)}</td>
                      <td><Badge status={status} /></td>
                      <td>
                        {status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setViewItem(p)}>
                              <Icon n="eye" size={12} />Review
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => { setApproveItem(p); setApproveNote(''); setAirdropRef(''); }}
                            >
                              <Icon n="check" size={12} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => { setRejectItem(p); setRejectReason(''); setRejectNote(''); }}
                            >
                              <Icon n="x" size={12} />
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-ghost btn-sm" onClick={() => setViewItem(p)}>
                            <Icon n="eye" size={12} />View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
