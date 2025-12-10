import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import getRoleBadgeColor from "./Common";
import { API_URL } from "../services/api";

function Navbar({ user, logout, cartItemCount = 0 }) {
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      return `${API_URL}/${imagePath}`;
    };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-sm md:text-2xl font-bold">
          Role-based-authorization
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-2xl fixed right-1"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Menu */}
        <div
          className={`${
            open ? "block mr-4" : "hidden"
          } md:flex gap-6 md:text-lg items-center`}
        >
          <NavLink
            className="text-white px-3 py-2 rounded hover:bg-white/10 transition"
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            className="text-white px-3 py-2 rounded hover:bg-white/10 transition"
            to="/products"
          >
            Products
          </NavLink>

          {(user.role === "ADMIN" || user.role === "STAFF") && (
            <NavLink
              className="text-white px-3 py-2 rounded hover:bg-white/10 transition"
              to="/users"
            >
              Users
            </NavLink>
          )}

          {/* Cart Link - Mobile */}
          <NavLink
            className="md:hidden text-white px-3 py-2 rounded hover:bg-white/10 transition flex items-center gap-2"
            to="/cart"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <NavLink
            to="/cart"
            className="relative text-white hover:text-gray-300 transition"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>

          <span className="text-base">{user.name}</span>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {user.role}
          </span>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm cursor-pointer"
          >
            Logout
          </button>
          <div className="relative">
            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={getImageUrl(user.image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile user section */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:hidden px-4 pb-4 border-t border-gray-700`}
      >
        <div className="flex items-center gap-3 mt-3">
          <span className="text-base">{user.name}</span>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {user.role}
          </span>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm ml-auto"
          >
            Logout
          </button>
          <div className="relative">
            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={user?.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
