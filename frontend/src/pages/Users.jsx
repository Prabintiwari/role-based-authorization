import { useState, useEffect } from "react";
import { getUsers, updateUserRole, deleteUser } from "../services/api";
import getRoleBadgeColor from "../components/Common";
import Loader from "../components/Loader";

function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setError(`${err} Failed to fetch users`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        await updateUserRole(userId, newRole);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to update role");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete user");
      }
    }
  };

  if (loading) return <Loader />;

  if (user.role !== "ADMIN" && user.role !== "STAFF") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-5">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border-2 border-red-200">
          <div className="text-center">
            <div className="text-7xl mb-6">🚫</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Access Denied
            </h2>
            <div className="bg-linear-to-r from-red-100 to-rose-100 text-red-700 p-6 rounded-xl border-l-4 border-red-500">
              <p className="text-lg font-semibold">
                You don't have permission to view this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Users Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage user roles and permissions
          </p>
        </div>

        {error && (
          <div className="bg-linear-to-r from-red-100 to-rose-100 border-l-4 border-red-500 text-red-700 p-5 mb-8 rounded-xl shadow-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border-2 border-purple-100">
          {/* Header */}
          <div className="grid grid-cols-5 font-bold py-5 px-6 text-sm uppercase tracking-wide border-b border-b-gray-300">
            <div> Name</div>
            <div> Email</div>
            <div> Role</div>
            <div> Products</div>
            <div> Actions</div>
          </div>

          {/* Rows */}
          {users.map((u, index) => (
            <div
              key={u.id}
              className={`grid grid-cols-5 py-5 px-6 border-b border-gray-100 items-center hover:bg-purple-50 transition-colors duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
            >
              <div className="font-semibold text-gray-800">
                {u.name}
                {u.id === user.id && (
                  <span className="ml-2 px-3 py-1 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-md">
                    You
                  </span>
                )}
              </div>

              <div className="text-gray-600 text-sm">{u.email}</div>

              <div>
                <span
                  className={`px-4 py-1.5 text-xs font-bold text-white rounded-full shadow-md ${getRoleBadgeColor(
                    u.role
                  )}`}
                >
                  {u.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {u._count.products}
                </span>
              </div>

              <div>
                {u.id !== user.id && (
                  <div className="flex items-center gap-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={user.role === "STAFF" && u.role === "ADMIN"}
                      className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-white font-semibold text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="USER">USER</option>
                      <option value="STAFF">STAFF</option>
                      {user.role === "ADMIN" && (
                        <option value="ADMIN">ADMIN</option>
                      )}
                    </select>

                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-purple-100">
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {users.length}
              </div>
              <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Total Users
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getRoleBadgeColor(
                  (users.role = "ADMIN")
                )} bg-clip-text text-transparent`}
              >
                {users.filter((u) => u.role === "ADMIN").length}
              </div>
              <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Admins
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getRoleBadgeColor(
                  (users.role = "STAFF")
                )} bg-clip-text text-transparent`}
              >
                {users.filter((u) => u.role === "STAFF").length}
              </div>
              <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Staff
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getRoleBadgeColor(
                  (users.role = "USER")
                )} bg-clip-text text-transparent`}
              >
                {users.filter((u) => u.role === "USER").length}
              </div>
              <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Users
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
