import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/common/Icon';
import authService from '../../services/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const code = location.state?.code || '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if no email/code passed
  useEffect(() => {
    if (!email || !code) navigate('/auth/forgot-password', { replace: true });
  }, [email, code, navigate]);

  const validate = () => {
    if (!form.password) return 'Password is required';
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(form.password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(form.password)) return 'Password must contain a lowercase letter';
    if (!/\d/.test(form.password)) return 'Password must contain a number';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword({ email, code, newPassword: form.password, confirmPassword: form.confirmPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="auth-box" style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px', color: '#22c55e',
        }}>
          <Icon n="check" size={28} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 6 }}>Password Reset!</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>
          Your password has been updated successfully. You can now sign in with your new password.
        </div>
        <Link
          to="/auth/login"
          className="btn btn-primary"
          style={{ justifyContent: 'center', padding: '10px 16px', textDecoration: 'none', display: 'block' }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  const eyeBtn = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 2,
        display: 'flex', alignItems: 'center',
      }}
      tabIndex={-1}
    >
      <Icon n={show ? 'eye' : 'lock'} size={15} />
    </button>
  );

  // Password strength indicator
  const strength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: 'var(--border)' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' };
    if (score <= 4) return { level: 3, label: 'Good', color: '#3b82f6' };
    return { level: 4, label: 'Strong', color: '#22c55e' };
  })();

  return (
    <div className="auth-box">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
          G
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
          Grow<span style={{ color: 'var(--accent)' }}>ith</span> Admin
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Reset Password</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
          Create a new password for <strong style={{ color: 'var(--text)' }}>{email}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>New Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="filter-input"
              style={{ width: '100%', paddingRight: 38 }}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(null); }}
              required
            />
            {eyeBtn(showPassword, () => setShowPassword(!showPassword))}
          </div>
          {form.password && (
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    height: 3, flex: 1, borderRadius: 2,
                    background: i <= strength.level ? strength.color : 'var(--border)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>{strength.label}</span>
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="filter-input"
              style={{ width: '100%', paddingRight: 38 }}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setError(null); }}
              required
            />
            {eyeBtn(showConfirm, () => setShowConfirm(!showConfirm))}
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>Passwords do not match</div>
          )}
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 13, marginTop: -4 }}>{error}</div>
        )}

        <button
          className="btn btn-primary"
          style={{ justifyContent: 'center', padding: '10px 16px', marginTop: 4, opacity: loading ? 0.7 : 1 }}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <Link to="/auth/login" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
