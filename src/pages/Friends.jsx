import { useEffect, useState } from 'react';
import axios from 'axios';

const Friends = () => {
  const [receiver, setReceiver] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [friendsRes, requestsRes] = await Promise.all([
        axios.get('/api/social/friends', config),
        axios.get('/api/social/requests', config),
      ]);

      setFriends(friendsRes.data.friends || []);
      setRequests(requestsRes.data.requests || { incoming: [], outgoing: [] });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendRequest = async () => {
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/social/send-request', { receiver }, config);
      setReceiver('');
      setSuccess('Friend request sent.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  const acceptRequest = async (requestId) => {
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post('/api/social/accept-request', { requestId }, config);
      setSuccess('Friend request accepted.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Friends</h1>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 p-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-200 p-4 rounded">
            {success}
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3">Send Friend Request</h2>
          <p className="text-sm text-gray-400 mb-4">
            Enter a user’s email (or userId) to send a request.
          </p>
          <div className="flex gap-3">
            <input
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="friend@example.com"
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={sendRequest}
              disabled={!receiver || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 px-4 py-2 rounded font-bold"
            >
              Send
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Incoming Requests</h2>
            {loading ? (
              <div className="text-gray-400">Loading…</div>
            ) : (requests.incoming || []).length === 0 ? (
              <div className="text-gray-400">No incoming requests.</div>
            ) : (
              <div className="space-y-3">
                {requests.incoming.map((r) => (
                  <div
                    key={r.requestId}
                    className="flex items-center justify-between bg-gray-900/40 border border-gray-700 rounded p-3"
                  >
                    <div>
                      <div className="font-semibold">{r.from.name}</div>
                      <div className="text-xs text-gray-400">{r.from.email}</div>
                    </div>
                    <button
                      onClick={() => acceptRequest(r.requestId)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-bold"
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Friends</h2>
            {loading ? (
              <div className="text-gray-400">Loading…</div>
            ) : friends.length === 0 ? (
              <div className="text-gray-400">No friends yet.</div>
            ) : (
              <div className="space-y-3">
                {friends.map((f) => (
                  <div
                    key={f.friendshipId}
                    className="bg-gray-900/40 border border-gray-700 rounded p-3"
                  >
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

