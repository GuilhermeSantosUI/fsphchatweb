export function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total de notificações', value: '—' },
          { label: 'Usuários ativos', value: '—' },
          { label: 'Integrações', value: '—' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {label}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
