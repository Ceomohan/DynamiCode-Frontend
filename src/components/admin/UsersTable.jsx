const UsersTable = ({ users = [], onBan, onDelete, loading }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="text-lg font-bold">Users</div>
        <div className="text-xs text-gray-400">{users.length} shown</div>
      </div>

      <div className="grid grid-cols-6 gap-2 px-4 py-3 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700">
        <div className="col-span-2">Name</div>
        <div className="col-span-2">Email</div>
        <div>Role</div>
        <div>Actions</div>
      </div>

      {loading ? (
        <div className="p-6 text-gray-400">Loading…</div>
      ) : users.length === 0 ? (
        <div className="p-6 text-gray-400">No users found.</div>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-gray-700 hover:bg-gray-700/30"
          >
            <div className="col-span-2 font-semibold">
              {u.name}{' '}
              {u.isBanned && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-red-900 text-red-200 border border-red-700">
                  BANNED
                </span>
              )}
            </div>
            <div className="col-span-2 text-sm text-gray-300">{u.email}</div>
            <div className="text-sm">{u.role}</div>
            <div className="flex gap-2">
              <button
                onClick={() => onBan(u._id)}
                disabled={loading || u.isBanned}
                className="text-xs px-3 py-1 rounded bg-yellow-700 hover:bg-yellow-600 disabled:bg-gray-700 disabled:text-gray-400 font-bold"
              >
                Ban
              </button>
              <button
                onClick={() => onDelete(u._id)}
                disabled={loading}
                className="text-xs px-3 py-1 rounded bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-400 font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UsersTable;

