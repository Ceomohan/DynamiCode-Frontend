import { useState, useEffect } from 'react';
import axios from 'axios';

const AiSolutionPanel = ({ problem }) => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear solution when problem changes
  useEffect(() => {
    setSolution(null);
    setError(null);
  }, [problem]);

  const generateSolution = async () => {
    if (!problem) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        '/api/solutions/generate',
        { 
          problem, 
          language: 'javascript' // Currently defaults to JavaScript
        },
        config
      );

      setSolution(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-800 p-4 text-white overflow-y-auto border-l border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-purple-400">AI Solution</h2>
      
      {!problem && (
         <div className="bg-gray-700 p-4 rounded-lg mb-4 text-center">
           <p className="text-gray-400 text-sm">
             Generate a problem first to unlock the AI solution.
           </p>
         </div>
      )}

      {problem && !solution && (
        <div className="mb-6">
          <button
            onClick={generateSolution}
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Solution...
              </span>
            ) : 'Generate AI Solution'}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {solution && (
        <div className="flex-1 space-y-6 animate-fade-in">
          
          {/* Complexity Analysis */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700 p-3 rounded">
              <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Time Complexity</span>
              <span className="text-sm font-mono text-green-400">{solution.timeComplexity}</span>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <span className="block text-xs text-gray-400 uppercase font-bold mb-1">Space Complexity</span>
              <span className="text-sm font-mono text-purple-400">{solution.spaceComplexity}</span>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="font-bold text-gray-300 mb-2 border-b border-gray-700 pb-1">Explanation</h3>
            <ul className="list-disc pl-5 space-y-2">
              {solution.explanationSteps.map((step, index) => (
                <li key={index} className="text-sm text-gray-300 leading-relaxed">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Code */}
          <div>
            <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
              <h3 className="font-bold text-gray-300">Solution Code</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(solution.solutionCode)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300"
              >
                Copy
              </button>
            </div>
            <div className="bg-[#1e1e1e] p-3 rounded border border-gray-700 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                <code>{solution.solutionCode}</code>
              </pre>
            </div>
          </div>

          {/* Alternative Approach */}
          {solution.alternativeApproach && (
             <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
               <h3 className="text-sm font-bold text-yellow-500 mb-1">Alternative Approach</h3>
               <p className="text-sm text-gray-400">{solution.alternativeApproach}</p>
             </div>
          )}

        </div>
      )}

      {!problem && !solution && (
        <div className="flex-1 flex items-center justify-center opacity-30">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <p>AI Solution Helper</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSolutionPanel;
