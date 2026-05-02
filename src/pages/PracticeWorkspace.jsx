import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Trophy, 
  User, 
  LogOut, 
  Code2, 
  LayoutDashboard, 
  History,
  Trophy as LeaderboardIcon,
  Users,
  Zap,
  Flame,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Menu,
  MoreVertical
} from 'lucide-react';
import { useNavigate,useLocation,Link } from 'react-router-dom';
import ProblemPanel from '../components/workspace/ProblemPanel';
import CodeEditor from '../components/workspace/CodeEditor';
import TerminalPanel from '../components/workspace/TerminalPanel';
import AiSolutionPanel from '../components/workspace/AiSolutionPanel';
import { useResizable } from '../hooks/useResizable';

const PracticeWorkspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [problem, setProblem] = useState(null);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, streak: 0 });
  const [activeTab, setActiveTab] = useState('practice');
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [gainedXp, setGainedXp] = useState(0);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Resizable panels
  const leftPanel = useResizable({ initial: 360, min: 280, max: 600, direction: 'horizontal', storageKey: 'dc_left_w' });
  const rightPanel = useResizable({ initial: 380, min: 280, max: 560, direction: 'horizontal', storageKey: 'dc_right_w' });
  const termPanel = useResizable({ initial: 260, min: 150, max: 500, direction: 'vertical', storageKey: 'dc_term_h' });

  // Derived sizes (collapse overrides)
  const leftSize = leftSidebarCollapsed ? 0 : leftPanel.size;
  const rightSize = rightSidebarCollapsed ? 0 : rightPanel.size;
  const termHeight = termPanel.size;

  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const problemId = queryParams.get('problem');
  const topicParam = queryParams.get('topic');
  
  // Track problem attempt data
  const problemStartTime = useRef(null);
  const attemptCount = useRef(0);
  const currentProblemData = useRef(null);

  useEffect(() => {
    // Fetch user stats for the navbar
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('/api/gamification/stats', config);
        setUserStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch user stats');
      }
    };
    fetchUserStats();
  }, []);

  const handleProblemGenerated = (problemData) => {
    problemStartTime.current = Date.now();
    attemptCount.current = 0;
    currentProblemData.current = problemData;
  };

  const recordAttempt = useCallback(async (solved) => {
    if (!currentProblemData.current || !problemStartTime.current) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const timeTaken = Math.floor((Date.now() - problemStartTime.current) / 1000);

      await axios.post('/api/adaptive/record', {
        topic: currentProblemData.current.topic,
        difficulty: currentProblemData.current.difficulty,
        solved,
        attempts: attemptCount.current,
        timeTaken,
        problemId: problem?._id
      }, config);

      if (solved) {
        const res = await axios.post('/api/gamification/update', {
          difficulty: currentProblemData.current.difficulty,
          solved,
          timeTaken,
        }, config);
        
        if (res.data.stats) {
          const newStats = res.data.stats;
          
          const xpGained = newStats.xp - userStats.xp;
          if (xpGained > 0) {
            setGainedXp(xpGained);
            setShowXpPopup(true);
            setTimeout(() => setShowXpPopup(false), 4000);
          }

          if (newStats.streak > userStats.streak && newStats.streak % 5 === 0) {
            setShowStreakPopup(true);
            setTimeout(() => setShowStreakPopup(false), 5000);
          }

          if (res.data.unlockedBadge) {
            setUnlockedBadge(res.data.unlockedBadge);
            setShowBadgePopup(true);
            setTimeout(() => setShowBadgePopup(false), 6000);
          } else if (newStats.level > userStats.level) {
            setUnlockedBadge({
              name: `Level ${newStats.level} Master`,
              icon: '🏆',
              description: 'You reached a new height in coding mastery!'
            });
            setShowBadgePopup(true);
            setTimeout(() => setShowBadgePopup(false), 6000);
          }
          
          setUserStats(newStats);
        }
      }
    } catch (error) {
      console.error('Error recording attempt:', error);
    }
  }, [problem?._id, userStats.xp, userStats.streak, userStats.level]);

  const handleRunCode = useCallback(async (code, language = 'javascript') => {
    setIsExecuting(true);
    setExecutionOutput(null);
    attemptCount.current += 1;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('/api/execute/execute', {
        language,
        sourceCode: code,
        stdin: '',
      }, config);

      setExecutionOutput(res.data);
      const solved = res.data.status.id === 3 && !res.data.stderr;
      if (problem) await recordAttempt(solved);
    } catch (error) {
      setExecutionOutput({
        status: { id: 11, description: 'Runtime Error' },
        stderr: error.response?.data?.message || error.message,
      });
      if (problem) await recordAttempt(false);
    } finally {
      setIsExecuting(false);
    }
  }, [problem, recordAttempt]);

  return (
    <div className="flex flex-col h-screen bg-[#050510] text-white overflow-hidden relative font-sans selection:bg-blue-500/30">
      {/* Background Particles Simulation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/4 w-[20%] h-[20%] bg-cyan-400/5 blur-[100px] rounded-full animate-bounce" style={{ animationDuration: '10s' }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-float"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 10 + 10) + 's',
              animationDelay: (Math.random() * 10) + 's',
              filter: 'blur(1px)'
            }}
          />
        ))}
        
        {/* Particle Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      </div>

      {/* XP Gained Popup */}
      {showXpPopup && (
        <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right-10 duration-500">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] rounded-2xl shadow-2xl shadow-blue-500/20">
            <div className="bg-gray-900/90 backdrop-blur-xl px-6 py-4 rounded-[15px] flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-400 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Success!</h4>
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  +{gainedXp} XP
                </p>
              </div>
              <button onClick={() => setShowXpPopup(false)} className="ml-4 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Unlock Popup */}
      {showBadgePopup && unlockedBadge && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="relative max-w-sm w-full bg-gradient-to-b from-blue-600 to-purple-600 p-[1px] rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500">
            <div className="bg-[#0a0a1a] rounded-[2.4rem] p-8 text-center overflow-hidden relative">
              {/* Decorative background circles */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/10 blur-[60px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 blur-[60px] rounded-full" />
              </div>

              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-2xl animate-bounce">
                    {unlockedBadge.icon}
                  </div>
                </div>
                
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-2">New Badge Unlocked</h3>
                <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{unlockedBadge.name}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
                  {unlockedBadge.description}
                </p>
                
                <button 
                  onClick={() => setShowBadgePopup(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all active:scale-95"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Milestone Popup */}
      {showStreakPopup && (
        <div className="fixed bottom-8 left-8 z-[100] animate-in slide-in-from-left-10 duration-500">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-[1px] rounded-2xl shadow-2xl shadow-orange-500/20">
            <div className="bg-gray-900/90 backdrop-blur-xl px-6 py-4 rounded-[15px] flex items-center space-x-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Streak Master!</h4>
                <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  {userStats.streak} Day Streak
                </p>
              </div>
              <button onClick={() => setShowStreakPopup(false)} className="ml-4 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 backdrop-blur-md z-50">
        <div className="flex items-center space-x-4 lg:space-x-8">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2 group shrink-0">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/20">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              DynamiCode
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'practice', label: 'Practice', icon: Zap, path: '/practice' },
              { id: 'topics', label: 'Topics', icon: LayoutDashboard, path: '/dashboard' },
              { id: 'leaderboard', label: 'Leaderboard', icon: LeaderboardIcon, path: '/leaderboard' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.path !== '/practice') navigate(tab.path);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Gamification Stats */}
          <div className="hidden sm:flex items-center space-x-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center space-x-2 group cursor-help">
              <div className="p-1.5 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-black leading-none">Level</span>
                <span className="text-sm font-black text-yellow-500">{userStats.level}</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center space-x-2 group cursor-help">
              <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-black leading-none">XP</span>
                <span className="text-sm font-black text-blue-400">{userStats.xp}</span>
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center space-x-2 group cursor-help">
              <div className="p-1.5 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-black leading-none">Streak</span>
                <span className="text-sm font-black text-orange-500">{userStats.streak || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-[1.5px] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[9px] bg-gray-950 flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 border-[2px] sm:border-[3px] border-[#050510] rounded-full shadow-lg shadow-green-500/40" />
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                <span>Dashboard</span>
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0a0a1a]/95 backdrop-blur-2xl border-b border-white/10 z-[100] animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 space-y-2">
              {[
                { id: 'practice', label: 'Practice', icon: Zap, path: '/practice' },
                { id: 'topics', label: 'Topics', icon: LayoutDashboard, path: '/dashboard' },
                { id: 'leaderboard', label: 'Leaderboard', icon: LeaderboardIcon, path: '/leaderboard' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                    if (tab.path !== '/practice') navigate(tab.path);
                  }}
                  className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-base font-bold">{tab.label}</span>
                </button>
              ))}
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black">Level</p>
                  <p className="text-lg font-black text-yellow-500">{userStats.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black">XP</p>
                  <p className="text-lg font-black text-blue-400">{userStats.xp}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-black">Streak</p>
                  <p className="text-lg font-black text-orange-500">{userStats.streak || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Sidebar: AI Problem Generator */}
        <aside 
          className={`h-full border-r border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-300 relative group/aside ${
            leftSidebarCollapsed ? 'hidden lg:block' : 'block'
          }`}
          style={{ width: leftSidebarCollapsed ? 0 : leftPanel.size }}
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            <ProblemPanel 
              problem={problem} 
              setProblem={setProblem}
              onProblemGenerated={handleProblemGenerated}
              problemId={problemId}
              topicParam={topicParam}
              userStats={userStats}
            />
          </div>
          
          {/* Collapse Toggle Button (Desktop only) */}
          <button 
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className={`hidden lg:flex absolute top-1/2 -right-4 z-50 p-1.5 bg-slate-900 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all transform -translate-y-1/2 opacity-0 group-hover/aside:opacity-100 ${
              leftSidebarCollapsed ? 'rotate-180 translate-x-2' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </aside>

        {/* Left ↔ Center resize handle */}
        {!leftSidebarCollapsed && (
          <div
            className="w-1 cursor-col-resize bg-white/5 hover:bg-blue-500/60 active:bg-blue-500 transition-colors shrink-0 relative group"
            onMouseDown={leftPanel.onMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-white/20 group-hover:bg-blue-400/60 transition-colors" />
            </div>
          </div>
        )}

        {/* Center Main Area: Editor & Terminal */}
        <section className="flex-1 flex flex-col min-w-0 border-r border-white/10 bg-black/20 overflow-hidden">
          {/* Top: Code Editor Area */}
          <div className="flex-1 min-h-[400px] lg:min-h-0">
            <CodeEditor 
              onRunCode={handleRunCode} 
              onSubmit={handleRunCode} // Reusing run for now
              isExecuting={isExecuting}
              problem={problem}
              executionOutput={executionOutput}
            />
          </div>
          
          {/* Editor ↕ Terminal resize handle */}
          <div
            className="h-1 cursor-row-resize bg-white/5 hover:bg-blue-500/60 active:bg-blue-500 transition-colors shrink-0 relative group"
            onMouseDown={termPanel.onMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-1 rounded-full bg-white/20 group-hover:bg-blue-400/60 transition-colors" />
            </div>
          </div>

          {/* Bottom: Terminal Area */}
          <div
            className="bg-white/[0.02] border-t border-white/10 overflow-hidden shrink-0"
            style={{ height: termHeight }}
          >
            <TerminalPanel 
              output={executionOutput} 
              isExecuting={isExecuting}
              testCases={problem?.testCases}
            />
          </div>
        </section>

        {/* Center ↔ Right resize handle */}
        {!rightSidebarCollapsed && (
          <div
            className="w-1 cursor-col-resize bg-white/5 hover:bg-blue-500/60 active:bg-blue-500 transition-colors shrink-0 relative group"
            onMouseDown={rightPanel.onMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-1 rounded-full bg-white/20 group-hover:bg-blue-400/60 transition-colors" />
            </div>
          </div>
        )}

        {/* Right Sidebar: AI Assistant */}
        <aside 
          className={`h-full bg-white/[0.02] backdrop-blur-xl transition-all duration-300 relative group/right ${
            rightSidebarCollapsed ? 'hidden lg:block' : 'block'
          }`}
          style={{ width: rightSidebarCollapsed ? 0 : rightPanel.size }}
        >
          <div className="h-full overflow-hidden">
            <AiSolutionPanel problem={problem} />
          </div>

          {/* Collapse Toggle Button (Desktop only) */}
          <button 
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            className={`hidden lg:flex absolute top-1/2 -left-4 z-50 p-1.5 bg-slate-900 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all transform -translate-y-1/2 opacity-0 group-hover/right:opacity-100 ${
              rightSidebarCollapsed ? 'rotate-180 -translate-x-2' : ''
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </aside>

      </main>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PracticeWorkspace;
