import { createContext, useCallback, useContext, useRef, useState } from 'react';

/* ── Types ─────────────────────────────────── */
// type: 'success' | 'error' | 'info' | 'warning'

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 8.5l2.5 2.5 4-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 7v5M8 4.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

const COLORS = {
  success: { border: '#059669', color: '#34d399', leftBar: '#059669' },
  error:   { border: '#dc2626', color: '#f87171', leftBar: '#dc2626' },
  warning: { border: '#d97706', color: '#fbbf24', leftBar: '#d97706' },
  info:    { border: '#6366f1', color: '#818cf8', leftBar: '#6366f1' },
};

/* ── Context ─────────────────────────────────── */
export const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
  }, []);

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_id;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]); // max 5
    timers.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const api = {
    show,
    success: (msg, dur)  => show(msg, 'success', dur),
    error:   (msg, dur)  => show(msg, 'error',   dur),
    warning: (msg, dur)  => show(msg, 'warning', dur),
    info:    (msg, dur)  => show(msg, 'info',    dur),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Portal-like fixed container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map((t) => {
          const c = COLORS[t.type] || COLORS.info;
          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'all',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'var(--surface, #1e2235)',
                border: `1px solid var(--border, #2d3348)`,
                borderLeft: `4px solid ${c.leftBar}`,
                borderRadius: 10,
                padding: '12px 14px',
                minWidth: 280, maxWidth: 380,
                boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
                animation: 'toast-in 0.2s ease',
              }}
            >
              <span style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{ICONS[t.type]}</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text1, #f1f5f9)', lineHeight: 1.5 }}>
                {t.message}
              </span>
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text3, #64748b)', padding: 0, flexShrink: 0,
                  fontSize: 16, lineHeight: 1, marginTop: -1,
                }}
              >×</button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

/* ── Hook ─────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
