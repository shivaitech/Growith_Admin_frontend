import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function DonutChart({ dark }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const existing = Chart.getChart(ref.current);
    if (existing) existing.destroy();

    new Chart(ref.current.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Approved', 'Pending', 'Manual Review', 'Rejected'],
        datasets: [
          {
            data: [5, 3, 1, 1],
            backgroundColor: dark
              ? ['rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)', 'rgba(59,130,246,0.7)', 'rgba(239,68,68,0.7)']
              : ['rgba(5,150,105,0.72)', 'rgba(217,119,6,0.72)', 'rgba(26,86,219,0.72)', 'rgba(220,38,38,0.72)'],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: dark ? '#8b95a9' : '#5a6478',
              font: { size: 11, family: 'DM Sans' },
              padding: 12,
              boxWidth: 10,
            },
          },
        },
      },
    });
  }, [dark]);

  return <canvas ref={ref} />;
}
