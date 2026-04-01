import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function VerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/auth/forgot-password', { replace: true });
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const next = [...code];
    next[index] = value.slice(-1); // only keep last digit
    setCode(next);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setCode(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    navigate('/auth/reset-password', { state: { email, code: fullCode } });
  };

  const inputStyle = {
    width: 44, height: 50, textAlign: 'center', fontSize: 20, fontWeight: 700,
    borderRadius: 'var(--radius)', border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--text)', outline: 'none',
    fontFamily: 'DM Mono, monospace',
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
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Verify Code</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
          Enter the 6-digit code sent to <strong style={{ color: 'var(--text)' }}>{email}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }} onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                ...inputStyle,
                borderColor: error ? '#ef4444' : digit ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</div>
        )}

        <button
          className="btn btn-primary"
          style={{ justifyContent: 'center', padding: '10px 16px', marginTop: 2 }}
          type="submit"
        >
          Verify & Continue
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text3)' }}>
        Didn't receive the code?{' '}
        <Link to="/auth/forgot-password" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
          Resend
        </Link>
      </div>
    </div>
  );
}
