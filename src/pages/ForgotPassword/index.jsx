import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email.trim());
      navigate('/auth/verify-code', { state: { email: email.trim() } });
    } catch (err) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Forgot Password</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
          Enter your email and we'll send you a verification code
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
          <input
            className="filter-input"
            style={{ width: '100%' }}
            type="email"
            placeholder="admin@growith.io"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            required
          />
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
          {loading ? 'Sending…' : 'Send Verification Code'}
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
