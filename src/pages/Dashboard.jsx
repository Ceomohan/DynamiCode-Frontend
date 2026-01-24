import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import XPBar from '../components/profile/XPBar';
import StatsCard from '../components/profile/StatsCard';
import Achievements from '../components/profile/Achievements';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get('/api/gamification/stats', config);
        setStats(res.data.stats);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error('Failed to load gamification stats:', err);
        setStatsError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const headerBadge = useMemo(() => {
    if (!stats) return null;
    return (
      <div className="flex items-center space-x-3">
        <div className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
          <span className="text-gray-400">Level</span>{' '}
          <span className="text-blue-400 font-bold">{stats.level}</span>
        </div>
        <div className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
          <span className="text-gray-400">XP</span>{' '}
          <span className="text-green-400 font-bold">{stats.xp}</span>
        </div>
      </div>
    );
  }, [stats]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold">DynamiCode Dashboard</h1>
            {headerBadge}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded font-bold transition"
            >
              Leaderboard
            </button>
            <button
              onClick={() => navigate('/friends')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded font-bold transition"
            >
              Friends
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-purple-700 hover:bg-purple-600 border border-purple-500 px-4 py-2 rounded font-bold transition"
              >
                Admin
              </button>
            )}
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold transition"
            >
              Logout
            </button>
          </div>
        </header>

        {statsError && (
          <div className="mb-6 bg-red-900/50 border border-red-600 text-red-200 p-4 rounded">
            {statsError}
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile + Gamification */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-2">Welcome, {user && user.name}!</h2>
              <p className="text-gray-400 mb-4">Your progress updates automatically as you practice.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/40 border border-gray-700 rounded p-4">
                  <div className="text-sm font-bold mb-2">User Profile</div>
                  <p className="text-sm">
                    <span className="font-semibold text-blue-400">Email:</span> {user && user.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-semibold text-gray-400">ID:</span> {user && user._id}
                  </p>
                </div>

                <div>
                  <XPBar xp={stats?.xp} level={stats?.level} />
                </div>
              </div>
            </div>

            {/* Analytics summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Solved"
                value={loadingStats ? '…' : analytics?.solved ?? 0}
                subtitle="Problems solved (attempts)"
              />
              <StatsCard
                title="Failed"
                value={loadingStats ? '…' : analytics?.failed ?? 0}
                subtitle="Failed attempts"
              />
              <StatsCard
                title="Attempts"
                value={loadingStats ? '…' : analytics?.totalProblemsAttempted ?? 0}
                subtitle="Total runs recorded"
              />
              <StatsCard
                title="Avg Time"
                value={loadingStats ? '…' : `${analytics?.avgTimePerProblemSeconds ?? 0}s`}
                subtitle="Average time per attempt"
              />
            </div>
          </div>

          {/* Right: Streak + Badges + CTA */}
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Stats</h2>
                <div className="text-xs text-gray-400">Gamification</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <StatsCard
                  title="Level"
                  value={loadingStats ? '…' : stats?.level ?? 1}
                  subtitle="Based on XP"
                />
                <StatsCard
                  title="XP"
                  value={loadingStats ? '…' : stats?.xp ?? 0}
                  subtitle="Total XP"
                />
                <StatsCard
                  title="Streak"
                  value={loadingStats ? '…' : stats?.currentStreak ?? 0}
                  subtitle="Current streak (days)"
                />
                <StatsCard
                  title="Longest"
                  value={loadingStats ? '…' : stats?.longestStreak ?? 0}
                  subtitle="Best streak (days)"
                />
              </div>
              <div className="mt-4">
                <StatsCard
                  title="Total Solved"
                  value={loadingStats ? '…' : stats?.totalProblemsSolved ?? 0}
                  subtitle="Awarded solves (XP-based)"
                />
              </div>
            </div>

            <Achievements achievements={stats?.achievements} />

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center border border-gray-700">
              <h2 className="text-2xl font-bold mb-3">Start Practicing</h2>
              <p className="text-gray-400 mb-6 text-center">
                Generate a new AI coding problem and earn XP as you solve.
              </p>
              <button
                onClick={() => navigate('/practice')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-xl font-bold transition w-full"
              >
                New Session
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
