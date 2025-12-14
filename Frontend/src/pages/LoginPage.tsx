import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      await Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: 'You have successfully logged in.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: '#6366f1',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back. Please enter your details.
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm 
                focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm 
                  focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>

              <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white
              hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/30
              disabled:opacity-50 transition"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-slate-600">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );

}
