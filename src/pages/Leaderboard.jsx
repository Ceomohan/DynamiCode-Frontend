import { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [top, setTop] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [topRes, meRes] = await Promise.all([
          axios.get('/api/leaderboard/top?limit=50', config),
          axios.get('/api/leaderboard/me', config),
        ]);

        setTop(topRes.data.top || []);
        setMe(meRes.data.me || null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          {me && (
            <div className="text-sm bg-gray-800 border border-gray-700 rounded px-4 py-2">
              Your rank: <span className="font-bold text-blue-400">#{me.rank}</span> • XP:{' '}
              <span className="font-bold text-green-400">{me.xp}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-600 text-red-200 p-4 rounded">
            {error}
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-2 px-4 py-3 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700">
            <div>Rank</div>
            <div className="col-span-2">Username</div>
            <div>XP</div>
            <div>Solved</div>
          </div>

          {loading ? (
            <div className="p-6 text-gray-400">Loading…</div>
          ) : top.length === 0 ? (
            <div className="p-6 text-gray-400">No leaderboard data yet.</div>
          ) : (
            top.map((row) => (
              <div
                key={row.userId}
                className="grid grid-cols-5 gap-2 px-4 py-3 border-b border-gray-700 hover:bg-gray-700/30"
              >
                <div className="font-bold">#{row.rank}</div>
                <div className="col-span-2">{row.username}</div>
                <div className="text-green-400 font-semibold">{row.xp}</div>
                <div className="text-blue-300">{row.totalSolved}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

