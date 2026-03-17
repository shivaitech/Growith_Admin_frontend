import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 64, fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono' }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Page not found</div>
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>The page you're looking for doesn't exist.</div>
      <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
        Back to Dashboard
      </button>
    </div>
  );
}
