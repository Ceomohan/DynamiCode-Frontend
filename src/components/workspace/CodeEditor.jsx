import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Send, 
  Settings, 
  ChevronDown, 
  Sparkles, 
  Code2,
  Info,
  Terminal,
  Cpu
} from 'lucide-react';

const CodeEditor = memo(({ onRunCode, onSubmit, isExecuting, problem, executionOutput }) => {
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);
  const [aiHint, setAiHint] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [typedHint, setTypedHint] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (executionOutput?.status?.id >= 4 && executionOutput?.status?.id <= 14) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [executionOutput]);

  useEffect(() => {
    if (showAiHint && aiHint) {
      let i = 0;
      setTypedHint('');
      const interval = setInterval(() => {
        setTypedHint((prev) => prev + aiHint.charAt(i));
        i++;
        if (i >= aiHint.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showAiHint, aiHint]);

  const languages = [
    { id: 'javascript', label: 'JavaScript', icon: 'js' },
    { id: 'python', label: 'Python', icon: 'py' },
    { id: 'java', label: 'Java', icon: 'java' },
    { id: 'cpp', label: 'C++', icon: 'cpp' },
  ];

  useEffect(() => {
    if (problem?.starterCode) {
      setCode(problem.starterCode);
    }
  }, [problem]);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('dynami-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#020617',
        'editor.lineHighlightBackground': '#1e293b40',
        'editorCursor.foreground': '#60a5fa',
        'editorBracketMatch.background': '#3b82f640',
        'editorBracketMatch.border': '#3b82f6',
      }
    });
    monaco.editor.setTheme('dynami-dark');
  }, []);

  const handleEditorChange = useCallback((value) => {
    setCode(value);
  }, []);

  const getAiHint = useCallback(() => {
    setShowAiHint(true);
    setAiHint("Thinking...");
    setTimeout(() => {
      setAiHint("Try using a sliding window approach to optimize space complexity.");
    }, 1500);
  }, []);

  // Stable options object — recreating this on every render causes Monaco to
  // re-apply all settings unnecessarily.
  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 20, bottom: 20 },
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    lineHeight: 24,
    renderLineHighlight: 'all',
    scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
  }), []);

  return (
    <div className={`h-full w-full flex flex-col bg-[#020617] relative group/editor ${isShaking ? 'animate-shake' : ''}`}>
      {/* Glow Effect Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-2xl opacity-0 group-hover/editor:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      {/* Execution Progress Bar */}
      {isExecuting && (
        <div className="absolute top-14 left-0 w-full h-[2px] z-20 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-shimmer" style={{ width: '100%' }} />
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="h-14 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 backdrop-blur-xl z-10">
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all group"
            >
              <div className="w-5 h-5 flex items-center justify-center rounded bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                {languages.find(l => l.id === language)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                      language === lang.id ? 'text-blue-400 bg-blue-400/5' : 'text-gray-400'
                    }`}
                  >
                    <span className="uppercase text-[10px] font-bold tracking-widest opacity-50">{lang.icon}</span>
                    <span className="font-medium">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-[1px] bg-white/10" />
          
          <div className="flex items-center space-x-2 text-gray-500 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>main.js</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onRunCode(code, language)}
            disabled={isExecuting}
            className="group flex items-center space-x-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg border border-white/10 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">Run</span>
          </button>

          <button
            onClick={() => onSubmit && onSubmit(code, language)}
            disabled={isExecuting}
            className="flex items-center space-x-2 px-5 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Submit</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden relative border-r border-white/5">
        <Editor
          height="100%"
          language={language}
          value={code}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={editorOptions}
        />

        {/* Floating AI Hint Tooltip */}
        <div className="absolute bottom-6 right-6 z-20">
          {showAiHint ? (
            <div className="max-w-xs bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-1.5 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">AI Hint</span>
                    <button onClick={() => setShowAiHint(false)} className="text-gray-500 hover:text-white transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed italic min-h-[3rem]">
                    {typedHint}
                    <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={getAiHint}
              className="group flex items-center space-x-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-blue-500/50 rounded-full backdrop-blur-xl transition-all shadow-xl hover:shadow-blue-500/20"
            >
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium text-gray-300">Get AI Hint</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';
export default CodeEditor;
