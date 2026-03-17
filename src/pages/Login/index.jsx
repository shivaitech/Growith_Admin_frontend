import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginSuccess({ user: { name: 'Admin', email: form.email }, token: 'demo-token' }));
    navigate('/');
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
          <input
            className="filter-input"
            style={{ width: '100%' }}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '10px 16px', marginTop: 4 }} type="submit">
          Sign In
        </button>
      </form>


    </div>
  );
}
