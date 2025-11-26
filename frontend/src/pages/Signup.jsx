import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";

function Signup({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await signup(formData);
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center mb-8 text-2xl font-semibold text-gray-800">
          Signup
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded text-lg font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Signing..." : "Signup"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
