import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProblemPanel from '../components/workspace/ProblemPanel';
import CodeEditor from '../components/workspace/CodeEditor';
import TerminalPanel from '../components/workspace/TerminalPanel';
import AiSolutionPanel from '../components/workspace/AiSolutionPanel';

const PracticeWorkspace = () => {
  const navigate = useNavigate();
  const [executionOutput, setExecutionOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [problem, setProblem] = useState(null);
  
  // Track problem attempt data
  const problemStartTime = useRef(null);
  const attemptCount = useRef(0);
  const currentProblemData = useRef(null);

  const handleProblemGenerated = (problemData) => {
    // Reset tracking when new problem is generated
    problemStartTime.current = Date.now();
    attemptCount.current = 0;
    currentProblemData.current = problemData;
  };

  const recordAttempt = async (solved) => {
    if (!currentProblemData.current || !problemStartTime.current) {
      return; // No problem data to record
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const timeTaken = Math.floor((Date.now() - problemStartTime.current) / 1000); // Convert to seconds

      await axios.post(
        '/api/adaptive/record',
        {
          topic: currentProblemData.current.topic,
          difficulty: currentProblemData.current.difficulty,
          solved,
          attempts: attemptCount.current,
          timeTaken,
        },
        config
      );

      // Gamification update (XP/level/streak/achievements). XP is only awarded when solved=true.
      await axios.post(
        '/api/gamification/update',
        {
          difficulty: currentProblemData.current.difficulty,
          solved,
          timeTaken,
        },
        config
      );
    } catch (error) {
      console.error('Error recording attempt:', error);
      // Don't show error to user, just log it
    }
  };

  const handleRunCode = async (code, language = 'javascript') => {
    setIsExecuting(true);
    setExecutionOutput(null);
    attemptCount.current += 1;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post('/api/execute/execute', {
        language,
        sourceCode: code,
        stdin: '',
      }, config);

      setExecutionOutput(res.data);

      // Determine if problem is solved based on execution result
      // For now, we'll consider it solved if there's no error
      // In a real scenario, you'd compare output with expected output
      const solved = res.data.status.id === 3 && !res.data.stderr;
      
      // Record the attempt
      if (problem) {
        await recordAttempt(solved);
      }
    } catch (error) {
      console.error('Execution error:', error);
      setExecutionOutput({
        status: { id: 11, description: 'Runtime Error' },
        stderr: error.response?.data?.message || error.message,
      });

      // Record failed attempt
      if (problem) {
        await recordAttempt(false);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header / Navbar */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold">DynamiCode Workspace</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
          >
            Leaderboard
          </button>
          <button
            onClick={() => navigate('/friends')}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
          >
            Friends
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
          >
            Exit to Dashboard
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Problem Statement */}
        <div className="w-1/4 min-w-[250px] max-w-[400px] h-full">
          <ProblemPanel 
            problem={problem} 
            setProblem={setProblem}
            onProblemGenerated={handleProblemGenerated}
          />
        </div>

        {/* Center Panel: Editor & Terminal */}
        <div className="flex-1 flex flex-col min-w-[400px]">
          {/* Top: Code Editor */}
          <div className="flex-1 h-[70%]">
            <CodeEditor 
              onRunCode={handleRunCode} 
              isExecuting={isExecuting}
            />
          </div>
          
          {/* Bottom: Terminal */}
          <div className="h-[30%] min-h-[150px]">
            <TerminalPanel 
              output={executionOutput} 
              isExecuting={isExecuting}
            />
          </div>
        </div>

        {/* Right Panel: AI Solution */}
        <div className="w-1/4 min-w-[250px] max-w-[400px] h-full">
          <AiSolutionPanel problem={problem} />
        </div>

      </div>
    </div>
  );
};


export default PracticeWorkspace;
