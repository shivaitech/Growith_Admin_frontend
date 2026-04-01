import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import { tokenList, affiliatePrograms as initialPrograms } from '../../data/mockData';

const BASE_URL = 'https://growith.io/program/';
const STEPS = ['Select Token', 'Program Details', 'Commission Structure', 'Review & Launch'];

const TOKEN_COLORS = {
  shivai: 'linear-gradient(135deg,#5C27FE,#1a56db)',
  greenvolt: 'linear-gradient(135deg,#059669,#0ea5e9)',
  novamed: 'linear-gradient(135deg,#e11d48,#f97316)',
  quantumpay: 'linear-gradient(135deg,#0891b2,#6366f1)',
};

function genCode(ticker, name) {
  const slug = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${ticker}-${slug}-${rand}`;
}

function StepBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 32, maxWidth: 680 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: i < step ? 'var(--emerald)' : i === step ? 'var(--accent)' : 'var(--surface2)',
              color: i <= step ? '#fff' : 'var(--text3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800,
              border: '2px solid',
              borderColor: i < step ? 'var(--emerald)' : i === step ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.2s',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: 10, fontWeight: i === step ? 700 : 400, color: i === step ? 'var(--accent)' : i < step ? 'var(--emerald)' : 'var(--text3)', whiteSpace: 'nowrap' }}>{s}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < step ? 'var(--emerald)' : 'var(--border)', margin: '16px 10px 0', minWidth: 16, transition: 'background 0.2s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
      {children}
      {hint && <span style={{ fontWeight: 400, color: 'var(--text3)', marginLeft: 6 }}>({hint})</span>}
    </label>
  );
}

const defaultForm = {
  token: null,
  name: '', description: '',
  startDate: '', endDate: '',
  maxAffiliates: '', minInvest: 1000,
  l1: 5, l2: 3, l3: 1.5,
  cookieDays: 30, payoutThreshold: 100,
  landingUrl: '',
};

export default function AffiliatePrograms() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'success'
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const resetCreate = () => {
    setStep(0);
    setForm(defaultForm);
    setGeneratedCode('');
    setView('list');
  };

  const canNext = () => {
    if (step === 0) return !!form.token;
    if (step === 1) return form.name.trim().length >= 3 && !!form.startDate;
    return true;
  };

  const handleLaunch = () => {
    const code = genCode(form.token.ticker, form.name);
    setGeneratedCode(code);
    const newProg = {
      id: `PROG-${String(programs.length + 1).padStart(3, '0')}`,
      name: form.name,
      tokenId: form.token.id, tokenName: form.token.name, ticker: form.token.ticker,
      description: form.description,
      status: 'Active',
      affiliates: 0, totalRaised: 0,
      l1: Number(form.l1), l2: Number(form.l2), l3: Number(form.l3),
      startDate: form.startDate, endDate: form.endDate,
      code,
      minInvest: form.minInvest, maxAffiliates: form.maxAffiliates,
      cookieDays: form.cookieDays, payoutThreshold: form.payoutThreshold,
      created: new Date().toISOString().slice(0, 10),
    };
    setPrograms((prev) => [newProg, ...prev]);
    setView('success');
  };

  const copyLink = (code, id) => {
    navigator.clipboard.writeText(BASE_URL + code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStatus = (id) =>
    setPrograms((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } : p));

  // ── Success ────────────────────────────────────────────────────
  if (view === 'success') {
    const link = BASE_URL + generatedCode;
    return (
      <div className="animate-in">
        <div style={{ maxWidth: 580, margin: '48px auto', textAlign: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'rgba(5,150,105,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 34 }}>🚀</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Program Launched!</div>
          <div style={{ color: 'var(--text2)', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
            <strong>{form.name}</strong> is now live. Share the program link with your affiliates so they can register and get their personal referral links.
          </div>

          {/* Link box */}
          <div className="card" style={{ textAlign: 'left', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Program Link</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '10px 14px', border: '1px solid var(--border)' }}>
              <Icon n="link" size={15} />
              <span style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text)', flex: 1, wordBreak: 'break-all' }}>{link}</span>
              <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => copyLink(generatedCode, 'success')}>
                <Icon n="copy" size={12} />{copiedId === 'success' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ textAlign: 'left', marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 28px' }}>
              {[
                ['Token', `${form.token?.name} (${form.token?.ticker})`],
                ['Start Date', form.startDate],
                ['End Date', form.endDate || 'No expiry'],
                ['Min. Investment', `$${Number(form.minInvest).toLocaleString()}`],
                ['Max Affiliates', form.maxAffiliates || 'Unlimited'],
                ['Cookie Duration', `${form.cookieDays} days`],
                ['L1 Commission', `${form.l1}%`],
                ['L2 Commission', `${form.l2}%`],
                ['L3 Commission', `${form.l3}%`],
                ['Min. Payout', `$${form.payoutThreshold}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => { setStep(0); setForm(defaultForm); setGeneratedCode(''); setView('create'); }}>
              <Icon n="plus" size={13} /> Create Another
            </button>
            <button className="btn btn-ghost" onClick={resetCreate}>
              View All Programs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Create wizard ──────────────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="animate-in">
        {/* Wizard header */}
        <div className="page-header" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }} onClick={resetCreate}>
              <Icon n="x" size={13} />
            </button>
            <div>
              <div className="page-title">Create Affiliate Program</div>
              <div className="page-sub">Step {step + 1} of {STEPS.length} — {STEPS[step]}</div>
            </div>
          </div>
        </div>

        <StepBar step={step} />

        {/* ── Step 0: Select Token ── */}
        {step === 0 && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Choose which token this affiliate program will promote.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(218px, 1fr))', gap: 14 }}>
              {tokenList.map((t) => {
                const selected = form.token?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => set('token', t)}
                    style={{
                      background: 'var(--surface)',
                      border: '2px solid',
                      borderColor: selected ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: 18,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      position: 'relative',
                      boxShadow: selected ? '0 0 0 3px rgba(26,86,219,0.12)' : 'none',
                    }}
                  >
                    {selected && (
                      <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon n="check" size={12} />
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: TOKEN_COLORS[t.id] || 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '-0.5px', flexShrink: 0,
                      }}>
                        {t.ticker.slice(0, 3)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{t.ticker}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6, minHeight: 36 }}>
                      {t.description?.slice(0, 75)}{t.description?.length > 75 ? '…' : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Badge status={t.status === 'LIVE' ? 'Active' : 'Pending'} />
                      <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{t.blockchain}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 1: Program Details ── */}
        {step === 1 && (
          <div className="card" style={{ maxWidth: 680 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Program Name <span style={{ color: 'var(--red)' }}>*</span></FieldLabel>
                <input
                  className="filter-input" style={{ width: '100%' }}
                  placeholder={`${form.token?.name} Affiliate Program`}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel hint="optional">Description</FieldLabel>
                <textarea
                  className="filter-input"
                  style={{ width: '100%', minHeight: 76, resize: 'vertical' }}
                  placeholder="Describe the program goals, target audience, and incentives…"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Start Date <span style={{ color: 'var(--red)' }}>*</span></FieldLabel>
                <input className="filter-input" style={{ width: '100%' }} type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
              </div>
              <div>
                <FieldLabel hint="optional">End Date</FieldLabel>
                <input className="filter-input" style={{ width: '100%' }} type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Min. Investment ($)</FieldLabel>
                <input className="filter-input" style={{ width: '100%' }} type="number" min="0" value={form.minInvest} onChange={(e) => set('minInvest', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>Referral only qualifies above this amount</div>
              </div>
              <div>
                <FieldLabel hint="blank = unlimited">Max Affiliates</FieldLabel>
                <input className="filter-input" style={{ width: '100%' }} type="number" min="1" placeholder="e.g. 50" value={form.maxAffiliates} onChange={(e) => set('maxAffiliates', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>Cap on affiliate enrollment</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel hint="optional">Custom Landing Page URL</FieldLabel>
                <input className="filter-input" style={{ width: '100%' }} placeholder={`https://growith.io/${form.token?.id || 'token'}`} value={form.landingUrl} onChange={(e) => set('landingUrl', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>Affiliates' links will redirect here. Defaults to the token's page.</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Commission Structure ── */}
        {step === 2 && (
          <div style={{ maxWidth: 680 }}>
            {/* Tier cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
              {[
                { label: 'Tier 1', sublabel: 'L1', key: 'l1', desc: 'Direct referral — person you signed up', color: '#1a56db', bg: 'rgba(26,86,219,0.08)' },
                { label: 'Tier 2', sublabel: 'L2', key: 'l2', desc: "Your referral's referral", color: 'var(--emerald)', bg: 'rgba(5,150,105,0.08)' },
                { label: 'Tier 3', sublabel: 'L3', key: 'l3', desc: 'Third-degree referral chain', color: 'var(--text2)', bg: 'var(--surface2)' },
              ].map(({ label, sublabel, key, desc, color, bg }) => (
                <div key={key} className="card" style={{ textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 900, fontSize: 14, color }}>{sublabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.5 }}>{desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <input
                      type="number" min="0" max="50" step="0.5"
                      className="filter-input"
                      style={{ width: 76, textAlign: 'center', fontFamily: 'DM Mono', fontWeight: 800, fontSize: 18, padding: '8px 4px', color }}
                      value={form[key]}
                      onChange={(e) => set(key, e.target.value)}
                    />
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text3)' }}>%</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>commission rate</div>
                </div>
              ))}
            </div>

            {/* Tracking settings */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 18 }}>Tracking & Payout Settings</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <FieldLabel>Cookie / Tracking Duration (days)</FieldLabel>
                  <input className="filter-input" style={{ width: '100%' }} type="number" min="1" value={form.cookieDays} onChange={(e) => set('cookieDays', e.target.value)} />
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>Referral is credited if user signs up within this window</div>
                </div>
                <div>
                  <FieldLabel>Minimum Payout Threshold ($)</FieldLabel>
                  <input className="filter-input" style={{ width: '100%' }} type="number" min="1" value={form.payoutThreshold} onChange={(e) => set('payoutThreshold', e.target.value)} />
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>Affiliate must earn this much before payout is triggered</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Review & Launch ── */}
        {step === 3 && (
          <div style={{ maxWidth: 680 }}>
            {/* Token badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '14px 18px', background: 'rgba(26,86,219,0.05)', border: '1px solid rgba(26,86,219,0.15)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: TOKEN_COLORS[form.token?.id] || 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                {form.token?.ticker?.slice(0, 3)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{form.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{form.token?.name} · {form.token?.ticker} · {form.token?.blockchain}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}><Badge status="Active" /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Program Details */}
              <div className="card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 14 }}>Program Details</div>
                {[
                  ['Start Date', form.startDate || '—'],
                  ['End Date', form.endDate || 'No expiry'],
                  ['Min. Investment', `$${Number(form.minInvest).toLocaleString()}`],
                  ['Max Affiliates', form.maxAffiliates || 'Unlimited'],
                  ['Cookie Duration', `${form.cookieDays} days`],
                  ['Min. Payout', `$${form.payoutThreshold}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'DM Mono' }}>{val}</span>
                  </div>
                ))}
              </div>
              {/* Commission Structure */}
              <div className="card">
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 14 }}>Commission Structure</div>
                {[
                  ['L1 (Direct)', `${form.l1}%`, '#1a56db'],
                  ['L2 (2nd tier)', `${form.l2}%`, 'var(--emerald)'],
                  ['L3 (3rd tier)', `${form.l3}%`, 'var(--text2)'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{label}</span>
                    <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'DM Mono', color }}>{val}</span>
                  </div>
                ))}
                <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 12px', textAlign: 'center', marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>Total max commission</div>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'DM Mono', color: 'var(--accent)' }}>{(Number(form.l1) + Number(form.l2) + Number(form.l3)).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Link preview */}
            <div style={{ background: 'rgba(26,86,219,0.04)', border: '1px solid rgba(26,86,219,0.2)', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <Icon n="link" size={18} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Your unique program link will be generated on launch</div>
                <div style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text2)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>
                  {BASE_URL}{form.token?.ticker}-XXXXX-XXX
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, lineHeight: 1.6 }}>
                  Share this link with affiliates. They register under this program and automatically receive their personal referral links with commission tracking.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, maxWidth: 680, paddingBottom: 40 }}>
          <button className="btn btn-ghost" onClick={() => step === 0 ? resetCreate() : setStep(step - 1)}>
            {step === 0 ? <><Icon n="x" size={13} />Cancel</> : '← Back'}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext()} style={{ padding: '9px 22px' }}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleLaunch} style={{ padding: '10px 28px', fontSize: 14, fontWeight: 700 }}>
              <Icon n="airdrop" size={15} /> Launch Program
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Programs list ──────────────────────────────────────────────
  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Affiliate Programs</div>
          <div className="page-sub">{programs.length} program{programs.length !== 1 ? 's' : ''} configured</div>
        </div>
        <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 14, fontWeight: 600, gap: 8 }} onClick={() => setView('create')}>
          <Icon n="plus" size={15} /> Create Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(26,86,219,0.1)', color: 'var(--accent)' }}><Icon n="affiliate" size={17} /></div>
          <div className="stat-label">Active Programs</div>
          <div className="stat-value">{programs.filter((p) => p.status === 'Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--emerald)' }}><Icon n="users" size={17} /></div>
          <div className="stat-label">Total Affiliates</div>
          <div className="stat-value">{programs.reduce((a, p) => a + p.affiliates, 0)}</div>
          <div className="stat-delta delta-up"><Icon n="up" size={11} />Across all programs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217,119,6,0.1)', color: 'var(--amber)' }}><Icon n="coins" size={17} /></div>
          <div className="stat-label">Total Raised via Affiliates</div>
          <div className="stat-value">${programs.reduce((a, p) => a + p.totalRaised, 0).toLocaleString()}</div>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <div className="empty-title">No affiliate programs yet</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Create your first program to assign tokens and start generating referral links</div>
            <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => setView('create')}>
              <Icon n="plus" size={13} /> Create Program
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Token</th>
                  <th>Commission (L1 / L2 / L3)</th>
                  <th>Affiliates</th>
                  <th>Total Raised</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                      <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text3)' }}>{BASE_URL + p.code}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: TOKEN_COLORS[p.tokenId] || 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
                          {p.ticker?.slice(0, 3)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>{p.tokenName}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{p.ticker}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700, color: '#1a56db' }}>{p.l1}%</span>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700, color: 'var(--emerald)' }}>{p.l2}%</span>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span style={{ fontFamily: 'DM Mono', fontSize: 13, fontWeight: 700, color: 'var(--text3)' }}>{p.l3}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{p.affiliates}</td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--emerald)' }}>${p.totalRaised.toLocaleString()}</td>
                    <td className="td-muted" style={{ fontSize: 11 }}>
                      {p.startDate}{p.endDate ? ` → ${p.endDate}` : ' → ∞'}
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => copyLink(p.code, p.id)}>
                          <Icon n="copy" size={12} />{copiedId === p.id ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                          className={`btn btn-sm ${p.status === 'Active' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleStatus(p.id)}
                          style={{ fontSize: 11 }}
                        >
                          {p.status === 'Active' ? 'Pause' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
