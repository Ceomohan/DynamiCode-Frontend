import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Filter, CheckCircle, Circle, Play, Lock, Search } from 'lucide-react';

const PracticeTopic = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...filters }
        };
        const res = await axios.get(`/api/topics/${slug}/problems`, config);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [slug, filters]);

  const filteredProblems = data?.problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans p-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumbs / Header */}
        <header className="mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {data?.topic.name}
                </h1>
              </div>
              <div className="hidden md:block">
                <p className="text-gray-400 max-w-md">{data?.topic.description}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Smart Practice
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <select 
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">All Difficulties</option>
            <option value="Easy" className="bg-gray-900">Easy</option>
            <option value="Medium" className="bg-gray-900">Medium</option>
            <option value="Hard" className="bg-gray-900">Hard</option>
          </select>

          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">All Status</option>
            <option value="Solved" className="bg-gray-900">Solved</option>
            <option value="Unsolved" className="bg-gray-900">Unsolved</option>
            <option value="Attempted" className="bg-gray-900">Attempted</option>
          </select>
        </div>

        {/* Problem List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Title</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Difficulty</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProblems.map((problem) => (
                  <tr 
                    key={problem._id}
                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/practice?problem=${problem._id}`)}
                  >
                    <td className="px-6 py-4">
                      {problem.status === 'Solved' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : problem.status === 'Attempted' ? (
                        <Circle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                        {problem.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                        <Play className="w-4 h-4 fill-current text-gray-400 group-hover:text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProblems.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500">No problems found for this topic with selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeTopic;
