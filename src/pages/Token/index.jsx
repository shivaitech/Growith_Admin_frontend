import { useState } from 'react';
import Icon from '../../components/common/Icon';
import Initials from '../../components/common/Initials';
import { investors } from '../../data/mockData';

const approved = investors.filter((i) => i.kyc === 'Approved');

export default function Token() {
  const [enabled, setEnabled] = useState({});

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <div className="page-title">Token Allocation</div>
          <div className="page-sub">Manage token distribution and vesting</div>
        </div>
        <button className="btn btn-primary"><Icon n="coins" size={13} />Batch Allocate</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Investor</th><th>Invested</th><th>Tokens Allocated</th>
                <th>Rate</th><th>Vesting Progress</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((i) => {
                const on = enabled[i.id] !== false;
                return (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Initials name={i.name} gradient="linear-gradient(135deg,#059669,#0ea5e9)" />
                        <span style={{ fontWeight: 500 }}>{i.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>${i.invested.toLocaleString()}</td>
                    <td style={{ fontFamily: 'DM Mono', fontWeight: 700, color: 'var(--accent)' }}>{i.tokens.toLocaleString()}</td>
                    <td className="td-muted">2 NVT/$1</td>
                    <td>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text3)' }}>
                          <span>40% vested</span>
                          <span style={{ fontFamily: 'DM Mono' }}>{Math.round(i.tokens * 0.4).toLocaleString()}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '40%' }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className={`toggle ${on ? 'on' : 'off'}`}
                          onClick={() => setEnabled((p) => ({ ...p, [i.id]: !on }))}
                        />
                        <span style={{ fontSize: 12, color: on ? 'var(--emerald)' : 'var(--text3)', fontWeight: 500 }}>
                          {on ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
