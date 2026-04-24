import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Trophy, 
  Crown, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Target, 
  Zap,
  ChevronRight,
  Filter,
  Users,
  Globe,
  Clock
} from 'lucide-react';

const Leaderboard = () => {
  const [top, setTop] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Global');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  const tabs = [
    { id: 'Global', icon: Globe },
    { id: 'Friends', icon: Users },
    { id: 'Weekly', icon: Clock },
  ];

  const topics = [
    'All Topics', 'Arrays', 'Strings', 'DP', 'Graph', 'Trees', 'Math', 'Sorting'
  ];

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

  const topThree = useMemo(() => top.slice(0, 3), [top]);
  const otherUsers = useMemo(() => top.slice(3), [top]);

  const filteredUsers = useMemo(() => {
    return otherUsers.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [otherUsers, searchQuery]);

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-400';
  };

  const getBadgeIcon = (xp) => {
    if (xp > 5000) return 'Diamond';
    if (xp > 2000) return 'Platinum';
    if (xp > 1000) return 'Gold';
    return 'Bronze';
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3 h-3" />
              <span>Competitive Scene</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Leaderboard</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Compete with the world's best coders, climb the ranks, and showcase your algorithmic prowess.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Topic Dropdown */}
            <div className="relative group w-full sm:w-48">
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-sm font-bold"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic} className="bg-[#0f172a]">{topic}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">
            {/* Top 3 Users Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {/* Rank 2 */}
              {topThree[1] && (
                <div className="order-2 sm:order-1 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-gray-400/20 to-transparent rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl text-center flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-400/30 overflow-hidden bg-gray-800">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`} alt={topThree[1].username} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">2</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold truncate w-full px-4">{topThree[1].username}</h3>
                      <p className="text-gray-400 text-sm">{getBadgeIcon(topThree[1].xp)} Tier</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white">{topThree[1].xp}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total XP</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 */}
              {topThree[0] && (
                <div className="order-1 sm:order-2 relative group scale-105 z-10">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/50 to-transparent rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white/10 border border-yellow-500/30 rounded-[2.5rem] p-10 backdrop-blur-xl text-center flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <Crown className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                      </div>
                      <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden bg-gray-800 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`} alt={topThree[0].username} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-black text-lg">1</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black truncate w-full px-4">{topThree[0].username}</h3>
                      <p className="text-yellow-400/80 text-sm font-bold uppercase tracking-widest">Elite Champion</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-black text-white">{topThree[0].xp}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total XP</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {topThree[2] && (
                <div className="order-3 sm:order-3 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-600/20 to-transparent rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl text-center flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-amber-600/30 overflow-hidden bg-gray-800">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`} alt={topThree[2].username} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">3</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold truncate w-full px-4">{topThree[2].username}</h3>
                      <p className="text-gray-400 text-sm">{getBadgeIcon(topThree[2].xp)} Tier</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white">{topThree[2].xp}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total XP</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard Table */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Top Contenders</h2>
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search coder..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Rank</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Coder</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">XP Points</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Solved</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Streak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan="5" className="px-6 py-6 h-16 bg-white/5" />
                          </tr>
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-20 text-center text-gray-500 font-bold">No data matches your search.</td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.userId} 
                            className={`group hover:bg-white/5 transition-all duration-300 ${user.userId === me?.userId ? 'bg-blue-500/10' : ''}`}
                          >
                            <td className="px-6 py-5">
                              <span className={`text-lg font-black ${getRankColor(user.rank)}`}>#{user.rank}</span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-800 border border-white/10 overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.username} />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-200 group-hover:text-white transition-colors">{user.username}</div>
                                  <div className="text-[10px] text-gray-500 font-bold uppercase">{getBadgeIcon(user.xp)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-2 text-blue-400">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="font-black text-lg">{user.xp.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-2 text-purple-400">
                                <Target className="w-4 h-4" />
                                <span className="font-bold">{user.totalSolved}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-1.5 text-orange-500">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-bold">12d</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Your Rank Card */}
            {me && (
              <div className="sticky top-8 space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
                  <div className="relative bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Your Standing</h3>
                      <History className="w-5 h-5 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-10">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl border-2 border-blue-500/50 overflow-hidden bg-gray-800">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${me.username}`} alt={me.username} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">#{me.rank}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-black">{me.username}</div>
                        <div className="text-blue-400 text-sm font-bold uppercase tracking-widest">{getBadgeIcon(me.xp)} Tier</div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Next Rank Up</p>
                          <p className="text-lg font-black text-white">#{Math.max(1, me.rank - 5)}</p>
                        </div>
                        <p className="text-sm font-bold text-blue-400">120 XP Left</p>
                      </div>
                      
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '65%' }} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total XP</p>
                          <p className="text-xl font-black text-blue-400">{me.xp}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Solved</p>
                          <p className="text-xl font-black text-purple-400">{me.totalSolved}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                <button className="w-full group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x" />
                  <div className="relative bg-[#050b1a] rounded-2xl py-4 px-6 flex items-center justify-between group-hover:bg-transparent transition-colors">
                    <span className="font-black text-lg">Practice Now</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Leaderboard Analytics (Mock) */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Rank Activity
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Weekly Change', value: '+12 Ranks', icon: TrendingUp, color: 'text-green-400' },
                      { label: 'XP This Week', value: '450 XP', icon: Zap, color: 'text-yellow-400' },
                      { label: 'Avg Difficulty', value: 'Medium', icon: Target, color: 'text-blue-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-xs font-medium text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-xs font-black">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

