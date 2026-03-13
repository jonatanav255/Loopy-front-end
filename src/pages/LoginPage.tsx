// Dependencies: FormEvent, useState, Link, useNavigate — see DEPENDENCY_GUIDE.md
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') ?? '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      await login(email, password, rememberMe);
      navigate('/'); // redirect to dashboard on success
    } catch (err: unknown) {
      // Extract the error message from the backend response ({ "error": "..." }),
      // or fall back to a generic message if the response shape is unexpected
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : 'Login failed';
      setError(message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-content">Loopy</h1>
          <p className="mt-2 text-content-tertiary">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-surface p-8 shadow">
          {error && (
            <div className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="accent-indigo-600"
            />
            <span className="text-sm text-content-secondary">Remember me</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-content-tertiary">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
