import { memo } from 'react';

const StatsCard = memo(({ title, value, subtitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">{title}</div>
    <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
    {subtitle && <div className="mt-1 text-xs text-gray-400">{subtitle}</div>}
  </div>
));

StatsCard.displayName = 'StatsCard';
export default StatsCard;
