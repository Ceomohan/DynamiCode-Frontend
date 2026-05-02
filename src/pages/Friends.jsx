import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trophy, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  User, 
  ExternalLink, 
  Activity,
  Check,
  X,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

const Friends = () => {
  const [receiver, setReceiver] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [friendsRes, requestsRes] = await Promise.all([
        axios.get('/api/social/friends', config),
        axios.get('/api/social/requests', config),
      ]);

      setFriends(friendsRes.data.friends || []);
      setRequests(requestsRes.data.requests || { incoming: [], outgoing: [] });
      
      if (friendsRes.data.friends?.length > 0 && !selectedFriend) {
        setSelectedFriend(friendsRes.data.friends[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Mock suggested users
    setSuggestedUsers([
      { id: '1', name: 'CodeMaster', xp: 4500, level: 12 },
      { id: '2', name: 'AlgoQueen', xp: 3800, level: 10 },
      { id: '3', name: 'DebugHero', xp: 2100, level: 7 },
    ]);
  }, []);

  const sendRequest = async (email) => {
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/social/send-request', { receiver: email || receiver }, config);
      setReceiver('');
      setSuccess('Friend request sent.');
      setTimeout(() => setSuccess(null), 3000);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
      setTimeout(() => setError(null), 3000);
    }
  };

  const acceptRequest = async (requestId) => {
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/social/accept-request', { requestId }, config);
      setSuccess('Friend request accepted.');
      setTimeout(() => setSuccess(null), 3000);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredFriends = useMemo(() => {
    return friends.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const topFriends = useMemo(() => {
    return [...friends].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 3);
  }, [friends]);

  return (
    <div className="min-h-screen bg-[#050b1a] text-white selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3 h-3" />
              <span>Social Network</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Coding Circle</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Connect with fellow developers, challenge friends, and grow your coding network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search your network..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
              />
            </div>
            <button 
              onClick={() => setActiveTab('AddFriend')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="fixed top-8 right-8 z-50 space-y-4 pointer-events-none">
          {error && (
            <div className="bg-red-500/90 backdrop-blur-md border border-red-400/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300 pointer-events-auto">
              <X className="w-5 h-5" />
              <p className="font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/90 backdrop-blur-md border border-green-400/50 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-right duration-300 pointer-events-auto">
              <Check className="w-5 h-5" />
              <p className="font-bold">{success}</p>
            </div>
          )}
        </div>

        <div className="space-y-16">
          {/* Top 3 Friends Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Friends Leaderboard
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {topFriends.length > 0 ? topFriends.map((friend, idx) => (
                <div 
                  key={friend.friendshipId} 
                  className={`relative group ${idx === 0 ? 'sm:order-2 scale-105 z-10' : idx === 1 ? 'sm:order-1' : 'sm:order-3'}`}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-b ${idx === 0 ? 'from-yellow-500/30' : idx === 1 ? 'from-gray-400/20' : 'from-amber-600/20'} to-transparent rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-500`} />
                  <div className={`relative bg-white/5 border ${idx === 0 ? 'border-yellow-500/30' : 'border-white/10'} rounded-[2.5rem] p-8 backdrop-blur-xl text-center flex flex-col items-center space-y-4`}>
                    <div className="relative">
                      {idx === 0 && <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400 drop-shadow-glow animate-bounce" />}
                      <div className={`w-20 h-20 rounded-full border-4 ${idx === 0 ? 'border-yellow-400' : 'border-white/10'} overflow-hidden bg-gray-800`}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} alt={friend.name} />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'} rounded-full flex items-center justify-center text-gray-900 font-bold text-sm`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold truncate w-full px-4">{friend.name}</h3>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Level {Math.floor((friend.xp || 0) / 500) + 1}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white">{friend.xp || 0}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total XP</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 py-20 bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] text-center">
                  <p className="text-gray-500 font-bold">Add friends to see who's leading the pack!</p>
                </div>
              )}
            </div>
          </section>

          {/* Main Social Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Sidebar: Friends List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-md flex flex-col h-[700px]">
                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <h2 className="text-xl font-bold">Network</h2>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-xl">
                    {['All', 'Online'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Incoming Requests Section (Mini) */}
                {requests.incoming?.length > 0 && (
                  <div className="mb-8 space-y-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Pending Requests ({requests.incoming.length})</p>
                    <div className="space-y-2">
                      {requests.incoming.map(req => (
                        <div key={req.requestId} className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl group">
                          <div className="flex items-center space-x-3">
                            <img className="w-8 h-8 rounded-lg" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.from.name}`} alt="" />
                            <span className="text-sm font-bold">{req.from.name}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => acceptRequest(req.requestId)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 transition-colors hover:text-white">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 transition-colors hover:text-white">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Connections</p>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-gray-500 text-sm">Syncing network...</p>
                    </div>
                  ) : filteredFriends.length > 0 ? filteredFriends.map((friend, friendIdx) => (
                    <button
                      key={friend.friendshipId}
                      onClick={() => setSelectedFriend(friend)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${selectedFriend?.friendshipId === friend.friendshipId ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img className="w-12 h-12 rounded-xl bg-gray-800" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} alt="" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0f172a] ${friendIdx % 2 === 0 ? 'bg-green-500' : 'bg-gray-600'}`} />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-200 group-hover:text-white transition-colors">{friend.name}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Level {Math.floor((friend.xp || 0) / 500) + 1}</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedFriend?.friendshipId === friend.friendshipId ? 'text-blue-400 translate-x-1' : 'text-gray-600'}`} />
                    </button>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="p-4 bg-white/5 rounded-full">
                        <Users className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-500 font-bold">No connections found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Friend / Suggestions (Only if activeTab is AddFriend or list is empty) */}
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold">Expand Network</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    placeholder="Enter email or ID..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                  <button
                    onClick={() => sendRequest()}
                    disabled={!receiver || loading}
                    className="px-6 py-3 bg-white/10 hover:bg-purple-600 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">People you may know</p>
                  {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-purple-500/30 transition-all">
                      <div className="flex items-center space-x-3">
                        <img className="w-8 h-8 rounded-lg" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                        <div>
                          <div className="text-sm font-bold">{user.name}</div>
                          <div className="text-[10px] text-gray-500 font-bold">Level {user.level}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => sendRequest(user.name)}
                        className="p-2 hover:bg-purple-600/20 text-purple-400 rounded-lg transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Friend Details */}
            <div className="lg:col-span-7">
              {selectedFriend ? (
                <div className="sticky top-8 space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[3rem] blur opacity-50 group-hover:opacity-100 transition duration-500" />
                    <div className="relative bg-[#0f172a]/80 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
                        <div className="relative">
                          <div className="w-40 h-40 rounded-[2.5rem] bg-gray-800 border-4 border-white/5 overflow-hidden shadow-2xl">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFriend.name}`} alt={selectedFriend.name} />
                          </div>
                          <div className="absolute -bottom-3 -right-3 px-4 py-1.5 bg-blue-600 rounded-full text-xs font-black shadow-lg">
                            LVL {Math.floor((selectedFriend.xp || 0) / 500) + 1}
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-6">
                          <div>
                            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                              <h2 className="text-4xl font-black">{selectedFriend.name}</h2>
                              <ShieldCheck className="w-6 h-6 text-blue-400" />
                            </div>
                            <p className="text-gray-400 font-medium">{selectedFriend.email}</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">XP Progress</span>
                              <span className="text-xs font-bold text-blue-400">{(selectedFriend.xp || 0) % 500} / 500</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                                style={{ width: `${((selectedFriend.xp || 0) % 500) / 5}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                          { label: 'Solved', value: '142', icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                          { label: 'Streak', value: '12 Days', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                          { label: 'Accuracy', value: '94%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
                        ].map((stat, i) => (
                          <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-center hover:bg-white/10 transition-all">
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                              <stat.icon className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl font-black">{stat.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all">
                          <MessageSquare className="w-5 h-5" />
                          <span>Message</span>
                        </button>
                        <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20">
                          <ExternalLink className="w-5 h-5" />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Feed */}
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-blue-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-8">
                      {[
                        { action: 'Solved "Two Sum"', time: '2 hours ago', icon: Target, color: 'text-purple-400' },
                        { action: 'Reached Level 12', time: 'Yesterday', icon: Trophy, color: 'text-yellow-400' },
                        { action: 'Started "Graph Theory"', time: '2 days ago', icon: ExternalLink, color: 'text-blue-400' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start space-x-6 relative">
                          {i !== 2 && <div className="absolute left-3 top-10 bottom-[-20px] w-[2px] bg-white/5" />}
                          <div className={`w-6 h-6 rounded-full ${activity.color} bg-white/5 flex items-center justify-center mt-1`}>
                            <activity.icon className="w-3 h-3" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-200">{activity.action}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white/5 border border-white/10 border-dashed rounded-[3rem] p-20 text-center space-y-6">
                  <div className="p-8 bg-blue-500/10 rounded-full">
                    <User className="w-16 h-16 text-blue-500/50" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-300">No Friend Selected</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Select a connection from your network to view their performance and stats.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

