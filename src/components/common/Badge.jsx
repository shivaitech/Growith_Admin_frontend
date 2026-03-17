const map = {
  Approved: 'badge-green',
  Completed: 'badge-green',
  Active: 'badge-green',
  Pending: 'badge-amber',
  'Manual Review': 'badge-blue',
  Rejected: 'badge-red',
  L1: 'badge-blue',
  L2: 'badge-green',
  L3: 'badge-gray',
};

const dots = {
  Approved: '#059669',
  Completed: '#059669',
  Active: '#059669',
  Pending: '#d97706',
  'Manual Review': '#1a56db',
  Rejected: '#dc2626',
};

export default function Badge({ status }) {
  return (
    <span className={`badge ${map[status] || 'badge-gray'}`}>
      {dots[status] && (
        <span
          style={{ width: 5, height: 5, borderRadius: '50%', background: dots[status], display: 'inline-block' }}
        />
      )}
      {status}
    </span>
  );
}
