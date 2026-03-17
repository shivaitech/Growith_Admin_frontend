export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {['Page Views', 'Sessions', 'Bounce Rate'].map((label) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-40 flex flex-col justify-between">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-indigo-600">—</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400">
        Analytics Chart (placeholder)
      </div>
    </div>
  );
}
