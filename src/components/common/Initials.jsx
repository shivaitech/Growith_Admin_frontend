export default function Initials({ name, gradient = 'linear-gradient(135deg,#6366f1,#8b5cf6)', size = 32 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('');
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        color: '#fff',
        fontSize: size * 0.35,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
