const XPBar = ({ xp = 0, level = 1 }) => {
  const safeXP = Math.max(0, Number(xp) || 0);
  const safeLevel = Math.max(1, Number(level) || 1);

  const xpPerLevel = 100;
  const currentLevelXP = safeXP % xpPerLevel;
  const progress = (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-300 font-semibold">XP Progress</div>
        <div className="text-xs text-gray-400">
          Level <span className="text-blue-400 font-bold">{safeLevel}</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded h-3 overflow-hidden">
        <div
          className="h-3 bg-blue-600"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>
          {currentLevelXP}/{xpPerLevel} XP
        </span>
        <span className="text-gray-500">Total: {safeXP} XP</span>
      </div>
    </div>
  );
};

export default XPBar;

