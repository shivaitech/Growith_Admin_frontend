import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AuthLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="auth-wrap">
      {/* Finance chart background */}
      <svg className="auth-bg-svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* Horizontal grid lines */}
        {[100,200,300,400,500,600,700,800].map((y) => (
          <line key={y} x1="0" y1={y} x2="1400" y2={y} stroke="#4f6ef7" strokeWidth="0.5" strokeDasharray="6 10" />
        ))}
        {/* Vertical grid lines */}
        {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="900" stroke="#4f6ef7" strokeWidth="0.5" strokeDasharray="4 12" />
        ))}

        {/* Chart line 1 — main trend (blue) */}
        <polyline
          fill="none" stroke="#3b5bff" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
          points="0,550 80,520 160,540 240,480 320,500 400,450 480,430 560,460 640,400 720,380 800,410 880,350 960,330 1040,360 1120,300 1200,280 1300,240 1400,210"
        />
        {/* Area fill under line 1 */}
        <polygon
          fill="url(#grad1)" stroke="none" opacity="0.25"
          points="0,550 80,520 160,540 240,480 320,500 400,450 480,430 560,460 640,400 720,380 800,410 880,350 960,330 1040,360 1120,300 1200,280 1300,240 1400,210 1400,900 0,900"
        />

        {/* Chart line 2 — secondary (purple) */}
        <polyline
          fill="none" stroke="#7c3aed" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
          points="0,680 100,660 200,700 300,640 400,670 500,620 600,650 700,600 800,630 900,580 1000,560 1100,590 1200,540 1300,510 1400,490"
        />

        {/* Chart line 3 — upper trend (lighter) */}
        <polyline
          fill="none" stroke="#60a5fa" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
          points="0,300 120,320 220,290 320,310 420,270 520,290 620,250 720,270 820,230 920,250 1020,210 1120,230 1220,195 1320,215 1400,190"
        />

        {/* Chart line 4 — volatile small line (accent) */}
        <polyline
          fill="none" stroke="#34d399" strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round"
          points="0,760 60,740 110,770 170,745 230,760 290,730 350,750 410,720 470,745 540,710 610,730 680,700 760,720 840,690 920,710 1000,680 1100,695 1200,660 1300,675 1400,645"
        />

        {/* Data point dots on line 1 */}
        {[[80,520],[240,480],[400,450],[560,460],[720,380],[880,350],[1040,360],[1200,280],[1400,210]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#3b5bff" />
        ))}
        {/* Data point dots on line 2 */}
        {[[200,700],[400,670],[600,650],[800,630],[1000,560],[1200,540],[1400,490]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2" fill="#7c3aed" />
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b5bff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b5bff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  );
}
