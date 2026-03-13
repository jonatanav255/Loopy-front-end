// Dependencies: FormEvent, useState, Link, useNavigate — see DEPENDENCY_GUIDE.md
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nContext';

export function LoginPage() {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') ?? '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('rememberedEmail'));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useI18n();

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
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : t.auth.loginFailed;
      setError(message || t.auth.loginFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-alt px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold text-content">{t.appName}</h1>
            <button
              onClick={toggleLang}
              className="rounded border border-line-strong px-2 py-0.5 text-xs font-medium text-content-secondary hover:bg-surface-hover"
            >
              {lang === 'en' ? t.language.es : t.language.en}
            </button>
          </div>
          <p className="mt-2 text-content-tertiary">{t.auth.signIn}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-surface p-8 shadow">
          {error && (
            <div className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content-secondary">
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content-secondary">
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="accent-accent"
            />
            <span className="text-sm text-content-secondary">{t.auth.rememberMe}</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? t.auth.signingIn : t.auth.signInBtn}
          </button>

          <p className="text-center text-sm text-content-tertiary">
            {t.auth.noAccount}{' '}
            <Link to="/register" className="text-accent-text hover:text-accent-muted">
              {t.auth.register}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
