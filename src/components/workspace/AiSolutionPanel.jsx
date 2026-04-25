import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Bot, 
  User, 
  Sparkles, 
  Lightbulb, 
  Code2, 
  Clock, 
  Cpu, 
  ChevronRight, 
  Copy, 
  Check, 
  Send,
  BrainCircuit,
  MessageSquareText,
  Loader2
} from 'lucide-react';

const MessageBubble = ({ msg, copied, handleCopy }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (msg.role === 'ai' && !msg.type) {
      setIsTyping(true);
      let i = 0;
      setDisplayedContent('');
      const interval = setInterval(() => {
        setDisplayedContent((prev) => prev + msg.content.charAt(i));
        i++;
        if (i >= msg.content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(msg.content);
    }
  }, [msg]);

  return (
    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
      msg.role === 'user' 
        ? 'bg-purple-600/10 border border-purple-500/20 text-gray-200' 
        : 'bg-white/5 border border-white/10 text-gray-300'
    }`}>
      {displayedContent}
      {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse" />}

      {msg.type === 'solution' && msg.solutionData && (
        <div className="mt-4 space-y-4">
          {/* Complexity */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/40 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Time</span>
              <span className="text-xs font-mono text-blue-400">{msg.solutionData.timeComplexity}</span>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Space</span>
              <span className="text-xs font-mono text-purple-400">{msg.solutionData.spaceComplexity}</span>
            </div>
          </div>

          {/* Code Block */}
          <div className="relative group/code">
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={() => handleCopy(msg.solutionData.solutionCode)}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            </div>
            <div className="bg-[#010409] rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-1.5 bg-white/5 border-b border-white/5 flex items-center">
                <Code2 className="w-3.5 h-3.5 text-blue-400 mr-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">JavaScript Solution</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[13px] font-mono text-gray-300 custom-scrollbar">
                <code>{msg.solutionData.solutionCode}</code>
              </pre>
            </div>
          </div>

          {/* Explanation Steps */}
          <div className="space-y-2">
            {msg.solutionData.explanationSteps.map((step, i) => (
              <div key={i} className="flex items-start space-x-2 text-[13px] text-gray-400">
                <div className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AiSolutionPanel = ({ problem }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    if (problem) {
      setMessages([
        {
          role: 'ai',
          content: `Hello! I'm your DynamiCode AI assistant. I've analyzed the problem: **${problem.title}**. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMessages([
        {
          role: 'ai',
          content: "Generate a problem to start our interactive coding session! I can provide hints, complexity analysis, or full solutions.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [problem]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHint = async () => {
    if (!problem || loading) return;
    
    setLoading(true);
    // Simulate AI thinking and message addition
    const newMessage = { role: 'user', content: 'Give me a hint' };
    setMessages(prev => [...prev, newMessage]);

    try {
      // In a real app, you'd call an AI endpoint for hints
      // For now, we'll simulate a structured response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: "Think about the constraints. Since we need to find the shortest path, a Breadth-First Search (BFS) might be more efficient than DFS here.",
          type: 'hint'
        }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to get hint');
      setLoading(false);
    }
  };

  const generateSolution = async () => {
    if (!problem || loading) return;

    setLoading(true);
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: 'Show me the full solution' }]);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.post(
        '/api/solutions/generate',
        { problem, language: 'javascript' },
        config
      );

      const solution = res.data;
      setMessages(prev => [...prev, {
        role: 'ai',
        type: 'solution',
        solutionData: solution,
        content: "I've synthesized an optimal solution for you. Here's the breakdown:"
      }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#020617] border-l border-white/10 font-sans">
      {/* AI Assistant Header */}
      <div className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 backdrop-blur-xl z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#020617] rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-200">AI Assistant</h3>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="p-1.5 bg-white/5 rounded-lg">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              <div className={`shrink-0 p-2 rounded-xl ${
                msg.role === 'user' ? 'bg-purple-600/20 ml-3' : 'bg-blue-600/20 mr-3'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-purple-400" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <MessageBubble 
                  msg={msg} 
                  copied={copied} 
                  handleCopy={handleCopy} 
                />
                {msg.timestamp && (
                  <span className="text-[10px] text-gray-600 font-medium px-1">{msg.timestamp}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="flex items-start space-x-3">
              <div className="shrink-0 p-2 bg-blue-600/20 rounded-xl mr-3">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-xl flex items-center space-x-3 text-red-400 text-sm animate-shake">
            <Sparkles className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* AI Actions */}
      <div className="p-4 bg-white/5 border-t border-white/10 space-y-3 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={getHint}
            disabled={!problem || loading}
            className="flex items-center justify-center space-x-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 transition-all active:scale-95 disabled:opacity-50 group"
          >
            <Lightbulb className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>Get Hint</span>
          </button>
          <button
            onClick={generateSolution}
            disabled={!problem || loading}
            className="flex items-center justify-center space-x-2 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-sm font-bold text-blue-400 transition-all active:scale-95 disabled:opacity-50 group"
          >
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
            <span>Solution</span>
          </button>
        </div>
        
        {/* Chat Input Simulation */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder={problem ? "Ask me anything..." : "Generate a problem first..."}
            disabled={!problem || loading}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50"
          />
          <button 
            disabled={!problem || loading}
            className="absolute right-2 top-1.5 p-1 text-gray-500 hover:text-blue-400 transition-colors disabled:opacity-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSolutionPanel;
