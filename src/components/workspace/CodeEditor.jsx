import { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ onRunCode, isExecuting }) => {
  const [code, setCode] = useState('// Write your code here...\nconsole.log("Hello from Judge0!");');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-[#3e3e42]">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 text-sm font-medium">JavaScript</span>
        </div>
        <button
          onClick={() => onRunCode(code)}
          disabled={isExecuting}
          className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
            isExecuting 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
