import { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import Modal from '../../components/common/Modal';
import adminService from '../../services/adminService';

export default function Investors() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [kycF, setKycF] = useState('All');

  // Single user detail
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Create / Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Send KYC link
  const [kycLinkLoading, setKycLinkLoading] = useState(false);
  const [kycLinkSent, setKycLinkSent] = useState(false);

  // ── Fetch users ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers();
      const list = res?.data?.users || res?.data || res?.users || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── View single user ────────────────────────────────────────────────────
  const viewUser = async (userId) => {
    setDetailLoading(true);
    try {
      const res = await adminService.getUser(userId);
      setSelectedUser(res?.data?.user || res?.data || res?.user || res);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Create user ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingUser(null);
    setFormData({ fullName: '', email: '' });
    setFormError(null);
    setShowForm(true);
  };

  // ── Edit user ────────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (editingUser) {
        const { fullName, isActive } = formData;
        await adminService.updateUser(editingUser.id, { fullName, isActive });
      } else {
        await adminService.createUser(formData);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete user ──────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      if (selectedUser?.id === deleteTarget.id) {
        setSelectedUser(null);
      }
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Send KYC link ────────────────────────────────────────────────────────
  const sendKycLink = async (userId) => {
    setKycLinkLoading(true);
    setKycLinkSent(false);
    try {
      await adminService.sendKycLink(userId);
      setKycLinkSent(true);
      setTimeout(() => setKycLinkSent(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setKycLinkLoading(false);
    }
  };

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = users.filter((i) => {
    const nameMatch =
      (i.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.email || '').toLowerCase().includes(search.toLowerCase());
    const kycMatch = kycF === 'All' || i.kycStatus === kycF;
    return nameMatch && kycMatch;
  });

  // ── User detail panel ────────────────────────────────────────────────────
  if (selectedUser) {
    const u = selectedUser;
    return (
      <div className="animate-in">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedUser(null)}>
              <Icon n="back" size={14} />Back
            </button>
            <div>
              <div className="page-title">{u.fullName || u.email}</div>
              <div className="page-sub">Investor Details</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => sendKycLink(u.id)}
              disabled={kycLinkLoading || kycLinkSent}
            >
              <Icon n="link" size={12} />
              {kycLinkLoading ? 'Sending…' : kycLinkSent ? 'KYC Link Sent ✓' : 'Send KYC Link'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>
              <Icon n="edit" size={12} />Edit
            </button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleteTarget(u)}>
              <Icon n="trash" size={12} />Delete
            </button>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="section-title">Profile</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <Initials name={u.fullName || u.email || '?'} gradient="linear-gradient(135deg,#1a56db,#0ea5e9)" size={48} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{u.fullName || '—'}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{u.email}</div>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">KYC Status</span>
              <Badge status={u.kycStatus || 'Not Started'} />
            </div>
            <div className="info-row">
              <span className="info-label">Email Verified</span>
              <span className={`badge ${u.emailVerified ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 11 }}>
                {u.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Status</span>
              <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11 }}>
                {u.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Joined</span>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</span>
            </div>
            {u.lastLoginAt && (
              <div className="info-row">
                <span className="info-label">Last Login</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{new Date(u.lastLoginAt).toLocaleString()}</span>
              </div>
            )}
            {u.updatedAt && (
              <div className="info-row">
                <span className="info-label">Last Updated</span>
                <span style={{ fontWeight: 500, fontSize: 13 }}>{new Date(u.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-title">Account Info</div>
            <div className="info-row">
              <span className="info-label">User ID</span>
              <span style={{ fontFamily: 'DM Mono', fontWeight: 500, fontSize: 11, color: 'var(--text3)' }}>{u.id}</span>
            </div>
            {u.googleId && (
              <div className="info-row">
                <span className="info-label">Google Linked</span>
                <span className="badge badge-blue" style={{ fontSize: 11 }}>Connected</span>
              </div>
            )}
            {u.profilePicture && (
              <div className="info-row">
                <span className="info-label">Profile Picture</span>
                <img src={u.profilePicture} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {deleteTarget && (
          <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
              Are you sure you want to delete <strong>{deleteTarget.fullName || deleteTarget.email}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-gray" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--red)' }} onClick={confirmDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </Modal>
        )}

        {/* Edit form */}
        {showForm && <FormModal {...{ formData, setFormData, formLoading, formError, handleFormSubmit, editingUser, onClose: () => setShowForm(false) }} />}
      </div>
    );
  }

  // ── Main list ────────────────────────────────────────────────────────────
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Investor Management</div>
          <div className="page-sub">{users.length} registered investor{users.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Icon n="plus" size={13} />Add Investor</button>
      </div>

      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 12px', flex: 1, maxWidth: 300 }}>
          <Icon n="search" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, padding: '8px 0', color: 'var(--text)', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
        <select className="filter-input" value={kycF} onChange={(e) => setKycF(e.target.value)}>
          {['All', 'Not Started', 'Pending', 'Approved', 'Manual Review', 'Rejected'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', marginBottom: 14, borderRadius: 'var(--radius)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
          {error}
          <button style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }} onClick={fetchUsers}>Retry</button>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Investor</th><th>KYC</th><th>Email Verified</th>
                <th>Status</th><th>Last Login</th><th>Joined</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-title">Loading investors…</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">👤</div>
                      <div className="empty-title">No investors match your filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={i.fullName || i.email || '?'} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{i.fullName || '—'}</div>
                          <div className="td-muted">{i.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge status={i.kycStatus || 'Not Started'} /></td>
                    <td>
                      <span className={`badge ${i.emailVerified ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 11 }}>
                        {i.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${i.isActive ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 11 }}>
                        {i.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td-muted">{i.lastLoginAt ? new Date(i.lastLoginAt).toLocaleDateString() : '—'}</td>
                    <td className="td-muted">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => viewUser(i.id)} disabled={detailLoading}>
                          <Icon n="eye" size={12} />View
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(i)}>
                          <Icon n="edit" size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => setDeleteTarget(i)}>
                          <Icon n="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      {showForm && <FormModal {...{ formData, setFormData, formLoading, formError, handleFormSubmit, editingUser, onClose: () => setShowForm(false) }} />}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
            Are you sure you want to delete <strong>{deleteTarget.fullName || deleteTarget.email}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-gray" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: 'var(--red)' }} onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Create / Edit Form Modal ─────────────────────────────────────────────────
function FormModal({ formData, setFormData, formLoading, formError, handleFormSubmit, editingUser, onClose }) {
  return (
    <Modal title={editingUser ? 'Edit Investor' : 'Add Investor'} onClose={onClose}>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
        ].map(({ key, label, type, placeholder }) => {
          const isDisabled = editingUser && key === 'email';
          return (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                className="filter-input"
                style={{ width: '100%', opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : undefined }}
                type={type}
                placeholder={placeholder}
                value={formData[key]}
                onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                required
                disabled={isDisabled}
              />
            </div>
          );
        })}
        {formError && <div style={{ color: '#ef4444', fontSize: 13 }}>{formError}</div>}
        {editingUser && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Account Status</label>
            <div
              onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{
                width: 40, height: 22, borderRadius: 11, padding: 2,
                background: (formData.isActive ?? true) ? 'var(--accent)' : 'var(--border)',
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  transition: 'transform 0.2s',
                  transform: (formData.isActive ?? true) ? 'translateX(18px)' : 'translateX(0)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: (formData.isActive ?? true) ? 'var(--green, #22c55e)' : 'var(--red, #ef4444)',
              }}>
                {(formData.isActive ?? true) ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-gray" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={formLoading}>
            {formLoading ? 'Saving…' : editingUser ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
