import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import XPBar from '../components/profile/XPBar';
import StatsCard from '../components/profile/StatsCard';
import Achievements from '../components/profile/Achievements';
import TopicCard from '../components/practice/TopicCard';
import { Search, Filter, Rocket, TrendingUp, Calendar, History } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreQuery, setExploreQuery] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Stable fallback objects — defined outside render to avoid recreation
  const fallbackTopics = useMemo(() => [
    { _id: '1', name: 'Arrays', slug: 'arrays', problemCount: 15, solvedCount: 0 },
    { _id: '2', name: 'Dynamic Programming', slug: 'dynamic-programming', problemCount: 12, solvedCount: 0 },
    { _id: '3', name: 'Graphs', slug: 'graphs', problemCount: 10, solvedCount: 0 },
    { _id: '4', name: 'Strings', slug: 'strings', problemCount: 8, solvedCount: 0 }
  ], []);

  const fallbackStats = useMemo(() => ({
    level: 1, xp: 0, currentStreak: 0, longestStreak: 0, achievements: []
  }), []);

  const fallbackAnalytics = useMemo(() => ({
    solved: 0, failed: 0, totalProblemsAttempted: 0, avgTimePerProblemSeconds: 0
  }), []);

  const onLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStats(true);
      setLoadingTopics(true);
      setStatsError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const statsRes = await axios.get('/api/gamification/stats', config);
        setStats(statsRes.data.stats || fallbackStats);
        setAnalytics(statsRes.data.analytics || fallbackAnalytics);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setStats(fallbackStats);
        setAnalytics(fallbackAnalytics);
        setStatsError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }

      try {
        const topicsRes = await axios.get('/api/topics', config);
        setTopics(topicsRes.data.length > 0 ? topicsRes.data : fallbackTopics);
      } catch (err) {
        console.error('Failed to load topics:', err);
        setTopics(fallbackTopics);
      } finally {
        setLoadingTopics(false);
      }

      try {
        const recRes = await axios.get('/api/adaptive/recommendations', config);
        setRecommendation(recRes.data);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      }
    };

    fetchData();
  }, []);

  const filteredTopics = useMemo(() => {
    return topics.filter(topic => 
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topics, searchQuery]);

  const exploreTopics = useMemo(() => {
    return topics.filter(topic => 
      topic.name.toLowerCase().includes(exploreQuery.toLowerCase())
    );
  }, [topics, exploreQuery]);

  const popularTopics = useMemo(() => {
    return [...topics]
      .sort((a, b) => (b.problemCount || 0) - (a.problemCount || 0))
      .slice(0, 6);
  }, [topics]);

  const recentlyPracticed = useMemo(() => {
    // Mock data for recently practiced - in a real app this would come from analytics/progress API
    return topics
      .filter(t => t.solvedCount > 0)
      .slice(0, 4);
  }, [topics]);

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
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Community
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

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left: Profile + Gamification */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions / Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-2xl backdrop-blur-sm group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Rocket className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {recommendation?.recommendedProblem ? 'Continue Practice' : 'Start Your Journey'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {recommendation?.recommendedProblem 
                        ? `Next: ${recommendation.recommendedProblem.title}`
                        : 'Pick a topic to begin mastering coding'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (recommendation?.recommendedProblem) {
                      navigate(`/practice?problem=${recommendation.recommendedProblem._id}`);
                    } else {
                      navigate('/practice');
                    }
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  {recommendation?.recommendedProblem ? 'Resume Practice' : 'Start Practice'}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Daily Challenge</h3>
                    <p className="text-sm text-gray-400">Earn double XP today</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all">
                  Solve Now
                </button>
              </div>

              {/* Popular Topics Mini Section */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Popular Topics</h3>
                  <Rocket className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map(topic => (
                    <button
                      key={topic._id}
                      onClick={() => navigate(`/practice?topic=${topic.slug}`)}
                      className="px-3 py-1 bg-white/5 hover:bg-blue-600/20 border border-white/5 rounded-full text-[10px] font-bold text-gray-400 hover:text-blue-400 transition-all"
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Solved"
                value={loadingStats ? '…' : analytics?.solved ?? 0}
                subtitle="Total"
              />
              <StatsCard
                title="Failed"
                value={loadingStats ? '…' : analytics?.failed ?? 0}
                subtitle="Errors"
              />
              <StatsCard
                title="Accuracy"
                value={loadingStats ? '…' : `${analytics?.totalProblemsAttempted ? Math.round((analytics.solved / analytics.totalProblemsAttempted) * 100) : 0}%`}
                subtitle="Performance"
              />
              <StatsCard
                title="Avg Time"
                value={loadingStats ? '…' : `${analytics?.avgTimePerProblemSeconds ?? 0}s`}
                subtitle="Speed"
              />
            </div>
          </div>

          {/* Right: Streak + Badges */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Personal Progress</h2>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-4">
                <XPBar xp={stats?.xp} level={stats?.level} />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-orange-400">{stats?.currentStreak ?? 0} Days</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Longest Streak</div>
                    <div className="text-2xl font-bold text-blue-400">{stats?.longestStreak ?? 0} Days</div>
                  </div>
                </div>
              </div>
            </div>

            <Achievements achievements={stats?.achievements} />

            {/* Recently Practiced Section */}
            {recentlyPracticed.length > 0 && (
              <div className="bg-white/5 p-6 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Practice</h2>
                  <History className="w-5 h-5 text-purple-400" />
                </div>
                <div className="space-y-3">
                  {recentlyPracticed.map(topic => (
                    <button
                      key={topic._id}
                      onClick={() => navigate(`/practice?topic=${topic.slug}`)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                          <Rocket className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{topic.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {topic.solvedCount} Solved
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Explore Topics Section */}
        <section className="space-y-8 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold">Explore Topics</h2>
              <p className="text-gray-400 mt-1">Quickly jump into any coding domain</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search tags..."
                  value={exploreQuery}
                  onChange={(e) => setExploreQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedDifficulty === diff 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {loadingTopics ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
              ))
            ) : (
              exploreTopics.map(topic => (
                <button
                  key={topic._id}
                  onClick={() => navigate(`/practice?topic=${topic.slug}`)}
                  className="group relative px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  <div className="relative flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-blue-400">
                      {topic.name}
                    </span>
                    {topic.problemCount > 0 && (
                      <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {topic.problemCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Practice Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold">Practice by Topic</h2>
              <p className="text-gray-400 mt-1">Select a domain to master your skills</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {loadingTopics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTopics.map(topic => (
                <TopicCard 
                  key={topic._id} 
                  topic={topic} 
                  onClick={() => navigate(`/practice?topic=${topic.slug}`)}
                />
              ))}
            </div>
          )}

          {filteredTopics.length === 0 && !loadingTopics && (
            <div className="py-20 text-center">
              <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">No topics found matching "{searchQuery}"</h3>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-blue-400 mt-2 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
