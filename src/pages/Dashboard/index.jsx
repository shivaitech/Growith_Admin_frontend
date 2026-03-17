import { useSelector } from 'react-redux';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import Initials from '../../components/common/Initials';
import BarLineChart from '../../components/charts/BarLineChart';
import DonutChart from '../../components/charts/DonutChart';
import { investors } from '../../data/mockData';

const stats = [
  { label: 'Total Investors', value: '8', delta: '+12% this month', up: true, icon: 'users', color: '#1a56db' },
  { label: 'Total Invested', value: '$373K', delta: '+8.4% growth', up: true, icon: 'coins', color: '#059669' },
  { label: 'Pending KYC', value: '3', delta: 'Needs review', up: false, icon: 'kyc', color: '#d97706' },
  { label: 'Pending Payments', value: '3', delta: '$140,500 total', up: null, icon: 'payment', color: '#6366f1' },
];

export default function Dashboard() {
  const dark = useSelector((s) => s.ui.theme) === 'dark';

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard Overview</div>
          <div className="page-sub">Welcome back, Alex. Platform is running smoothly.</div>
        </div>
        <span className="chip"><Icon n="filter" size={12} />Last 30 days</span>
      </div>

      <div className="grid-4">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>
              <Icon n={s.icon} size={17} />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div
              className={`stat-delta ${s.up === true ? 'delta-up' : s.up === false ? 'delta-down' : ''}`}
              style={{ color: s.up === null ? 'var(--text3)' : undefined }}
            >
              {s.up === true && <Icon n="up" size={11} />}
              {s.up === false && <Icon n="down" size={11} />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Investment & Growth (6 Months)</div>
          <div className="chart-wrap"><BarLineChart dark={dark} /></div>
        </div>
        <div className="card">
          <div className="section-title">KYC Status Breakdown</div>
          <div className="chart-wrap"><DonutChart dark={dark} /></div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Recent Investor Activity</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Investor</th><th>Country</th><th>KYC Status</th>
                <th>Invested</th><th>Tokens</th><th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {investors.slice(0, 6).map((i) => (
                <tr key={i.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Initials name={i.name} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{i.name}</div>
                        <div className="td-muted">{i.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="chip" style={{ fontSize: 11, padding: '3px 8px' }}>{i.country}</span></td>
                  <td><Badge status={i.kyc} /></td>
                  <td style={{ fontFamily: 'DM Mono', fontWeight: 600, color: 'var(--emerald)' }}>${i.invested.toLocaleString()}</td>
                  <td style={{ fontFamily: 'DM Mono', fontSize: 12, color: 'var(--text2)' }}>{i.tokens.toLocaleString()}</td>
                  <td className="td-muted">{i.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
