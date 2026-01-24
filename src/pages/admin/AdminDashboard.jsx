import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import UsersTable from '../../components/admin/UsersTable';
import PlatformStats from '../../components/admin/PlatformStats';
import AISettings from '../../components/admin/AISettings';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingAI, setSavingAI] = useState(false);
  const [aiSettings, setAiSettings] = useState({ model: 'llama-3.3-70b-versatile', temperature: 0.7, maxTokens: 2048 });

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getConfig();
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users', config),
        axios.get('/api/admin/stats', config),
      ]);
      setUsers(usersRes.data.users || []);
      setStats(statsRes.data.stats || null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const banUser = async (id) => {
    setError(null);
    try {
      const config = getConfig();
      await axios.put(`/api/admin/users/${id}/ban`, {}, config);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to ban user');
    }
  };

  const deleteUser = async (id) => {
    setError(null);
    try {
      const config = getConfig();
      await axios.delete(`/api/admin/users/${id}`, config);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const saveAI = async (payload) => {
    setSavingAI(true);
    setError(null);
    try {
      const config = getConfig();
      const res = await axios.put('/api/admin/ai-settings', payload, config);
      setAiSettings(res.data.settings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update AI settings');
    } finally {
      setSavingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-400">
            Signed in as <span className="text-blue-400 font-semibold">{user?.email}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 p-4 rounded">
            {error}
          </div>
        )}

        <PlatformStats stats={stats} />

        <UsersTable users={users} onBan={banUser} onDelete={deleteUser} loading={loading} />

        <AISettings initial={aiSettings} onSave={saveAI} saving={savingAI} />
      </div>
    </div>
  );
};

export default AdminDashboard;

