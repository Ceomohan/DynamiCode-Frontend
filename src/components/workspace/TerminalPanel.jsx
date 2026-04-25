import { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  TestTube, 
  Layout, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu,
  Trash2,
  ChevronRight,
  Loader2
} from 'lucide-react';

const TerminalPanel = ({ output, isExecuting, testCases = [] }) => {
  const [activeTab, setActiveTab] = useState('output');
  const [logs, setLogs] = useState([]);

  // Auto-switch to output tab when code is running or finished
  useEffect(() => {
    if (isExecuting || output) {
      setActiveTab('output');
    }
  }, [isExecuting, output]);

  const tabs = [
    { id: 'output', label: 'Output', icon: TerminalIcon },
    { id: 'test-cases', label: 'Test Cases', icon: TestTube },
    { id: 'console', label: 'Console', icon: Layout },
  ];

  return (
    <div className="h-full flex flex-col bg-[#020617] border-t border-white/10 font-mono">
      {/* Terminal Tabs */}
      <div className="h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setLogs([])}
          className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
          title="Clear Terminal"
        >
          <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {activeTab === 'output' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isExecuting && (
              <div className="flex items-center space-x-3 text-blue-400 bg-blue-400/5 p-3 rounded-xl border border-blue-500/20 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium tracking-wide">Executing code on cloud sandbox...</span>
              </div>
            )}

            {!isExecuting && !output && (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2 opacity-50 py-10">
                <TerminalIcon className="w-8 h-8" />
                <p className="text-sm italic tracking-widest uppercase text-[10px] font-bold">Ready for execution</p>
              </div>
            )}

            {output && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
                {/* Status Header */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${
                      output.status?.id === 3 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {output.status?.id === 3 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{output.status?.description || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{output.time || '0'}s</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{output.memory || '0'}KB</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution Result Blocks */}
                <div className="space-y-3">
                  {output.stdout && (
                    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group/out">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Standard Output</span>
                      </div>
                      <div className="p-4 text-green-400/90 text-sm whitespace-pre-wrap font-mono group-hover/out:text-green-400 transition-colors">
                        {output.stdout}
                      </div>
                    </div>
                  )}
                  
                  {output.stderr && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Runtime Error</span>
                      </div>
                      <div className="p-4 text-red-400/90 text-sm whitespace-pre-wrap font-mono">
                        {output.stderr}
                      </div>
                    </div>
                  )}

                  {output.compile_output && (
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Compilation Error</span>
                      </div>
                      <div className="p-4 text-yellow-400/90 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                        {output.compile_output}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test-cases' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {testCases.length > 0 ? (
              testCases.map((tc, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group/tc">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Case {idx + 1}</span>
                      {tc.passed !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          tc.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tc.passed ? 'Passed' : 'Failed'}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover/tc:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">Input</span>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-xs text-gray-400 truncate">
                        {tc.input}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-green-400/60 uppercase tracking-widest">Expected</span>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-xs text-gray-400 truncate">
                        {tc.expected}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2 opacity-50 py-10">
                <TestTube className="w-8 h-8" />
                <p className="text-sm italic tracking-widest uppercase text-[10px] font-bold">No test cases available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="h-full flex flex-col space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center space-x-2 text-blue-400/80 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Debug Console</span>
            </div>
            <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-sm text-gray-500">
              <span className="animate-pulse">_</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;
