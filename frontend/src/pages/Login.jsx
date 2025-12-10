import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Shield } from "lucide-react";
import {
  forgotPassword,
  login,
  resetPassword,
  verifyOtp,
} from "../services/api";
import { Link, useNavigate } from "react-router-dom";


export default function Login({ setUser }) {
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setLoading(true);
    console.log(formData.email);
    try {
      const response = await forgotPassword({ email: formData.email });
      console.log(response);
      setSuccess(`OTP sends successfully to ${formData.email}`);
      setTimeout(() => {
        setView("otp");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = parseInt(otp.join(""));

    console.log(otpValue);
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp: otpValue });
      setSuccess("OTP verified successfully!");
      setTimeout(() => {
        setView("reset");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setSuccess("Password reset successfully!");
      setTimeout(() => {
        setView("login");
        setFormData({
          email: "",
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setView("login");
    setError("");
    setSuccess("");
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          {view !== "login" && (
            <button
              onClick={resetToLogin}
              className="absolute left-8 top-8 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}

          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
            {view === "login" && <Lock className="text-white" size={28} />}
            {view === "forgot" && <Mail className="text-white" size={28} />}
            {view === "otp" && <Shield className="text-white" size={28} />}
            {view === "reset" && <Lock className="text-white" size={28} />}
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            {view === "login" && "Welcome Back"}
            {view === "forgot" && "Forgot Password"}
            {view === "otp" && "Verify OTP"}
            {view === "reset" && "Reset Password"}
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            {view === "login" && "Login to your account"}
            {view === "forgot" && "Enter your email to receive OTP"}
            {view === "otp" && "Enter the 6-digit code sent to your email"}
            {view === "reset" && "Create a new password"}
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Login Form */}
        {view === "login" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* Forgot Password Form */}
        {view === "forgot" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP Verification Form */}
        {view === "otp" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Didn't receive code?{" "}
              <span className="text-blue-400 underline cursor-pointer">
                Resend
              </span>
            </button>
          </div>
        )}

        {/* Reset Password Form */}
        {view === "reset" && (
          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-base font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* Footer - Only show on login view */}
        {view === "login" && (
          <p className="text-center mt-6 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
