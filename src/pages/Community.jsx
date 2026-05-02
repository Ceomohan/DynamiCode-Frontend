import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Hash, 
  Users, 
  TrendingUp, 
  Trophy, 
  MessageCircle, 
  MoreHorizontal,
  Code,
  UserPlus,
  Clock,
  ArrowUp,
  Filter,
  X,
  Send,
  Rocket
} from 'lucide-react';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');

  // Mock Data
  const trendingTopics = [
    { id: 1, name: 'Arrays', count: '1.2k' },
    { id: 2, name: 'DP', count: '850' },
    { id: 3, name: 'Graphs', count: '640' },
    { id: 4, name: 'React', count: '520' },
    { id: 5, name: 'Recursion', count: '430' },
  ];

  const suggestedGroups = [
    { id: 1, name: 'FAANG Prep', members: '12k', icon: Rocket },
    { id: 2, name: 'Competitive Coding', members: '8.5k', icon: Trophy },
    { id: 3, name: 'Daily UI/UX', members: '3.2k', icon: Filter },
  ];

  const activeUsers = [
    { id: 1, name: 'CodeWizard', status: 'online' },
    { id: 2, name: 'AlgoQueen', status: 'online' },
    { id: 3, name: 'DebugHero', status: 'idle' },
    { id: 4, name: 'BitMaster', status: 'online' },
  ];

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Alex Chen', avatar: 'Alex' },
      content: "Just solved my first Hard problem on Graphs! The key was understanding the difference between BFS and DFS for shortest paths. Check out my approach below. #Graphs #Coding",
      tags: ['Graphs', 'Algorithm'],
      likes: 124,
      comments: 18,
      time: '2h ago',
      isLiked: false
    },
    {
      id: 2,
      user: { name: 'Sarah Miller', avatar: 'Sarah' },
      content: "Does anyone have a good resource for understanding Dynamic Programming? I'm struggling with the transition from recursion to tabulation. #DP #Help",
      tags: ['DP', 'Learning'],
      likes: 85,
      comments: 42,
      time: '5h ago',
      isLiked: true
    },
    {
      id: 3,
      user: { name: 'Mike Ross', avatar: 'Mike' },
      content: "Tip: Use Map instead of Object for frequency counting in JavaScript for better performance and easier iteration. #JavaScript #WebDev",
      tags: ['JS', 'Performance'],
      likes: 210,
      comments: 12,
      time: '8h ago',
      isLiked: false
    }
  ]);

  const topContributors = [
    { id: 1, name: 'CodeWizard', xp: '15.4k' },
    { id: 2, name: 'AlgoQueen', xp: '12.8k' },
    { id: 3, name: 'BitMaster', xp: '10.2k' },
  ];

  const recentDiscussions = [
    { id: 1, title: 'How to optimize Dijkstra?', replies: 24 },
    { id: 2, title: 'Sliding window vs Two pointers', replies: 15 },
    { id: 3, title: 'Best VS Code themes for 2026?', replies: 42 },
  ];

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: posts.length + 1,
      user: { name: 'You', avatar: 'You' },
      content: newPostContent,
      tags: newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      comments: 0,
      time: 'Just now',
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTags('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white selection:bg-blue-500/30 pb-20">
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
              <span>Developer Community</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Together</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Learn, share, and grow with a global network of elite coders and AI enthusiasts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-8 hidden lg:block">
            {/* Trending Topics */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTopics.map(topic => (
                  <button key={topic.id} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                    <div className="flex items-center space-x-3">
                      <Hash className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-gray-300 group-hover:text-white">{topic.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{topic.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Groups */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Suggested Groups
              </h3>
              <div className="space-y-4">
                {suggestedGroups.map(group => (
                  <div key={group.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                        <group.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{group.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{group.members} members</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Active Coders</h3>
              <div className="space-y-4">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img className="w-8 h-8 rounded-lg bg-gray-800" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f172a] ${user.status === 'online' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    </div>
                    <span className="text-sm font-bold text-gray-300">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Feed */}
          <div className="lg:col-span-6 space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img className="w-12 h-12 rounded-2xl bg-gray-800 shadow-xl" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.avatar}`} alt="" />
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{post.user.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-bold text-blue-400 uppercase tracking-widest">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 group/btn transition-colors ${post.isLiked ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                    >
                      <div className={`p-2 rounded-xl transition-all ${post.isLiked ? 'bg-blue-500/20' : 'group-hover/btn:bg-white/5'}`}>
                        <ThumbsUp className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      </div>
                      <span className="font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 group/btn text-gray-500 hover:text-white transition-colors">
                      <div className="p-2 rounded-xl group-hover/btn:bg-white/5 transition-all">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="font-bold">{post.comments}</span>
                    </button>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            {/* Weekly Challenge */}
            <div className="relative group overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Weekly Challenge</h3>
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-sm font-bold text-blue-400 mb-1 uppercase tracking-widest">Active Task</p>
                    <p className="text-lg font-bold">Solve 10 DP Problems</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <button className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all">
                    Continue Challenge
                  </button>
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Top Contributors
              </h3>
              <div className="space-y-4">
                {topContributors.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-500'}`}>
                        #{idx + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-300">{user.name}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-400">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Discussions */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Recent Discussions
              </h3>
              <div className="space-y-4">
                {recentDiscussions.map(disc => (
                  <button key={disc.id} className="w-full text-left group">
                    <p className="text-sm font-bold group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">{disc.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{disc.replies} replies</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-400" />
                Create New Post
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block px-1">Share your thoughts</label>
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Share a tip, ask a question, or post some code..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block px-1">Tags (comma separated)</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="Arrays, DP, Python..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                  <span>Post Discussion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
