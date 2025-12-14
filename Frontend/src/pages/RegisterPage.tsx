import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Passwords do not match',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to our community!',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Get started with your free account
            </p>
          </div>
  
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
  
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Justin"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                  focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                  focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
            </div>
  
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Justin"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
  
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
  
            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm
                    focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm
                    focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>
  
            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </a>
              </span>
            </div>
  
            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white
              hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/30
              disabled:opacity-50 transition"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
  
            {/* Footer */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
  
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
  
}
