export default function Skeleton() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skel" style={{ height: 106, flex: 1 }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        {[1, 2].map((i) => (
          <div key={i} className="skel" style={{ height: 260, flex: 1 }} />
        ))}
      </div>
      <div className="skel" style={{ height: 220 }} />
    </div>
  );
}
