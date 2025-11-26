import { Link } from 'react-router-dom';
import getRoleBadgeColor from '../components/Common';

function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Dashboard
          </h1>

          <div className="flex flex-wrap items-center gap-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100">
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome back, <span className="text-purple-600">{user.name}</span>!
            </h2>

            <span
              className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-md ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Products Card */}
          <Link
            to="/products"
            className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer no-underline text-gray-900 border-2 border-transparent hover:border-purple-300 relative overflow-hidden"
          >
            
            
            <div className="relative z-10">
              <div className="text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                Products
              </h3>
              <p className="text-gray-600 mb-4 text-base">View and manage products</p>

              {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg">
                  <span className="text-green-600 text-sm font-semibold">✓ Can add/edit</span>
                </div>
              )}
            </div>
          </Link>

          {/* Users Card */}
          {(user.role === 'ADMIN' || user.role === 'STAFF') && (
            <Link
              to="/users"
              className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer no-underline text-gray-900 border-2 border-transparent hover:border-blue-300 relative overflow-hidden"
            >
              
              
              <div className="relative z-10">
                <div className="text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300">👥</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  Users
                </h3>
                <p className="text-gray-600 mb-4 text-base">Manage user roles</p>
                
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg">
                  <span className="text-green-600 text-sm font-semibold">✓ Can promote/demote</span>
                </div>
              </div>
            </Link>
          )}

          {/* Permission Overview Card */}
          <div className="group bg-linear-to-br from-white to-purple-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-200 relative overflow-hidden">
            
            <div className="relative z-10">
              <div className="text-6xl mb-5 transform group-hover:scale-110 transition-transform duration-300">ℹ️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Permissions</h3>

              <ul className="text-gray-700 space-y-3">
                <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="font-medium">View products</span>
                </li>

                {(user.role === 'ADMIN' || user.role === 'STAFF') ? (
                  <>
                    <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="font-medium">Add products</span>
                    </li>
                    <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="font-medium">Edit products</span>
                    </li>
                    <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="font-medium">Delete products</span>
                    </li>
                    <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="font-medium">View users</span>
                    </li>
                    <li className="flex items-center gap-3 bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <span className="font-medium">Change user roles</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-center gap-3 bg-red-50 px-3 py-2 rounded-lg">
                    <span className="text-red-600 font-bold text-lg">✗</span>
                    <span className="font-medium">Cannot add/edit products</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;