import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import Modal from '../../components/common/Modal';
import adminService from '../../services/adminService';

const normalizeStatus = (s) => {
  if (!s) return 'Pending';
  const lower = s.toLowerCase();
  if (lower === 'approved') return 'Approved';
  if (lower === 'rejected') return 'Rejected';
  if (lower === 'pending_approval' || lower === 'pending') return 'Pending';
  return 'Pending';
};

const fmtDate = (d) => d ? new Date(d).toLocaleString() : '—';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || '';
const imgUrl = (path) => (path ? (path.startsWith('http') ? path : `${API_BASE}${path}`) : null);

const isPendingStatus = (s) => {
  if (!s) return true;
  const lower = s.toLowerCase();
  return lower !== 'approved' && lower !== 'rejected';
};

export default function KYCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kyc, setKyc] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showReject, setShowReject] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [reason, setReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchKyc = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getKycRequest(id);
      const data = res?.data?.request || res?.data?.kyc || res?.data?.data || res?.data || res;
      // Response shape: { request: {...} } or { kyc: {...}, user: {...} } or flat
      if (data?.kyc) {
        setKyc(data.kyc);
        setUser(data.user || data.kyc.user || {});
      } else {
        setKyc(data);
        setUser(data?.user || {});
      }
    } catch (err) {
      setError(err.message || 'Failed to load KYC details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKyc(); }, [id]);

  const handleApprove = async () => {
    setActionLoading('approve');
    setActionSuccess(null);
    try {
      await adminService.approveKyc(id);
      setActionSuccess('KYC approved successfully');
      setShowApprove(false);
      await fetchKyc();
    } catch (err) {
      setError(err.message || 'Failed to approve KYC');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setActionLoading('reject');
    setActionSuccess(null);
    try {
      await adminService.rejectKyc(id, reason.trim());
      setActionSuccess('KYC rejected');
      setShowReject(false);
      setReason('');
      await fetchKyc();
    } catch (err) {
      setError(err.message || 'Failed to reject KYC');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div><div className="page-title">KYC Review</div></div>
        </div>
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text3)' }}>Loading KYC details…</div>
      </div>
    );
  }

  if (error && !kyc) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 8 }}>
              <Icon n="back" size={14} />Back
            </button>
            <div className="page-title">KYC Review</div>
          </div>
        </div>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>
          <button className="btn btn-primary btn-sm" onClick={fetchKyc}>Retry</button>
        </div>
      </div>
    );
  }

  const status = normalizeStatus(kyc?.status);
  const isPending = isPendingStatus(kyc?.status);
  const name = kyc?.fullLegalName || user?.fullName || '—';
  const email = user?.email || '';

  return (
    <div className="animate-in">
      {/* Back + Title */}
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 8 }}>
            <Icon n="back" size={14} />Back to KYC
          </button>
          <div className="page-title">KYC Review — #{id}</div>
          <div className="page-sub">Review identity documents and approve or reject</div>
        </div>
        <Badge status={status} />
      </div>

      {/* Success / Error banners */}
      {actionSuccess && (
        <div style={{ padding: '10px 16px', marginBottom: 14, borderRadius: 'var(--radius)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669', fontSize: 13 }}>
          <Icon n="check" size={12} /> {actionSuccess}
        </div>
      )}
      {error && kyc && (
        <div style={{ padding: '10px 16px', marginBottom: 14, borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* User Header Card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <Initials name={name} size={56} gradient="linear-gradient(135deg,#1a56db,#0ea5e9)" />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{name}</div>
            {email && <div style={{ color: 'var(--text2)', fontSize: 13 }}>{email}</div>}
            {kyc?.phoneNumber && <div style={{ color: 'var(--text2)', fontSize: 13 }}>{kyc.phoneNumber}</div>}
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              {user?.id && (
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>User #{user.id}</span>
              )}
              {user?.emailVerified !== undefined && (
                <span className={`badge ${user.emailVerified ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 10 }}>
                  {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                </span>
              )}
              {user?.isActive !== undefined && (
                <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KYC Details */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="section-title">Identity Information</div>
          <div className="info-row">
            <span className="info-label">Full Legal Name</span>
            <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.fullLegalName || '—'}</span>
          </div>
          {kyc.dateOfBirth && (
            <div className="info-row">
              <span className="info-label">Date of Birth</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.dateOfBirth}</span>
            </div>
          )}
          {kyc.nationality && (
            <div className="info-row">
              <span className="info-label">Nationality</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.nationality}</span>
            </div>
          )}
          {kyc.phoneNumber && (
            <div className="info-row">
              <span className="info-label">Phone Number</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 500, fontSize: 13 }}>{kyc.phoneNumber}</span>
            </div>
          )}
          {kyc.panNumber && (
            <div className="info-row">
              <span className="info-label">PAN Number</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 600, fontSize: 13, color: 'var(--text1)', letterSpacing: 0.5 }}>{kyc.panNumber}</span>
            </div>
          )}
          {kyc.aadhaarNumber && (
            <div className="info-row">
              <span className="info-label">Aadhaar Number</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 600, fontSize: 13, color: 'var(--text1)', letterSpacing: 0.5 }}>{kyc.aadhaarNumber}</span>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title">Address & Residence</div>
          {kyc.streetAddress && (
            <div className="info-row">
              <span className="info-label">Street Address</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.streetAddress}</span>
            </div>
          )}
          {kyc.city && (
            <div className="info-row">
              <span className="info-label">City</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.city}</span>
            </div>
          )}
          {kyc.stateProvince && (
            <div className="info-row">
              <span className="info-label">State / Province</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.stateProvince}</span>
            </div>
          )}
          {kyc.countryOfResidence && (
            <div className="info-row">
              <span className="info-label">Country of Residence</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{kyc.countryOfResidence}</span>
            </div>
          )}
        </div>
      </div>

      {/* Submission Details */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">Submission Details</div>
        <div className="grid-2">
          <div>
            <div className="info-row">
              <span className="info-label">KYC ID</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 500, fontSize: 12, color: 'var(--text3)' }}>{kyc.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <Badge status={status} />
            </div>
            <div className="info-row">
              <span className="info-label">Submitted</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{fmtDate(kyc.createdAt)}</span>
            </div>
            {kyc.termsAgreedAt && (
              <div className="info-row">
                <span className="info-label">Terms Agreed</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{fmtDate(kyc.termsAgreedAt)}</span>
              </div>
            )}
          </div>
          <div>
            {kyc.userId && (
              <div className="info-row">
                <span className="info-label">User ID</span>
                <span style={{ fontFamily: 'DM Mono', fontWeight: 500, fontSize: 12, color: 'var(--text3)' }}>{kyc.userId}</span>
              </div>
            )}
            {kyc.reviewedAt && (
              <div className="info-row">
                <span className="info-label">Reviewed At</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{fmtDate(kyc.reviewedAt)}</span>
              </div>
            )}
            {kyc.reviewedBy && (
              <div className="info-row">
                <span className="info-label">Reviewed By</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{typeof kyc.reviewedBy === 'object' ? kyc.reviewedBy.fullName : kyc.reviewedBy}</span>
              </div>
            )}
            {kyc.rejectionReason && (
              <div className="info-row">
                <span className="info-label">Rejection Reason</span>
                <span style={{ fontWeight: 500, fontSize: 13, color: '#ef4444' }}>{kyc.rejectionReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Images */}
      {(imgUrl(kyc.panFrontUrl) || imgUrl(kyc.aadhaarFrontUrl) || imgUrl(kyc.aadhaarBackUrl) || imgUrl(kyc.supportingDocUrl)) && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title">Document Images</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {imgUrl(kyc.panFrontUrl) && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>PAN Card</div>
                <a href={imgUrl(kyc.panFrontUrl)} target="_blank" rel="noopener noreferrer">
                  <img src={imgUrl(kyc.panFrontUrl)} alt="PAN front" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </a>
              </div>
            )}
            {imgUrl(kyc.aadhaarFrontUrl) && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>Aadhaar Front</div>
                <a href={imgUrl(kyc.aadhaarFrontUrl)} target="_blank" rel="noopener noreferrer">
                  <img src={imgUrl(kyc.aadhaarFrontUrl)} alt="Aadhaar front" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </a>
              </div>
            )}
            {imgUrl(kyc.aadhaarBackUrl) && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>Aadhaar Back</div>
                <a href={imgUrl(kyc.aadhaarBackUrl)} target="_blank" rel="noopener noreferrer">
                  <img src={imgUrl(kyc.aadhaarBackUrl)} alt="Aadhaar back" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </a>
              </div>
            )}
            {imgUrl(kyc.supportingDocUrl) && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>
                  {kyc.supportingDocName || 'Supporting Document'}
                </div>
                <a href={imgUrl(kyc.supportingDocUrl)} target="_blank" rel="noopener noreferrer">
                  <img src={imgUrl(kyc.supportingDocUrl)} alt="Supporting doc" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isPending && (
        <div className="card">
          <div className="section-title">Actions</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-success" onClick={() => setShowApprove(true)} disabled={!!actionLoading}>
              <Icon n="check" size={14} />Approve KYC
            </button>
            <button className="btn btn-danger" onClick={() => setShowReject(true)} disabled={!!actionLoading}>
              <Icon n="x" size={14} />Reject KYC
            </button>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApprove && (
        <Modal title="Approve KYC" sub={`Confirm approval for ${name}`} onClose={() => setShowApprove(false)}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.5 }}>
            Are you sure you want to approve the KYC submission for <strong>{name}</strong>?
            This will verify the user's identity and grant them full access.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setShowApprove(false)}>Cancel</button>
            <button className="btn btn-success" onClick={handleApprove} disabled={!!actionLoading}>
              <Icon n="check" size={13} />
              {actionLoading === 'approve' ? 'Approving…' : 'Confirm Approve'}
            </button>
          </div>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {showReject && (
        <Modal title="Reject KYC" sub={`Provide a reason for rejecting ${name}'s KYC`} onClose={() => { setShowReject(false); setReason(''); }}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>
            This action will reject the KYC submission. The user will be notified with the reason provided below.
          </p>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
            Rejection Reason <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            className="filter-input"
            style={{ width: '100%', minHeight: 80, resize: 'vertical', marginBottom: 14 }}
            placeholder="Provide a clear reason for rejecting this KYC submission…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { setShowReject(false); setReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleReject} disabled={!reason.trim() || !!actionLoading}>
              <Icon n="x" size={13} />
              {actionLoading === 'reject' ? 'Rejecting…' : 'Confirm Reject'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
