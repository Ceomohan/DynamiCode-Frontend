const TerminalPanel = ({ output, isExecuting }) => {
  return (
    <div className="h-full bg-black text-gray-300 p-4 font-mono text-sm overflow-y-auto border-t border-gray-700 flex flex-col">
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1 shrink-0">
        <span className="font-bold text-gray-400">TERMINAL</span>
        <button 
          onClick={() => {}} // TODO: Add clear functionality if needed via props
          className="text-xs text-gray-500 hover:text-white"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 overflow-auto whitespace-pre-wrap font-mono">
        {isExecuting && (
          <div className="flex items-center text-yellow-500">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running code on Judge0...
          </div>
        )}

        {!isExecuting && !output && (
          <div className="text-gray-600 italic">&gt; Click "Run Code" to execute...</div>
        )}

        {output && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center space-x-4 border-b border-gray-800 pb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                output.status?.id === 3 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {output.status?.description || 'Unknown Status'}
              </span>
              <span className="text-xs text-gray-500">
                Time: <span className="text-gray-300">{output.time || '0'}s</span>
              </span>
              <span className="text-xs text-gray-500">
                Memory: <span className="text-gray-300">{output.memory || '0'}KB</span>
              </span>
            </div>

            {/* Standard Output */}
            {output.stdout && (
               <div className="text-green-400 mb-2">{output.stdout}</div>
            )}
            
            {/* Standard Error */}
            {output.stderr && (
               <div className="text-red-400 mb-2 border-l-2 border-red-500 pl-2">
                 {output.stderr}
               </div>
            )}

            {/* Compile Output (Syntax Errors) */}
            {output.compile_output && (
               <div className="text-yellow-400 mb-2 bg-gray-900 p-2 rounded text-xs">
                 <div className="font-bold mb-1 border-b border-gray-700 pb-1">Compilation Error:</div>
                 {output.compile_output}
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPanel;
