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
    <div className="min-h-screen bg-[#050510] text-white font-sans p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{user?.name}</span>
              </h1>
              {headerBadge}
            </div>
            <p className="text-gray-400">Your coding journey is looking great today.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/practice')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105"
            >
              Practice Now
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Leaderboard
            </button>
            <button
              onClick={() => navigate('/friends')}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Friends
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-xl font-bold hover:bg-purple-500/30 transition-all backdrop-blur-sm"
              >
                Admin
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/20 transition-all backdrop-blur-sm"
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
