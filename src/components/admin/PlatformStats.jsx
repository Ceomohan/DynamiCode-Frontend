const PlatformStats = ({ stats }) => {
  const s = stats || {};

  const items = [
    { label: 'Users', value: s.usersCount ?? 0 },
    { label: 'Total Attempts', value: s.totalAttempts ?? 0 },
    { label: 'Solved Attempts', value: s.totalSolvedAttempts ?? 0 },
    { label: 'Total XP', value: s.totalXP ?? 0 },
    { label: 'Avg Level', value: s.avgLevel ?? 1 },
    { label: 'Solved Awarded', value: s.totalSolvedAwarded ?? 0 },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="text-lg font-bold mb-4">Platform Stats</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-gray-900/40 border border-gray-700 rounded p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              {it.label}
            </div>
            <div className="mt-2 text-2xl font-extrabold">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStats;

