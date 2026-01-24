import { useState, useEffect } from 'react';
import axios from 'axios';

const ProblemPanel = ({ problem, setProblem, onProblemGenerated }) => {
  const [topic, setTopic] = useState('Data Structures');
  const [difficulty, setDifficulty] = useState('Easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextDifficulty, setNextDifficulty] = useState(null);

  // Fetch next recommended difficulty when topic changes
  useEffect(() => {
    const fetchNextDifficulty = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(
          `/api/adaptive/next?topic=${encodeURIComponent(topic)}`,
          config
        );
        setNextDifficulty(res.data.difficulty);
        // Auto-update difficulty to recommended one
        setDifficulty(res.data.difficulty);
      } catch (err) {
        console.error('Error fetching next difficulty:', err);
        // Keep default difficulty on error
      }
    };

    fetchNextDifficulty();
  }, [topic]);

  const generateProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Use adaptive difficulty if available, otherwise use selected difficulty
      const difficultyToUse = nextDifficulty || difficulty;

      const res = await axios.post(
        '/api/problems/generate',
        { topic, difficulty: difficultyToUse },
        config
      );
      setProblem(res.data);
      
      // Notify parent component that problem was generated
      if (onProblemGenerated) {
        onProblemGenerated({
          topic,
          difficulty: difficultyToUse,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate problem');
    }
    setLoading(false);
  };

  return (
    <div className="h-full bg-gray-800 p-4 text-white overflow-y-auto border-r border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-blue-400">AI Generated Problem</h2>

      {/* Controls */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option>Data Structures</option>
            <option>Algorithms</option>
            <option>Dynamic Programming</option>
            <option>Strings</option>
            <option>Arrays</option>
            <option>Recursion</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <button
          onClick={generateProblem}
          disabled={loading}
          className={`w-full font-bold py-2 px-4 rounded transition duration-200 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Problem'}
        </button>

        {/* Next Difficulty Indicator */}
        {nextDifficulty && (
          <div className="mt-2 p-2 bg-gray-700 rounded text-xs text-center">
            <span className="text-gray-400">Next problem difficulty: </span>
            <span className={`font-semibold ${
              nextDifficulty === 'Easy' ? 'text-green-400' :
              nextDifficulty === 'Medium' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {nextDifficulty}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Problem Display */}
      <div className="flex-1 overflow-y-auto">
        {problem ? (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">{problem.title}</h3>
            
            <div className="flex space-x-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded ${
                problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300">
                {problem.topic}
              </span>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Description</h4>
                <p className="whitespace-pre-wrap">{problem.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Input Format</h4>
                <p>{problem.inputFormat}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Output Format</h4>
                <p>{problem.outputFormat}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-200 mb-1">Constraints</h4>
                <ul className="list-disc list-inside">
                  {problem.constraints?.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-200 mb-2">Examples</h4>
                {problem.examples?.map((example, idx) => (
                  <div key={idx} className="bg-gray-900 p-3 rounded mb-2 font-mono text-xs">
                    <p><span className="text-blue-400">Input:</span> {example.input}</p>
                    <p><span className="text-green-400">Output:</span> {example.output}</p>
                    {example.explanation && (
                      <p className="text-gray-500 mt-1 italic">// {example.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center text-gray-500 mt-10">
              <p>Select a topic and difficulty to start practicing.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProblemPanel;
