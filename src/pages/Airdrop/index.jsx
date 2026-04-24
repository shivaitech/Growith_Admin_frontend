import { useState, useEffect, useRef } from 'react';
import Icon from '../../components/common/Icon';
import Modal from '../../components/common/Modal';
import adminService from '../../services/adminService';

const TAGS = ['Airdrop', 'Bonus', 'Referral Reward', 'Purchased', 'Promotion'];

export default function Airdrop() {
  const [users, setUsers]               = useState([]);
  const [tokens, setTokens]             = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [recipient, setRecipient]       = useState('');
  const [investAmount, setInvestAmount] = useState('');
  const [tokenPrice, setTokenPrice]     = useState('');
  const [tag, setTag]                   = useState('Airdrop');
  const [note, setNote]                 = useState('');
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);

  // OTP modal state
  const [otpModal, setOtpModal]         = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState(null);
  const [otpSending, setOtpSending]     = useState(false); // sending OTP request
  const [otpDigits, setOtpDigits]       = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError]         = useState(null);
  const [sending, setSending]           = useState(false);
  const otpRefs = useRef([]);

  const [history, setHistory]               = useState([]);
  const [historyLoading, setHistoryLoading]   = useState(true);
  const [viewItem, setViewItem]               = useState(null);
  const [viewLoading, setViewLoading]         = useState(false);

  const openView = (id) => {
    setViewItem(null);
    setViewLoading(true);
    adminService.getDirectAirdrop(id)
      .then((res) => {
        const d = res?.data?.directAirdrop || res?.data?.data?.directAirdrop || res?.data || res;
        setViewItem(d);
      })
      .catch(() => setViewItem({}))
      .finally(() => setViewLoading(false));
  };

  const fetchHistory = () => {
    setHistoryLoading(true);
    adminService.getDirectAirdrops().then((res) => {
      const list = res?.data?.directAirdrops || res?.data?.data?.airdrops || res?.data?.airdrops || [];
      setHistory(Array.isArray(list) ? list : []);
    }).catch(() => {}).finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    adminService.getUsers().then((res) => {
      const list = res?.data?.users || res?.data || res?.users || [];
      const arr = Array.isArray(list) ? list : [];
      setUsers(arr);
      if (arr.length > 0) setRecipient(arr[0]._id || arr[0].id);
    }).catch(() => {});
    adminService.getTokens().then((res) => {
      const list = res?.data?.tokens || res?.data || [];
      const arr = Array.isArray(list) ? list : [];
      setTokens(arr);
      if (arr.length > 0) {
        const first = arr[0];
        setSelectedTokenId(first._id || first.id || '');
        if (first.priceUsd) setTokenPrice(String(first.priceUsd));
      }
    }).catch(() => {});
    fetchHistory();
  }, []);

  const selectedUser    = users.find((u) => (u._id || u.id) === recipient) || null;
  const selectedKyc     = selectedUser?.kycStatus || '';
  const kycApproved     = selectedKyc.toLowerCase() === 'approved' || selectedKyc.toLowerCase() === 'verified';
  const kycBlocked      = !!recipient && !!selectedUser && !kycApproved;
  const investNum       = Number(investAmount) || 0;
  const priceNum        = Number(tokenPrice) || 0;
  const tokenQty        = priceNum > 0 ? Math.floor(investNum / priceNum) : 0;

  // ── Step 1: validate → POST /admin/direct-airdrops/otp/send ─────────────────────
  const handleRequestOtp = async () => {
    if (!selectedTokenId) { setError('Please select a token.'); return; }
    if (!recipient) { setError('Please select a user.'); return; }
    if (kycBlocked) { setError(`Cannot send airdrop — ${selectedUser?.fullName || selectedUser?.name}'s KYC is not approved (status: ${selectedKyc || 'Not Started'}).`); return; }
    if (!investAmount || investNum <= 0) { setError('Please enter a valid airdrop amount.'); return; }
    if (tokenQty <= 0) { setError('Airdrop amount is too small for the given token price.'); return; }
    setError(null);
    setOtpSending(true);
    try {
      const payload = {
        userId:      recipient,
        tokenId:     selectedTokenId,
        tokenQty,
        amountUsd:   investNum,
        airdropType: tag === 'Airdrop' ? 'internal' : 'external',
        adminNote:   note.trim() || 'Admin airdrop',
        reference:   `AIR-${Date.now()}`,
      };
      const res = await adminService.sendDirectAirdropOtp(payload);
      const directAirdropId =
        res?.data?.data?.directAirdrop?.id  || res?.data?.data?.directAirdrop?._id  ||
        res?.data?.data?.directAirdropId    ||
        res?.data?.directAirdrop?.id        || res?.data?.directAirdrop?._id        ||
        res?.data?.directAirdropId          || res?.directAirdropId;
      if (!directAirdropId) throw new Error('Could not get airdrop ID from server.');
      setPendingRequestId(directAirdropId);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
      setOtpModal(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  // ── OTP input handlers ───────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val.slice(-1);
    setOtpDigits(next);
    setOtpError(null);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Step 2: POST /admin/direct-airdrops/otp/verify ────────────────────
  const handleConfirm = async () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) { setOtpError('Enter the full 6-digit code.'); return; }
    setSending(true);
    setOtpError(null);
    try {
      await adminService.verifyDirectAirdropOtp(pendingRequestId, entered);
      const recipientLabel = selectedUser ? (selectedUser.fullName || selectedUser.name) : 'the selected user';
      setOtpModal(false);
      setPendingRequestId(null);
      setSuccess(`Airdrop of ${tokenQty.toLocaleString()} tokens sent to ${recipientLabel} successfully.`);
      setInvestAmount('');
      setNote('');
      if (users.length > 0) setRecipient(users[0]._id || users[0].id);
      fetchHistory();
    } catch (err) {
      setOtpError(err.message || 'Incorrect code. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-in">
      {/* ── OTP Verification Modal ── */}
      {otpModal && (
        <Modal
          title="Admin Verification Required"
          sub="A 6-digit code has been sent to your registered admin email"
          onClose={() => { if (!sending) { setOtpModal(false); setPendingRequestId(null); } }}
        >
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, textAlign: 'center', fontSize: 13, color: 'var(--text2)' }}>
            Check your email inbox for the verification code and enter it below.
          </div>

          {/* 6-box OTP input */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {otpDigits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKey(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                style={{
                  width: 44, height: 50, textAlign: 'center', fontSize: 20, fontWeight: 700,
                  border: `1.5px solid ${otpError ? 'var(--crimson)' : d ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', background: 'var(--surface)',
                  color: 'var(--text1)', outline: 'none',
                }}
              />
            ))}
          </div>

          {otpError && (
            <div style={{ fontSize: 13, color: 'var(--crimson)', textAlign: 'center', marginBottom: 12 }}>{otpError}</div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { setOtpModal(false); setPendingRequestId(null); }} disabled={sending}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={sending || otpDigits.join('').length < 6}
            >
              <Icon n="check" size={13} />
              {sending ? 'Verifying…' : 'Verify & Confirm Airdrop'}
            </button>
          </div>
        </Modal>
      )}

      <div className="page-header">
        <div>
          <div className="page-title">Airdrop System</div>
          <div className="page-sub">Send tokens to a single user</div>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 20 }}>Send Airdrop</div>

          {/* Token */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Token
            </label>
            <select
              className="filter-input"
              style={{ width: '100%' }}
              value={selectedTokenId}
              onChange={(e) => {
                const tid = e.target.value;
                setSelectedTokenId(tid);
                const tok = tokens.find((t) => (t._id || t.id) === tid);
                if (tok?.priceUsd) setTokenPrice(String(tok.priceUsd));
                setError(null); setSuccess(null);
              }}
            >
              <option value="">— Select a token —</option>
              {tokens.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Recipient
            </label>
            <select
              className="filter-input"
              style={{ width: '100%' }}
              value={recipient}
              onChange={(e) => { setRecipient(e.target.value); setError(null); setSuccess(null); }}
            >
              <option value="">— Select a user —</option>
              {users.map((u) => {
                const kyc = u.kycStatus || 'Not Started';
                const approved = kyc.toLowerCase() === 'approved' || kyc.toLowerCase() === 'verified';
                return (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.fullName || u.name} — {u.email} [{approved ? `KYC: ${kyc}` : `KYC: ${kyc} ⚠`}]
                  </option>
                );
              })}
            </select>
            {kycBlocked && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--crimson)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon n="alert" size={12} />
                KYC not approved ({selectedKyc || 'Not Started'}) — airdrop blocked
              </div>
            )}
            {selectedUser && kycApproved && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon n="check" size={12} />
                KYC approved
              </div>
            )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Airdrop Amount (USD)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: 13, pointerEvents: 'none' }}>$</span>
              <input
                className="filter-input"
                style={{ width: '100%', paddingLeft: 22 }}
                type="number"
                min="0"
                step="any"
                value={investAmount}
                onChange={(e) => { setInvestAmount(e.target.value); setError(null); setSuccess(null); }}
                placeholder="e.g. 500"
              />
            </div>
          </div>

          {/* Token price + live conversion */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Token Price (USD per token)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontSize: 13, pointerEvents: 'none' }}>$</span>
              <input
                className="filter-input"
                style={{ width: '100%', paddingLeft: 22, color: 'var(--text3)', cursor: 'not-allowed' }}
                type="number"
                value={tokenPrice}
                readOnly
              />
            </div>
            {investNum > 0 && priceNum > 0 && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text2)' }}>Tokens this user will receive</span>
                <span style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>{tokenQty.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Tag */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Tag / Category
            </label>
            <select className="filter-input" style={{ width: '100%' }} value={tag} onChange={(e) => setTag(e.target.value)}>
              {TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 500 }}>
              Airdrop Note <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              className="filter-input"
              style={{ width: '100%', minHeight: 72, resize: 'vertical' }}
              placeholder="Optional notes about this airdrop…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Summary */}
          {investNum > 0 && priceNum > 0 && tokenQty > 0 && (
            <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 16, border: '1px solid var(--border)' }}>
              <div className="info-row">
                <span className="info-label">Airdrop amount</span>
                <span style={{ fontWeight: 600, fontFamily: 'DM Mono' }}>${investNum.toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tokens to send</span>
                <span style={{ fontWeight: 600, fontFamily: 'DM Mono' }}>{tokenQty.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Feedback */}
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--crimson)' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--emerald)' }}>
              <Icon n="check" size={13} /> {success}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', opacity: kycBlocked ? 0.5 : 1 }}
            onClick={handleRequestOtp}
            disabled={otpSending || kycBlocked}
          >
            <Icon n="airdrop" size={14} />
            {otpSending ? 'Sending OTP…' : `Send Airdrop to ${selectedUser ? (selectedUser.fullName || selectedUser.name) : 'Selected User'}`}
          </button>
        </div>
      </div>

      {/* ── Airdrop History ── */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="section-title" style={{ margin: 0 }}>Airdrop History</div>
          <button className="btn" style={{ fontSize: 12 }} onClick={fetchHistory} disabled={historyLoading}>
            <Icon n="refresh" size={13} />{historyLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {historyLoading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Loading…</div>
          ) : history.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No airdrop history found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Token</th>
                    <th>Qty</th>
                    <th>Amount (USD)</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => {
                    const status = h.status || 'completed';
                    const badgeClass = status.toLowerCase() === 'completed' ? 'badge badge-green'
                      : status.toLowerCase() === 'pending' ? 'badge badge-amber'
                      : status.toLowerCase() === 'failed' ? 'badge badge-red'
                      : 'badge badge-gray';
                    return (
                      <tr key={h._id || h.id || i}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{h.user?.fullName || h.user?.name || h.userId || '—'}</div>
                          {h.user?.email && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{h.user.email}</div>}
                        </td>
                        <td style={{ fontFamily: 'DM Mono' }}>{h.ticker || h.tokenName || '—'}</td>
                        <td style={{ fontFamily: 'DM Mono' }}>{h.tokenQty != null ? Number(h.tokenQty).toLocaleString() : '—'}</td>
                        <td style={{ fontFamily: 'DM Mono' }}>{h.amountUsd != null ? `$${Number(h.amountUsd).toLocaleString()}` : '—'}</td>
                        <td><span className="badge badge-gray">{h.airdropType || '—'}</span></td>
                        <td style={{ fontFamily: 'DM Mono', fontSize: 12 }}>{h.reference || '—'}</td>
                        <td><span className={badgeClass}>{status}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                          {h.createdAt ? (
                            <>
                              <div>{new Date(h.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(h.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                            </>
                          ) : '—'}
                        </td>
                        <td>
                          <button className="btn" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => openView(h._id || h.id)}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── View Detail Modal ── */}
      {(viewLoading || viewItem) && (
        <Modal title="Airdrop Details" onClose={() => { setViewItem(null); setViewLoading(false); }}>
          {viewLoading ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Loading…</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['ID',                  viewItem?.id || viewItem?._id],
                ['Recipient',           viewItem?.user?.fullName || viewItem?.user?.name || viewItem?.userId],
                ['Email',               viewItem?.user?.email],
                ['Token',               viewItem?.tokenName ? `${viewItem.tokenName} (${viewItem.ticker})` : viewItem?.ticker],
                ['Token ID',            viewItem?.tokenId],
                ['Qty',                 viewItem?.tokenQty != null ? Number(viewItem.tokenQty).toLocaleString() : null],
                ['Amount (USD)',        viewItem?.amountUsd != null ? `$${Number(viewItem.amountUsd).toLocaleString()}` : null],
                ['Airdrop Type',        viewItem?.airdropType],
                ['Status',              viewItem?.status],
                ['Reference',           viewItem?.reference],
                ['Purchase ID',         viewItem?.purchaseId],
                ['Transaction ID',      viewItem?.transactionId],
                ['Admin Note',          viewItem?.adminNote],
                ['OTP Sent At',         viewItem?.approvalOtpSentAt ? new Date(viewItem.approvalOtpSentAt).toLocaleString('en-GB') : null],
                ['OTP Verified At',     viewItem?.approvalOtpVerifiedAt ? new Date(viewItem.approvalOtpVerifiedAt).toLocaleString('en-GB') : null],
                ['Completed At',        viewItem?.completedAt ? new Date(viewItem.completedAt).toLocaleString('en-GB') : null],
                ['Created At',          viewItem?.createdAt ? new Date(viewItem.createdAt).toLocaleString('en-GB') : null],
                ['Updated At',          viewItem?.updatedAt ? new Date(viewItem.updatedAt).toLocaleString('en-GB') : null],
              ].filter(([, v]) => v != null && v !== '').map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text3)', whiteSpace: 'nowrap' }}>{label}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right', wordBreak: 'break-all', fontFamily: ['ID','Token ID','Purchase ID','Transaction ID','Reference'].includes(label) ? 'DM Mono' : 'inherit', fontSize: ['ID','Token ID','Purchase ID','Transaction ID'].includes(label) ? 11 : 13 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
