import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function BarLineChart({ dark }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const existing = Chart.getChart(ref.current);
    if (existing) existing.destroy();

    new Chart(ref.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Investment ($K)',
            data: [85, 120, 165, 210, 178, 245],
            backgroundColor: dark ? 'rgba(59,130,246,0.3)' : 'rgba(26,86,219,0.18)',
            borderColor: dark ? '#3b82f6' : '#1a56db',
            borderWidth: 2,
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'New Investors',
            data: [12, 18, 24, 31, 28, 36],
            type: 'line',
            borderColor: dark ? '#10b981' : '#059669',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: dark ? '#10b981' : '#059669',
            yAxisID: 'y1',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: dark ? '#8b95a9' : '#5a6478', font: { size: 11, family: 'DM Sans' }, boxWidth: 10, padding: 16 },
          },
        },
        scales: {
          x: {
            grid: { color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
            ticks: { color: dark ? '#8b95a9' : '#5a6478', font: { size: 11 } },
          },
          y: {
            grid: { color: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
            ticks: { color: dark ? '#8b95a9' : '#5a6478', font: { size: 11 }, callback: (v) => v + 'K' },
            position: 'left',
          },
          y1: {
            grid: { display: false },
            ticks: { color: dark ? '#10b981' : '#059669', font: { size: 11 } },
            position: 'right',
          },
        },
      },
    });
  }, [dark]);

  return <canvas ref={ref} />;
}
