import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Navbar from "./components/Navbar";
import { getCurrentUser, getMyCarts } from "./services/api";
import Loader from "./components/Loader";
import Cart from "./pages/Cart";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
          console.log(error);
        }
      }

      setLoading(false);
    };
    checkAuth();
  }, []);

  const updateCartCount = useCallback(async () => {
    if (user) {
      try {
        const response = await getMyCarts();
        const items = response.data.cart || [];
        const totalItems = items.reduce((sum, item) => sum + item.count, 0);
        setCartItemCount(totalItems);
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      (async () => {
        await updateCartCount();
      })();
    }
  }, [user, updateCartCount]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartItemCount(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Navbar user={user} logout={logout} cartItemCount={cartItemCount} />
          <main>
            <Outlet />
          </main>
        </div>
      ),
      children: [
        {
          path: "/",
          element: user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "/login",
          element: user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login setUser={setUser} />
          ),
        },
        {
          path: "/signup",
          element: user ? (
            <Navigate to="/dashboard" />
          ) : (
            <Signup setUser={setUser} />
          ),
        },
        {
          path: "/dashboard",
          element: user ? <Dashboard user={user} /> : <Navigate to="/login" />,
        },
        {
          path: "/products",
          element: user ? (
            <Products user={user} updateCartCount={updateCartCount} />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "/users",
          element: user ? <Users user={user} /> : <Navigate to="/login" />,
        },
        {
          path: "/cart",
          element: user ? (
            <Cart user={user} updateCartCount={updateCartCount} />
          ) : (
            <Navigate to="/login" />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
