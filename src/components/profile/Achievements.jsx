const Achievements = ({ achievements = [] }) => {
  const list = Array.isArray(achievements) ? achievements : [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="text-sm font-bold text-white mb-3">Badges</div>

      {list.length === 0 ? (
        <div className="text-sm text-gray-400">No achievements yet. Solve a problem to unlock your first badge.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map((badge) => (
            <span
              key={badge}
              className="text-xs px-3 py-1 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;

