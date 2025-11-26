import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center mb-8 text-gray-800 text-2xl font-semibold">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-5">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-blue-600 text-white rounded text-base font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logining..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-5 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
