import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../../components/common/Icon';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin_remember_email');
    if (saved) {
      setForm((f) => ({ ...f, email: saved }));
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (remember) {
        localStorage.setItem('admin_remember_email', form.email);
      } else {
        localStorage.removeItem('admin_remember_email');
      }
      await login(form);
      navigate('/');
    } catch {
      // error is already set in Redux state via useAuth
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
          G
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>
          Grow<span style={{ color: 'var(--accent)' }}>ith</span> Admin
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Sign in</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>Access your admin dashboard</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
          <input
            className="filter-input"
            style={{ width: '100%' }}
            type="email"
            placeholder="admin@growith.io"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="filter-input"
              style={{ width: '100%', paddingRight: 38 }}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 2,
                display: 'flex', alignItems: 'center',
              }}
              tabIndex={-1}
            >
              <Icon n={showPassword ? 'eye' : 'lock'} size={15} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text2)' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: 'var(--accent)', width: 14, height: 14, cursor: 'pointer' }}
            />
            Remember me
          </label>
          <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 13, marginTop: -4 }}>{error}</div>
        )}
        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '10px 16px', marginTop: 4, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>


    </div>
  );
}
