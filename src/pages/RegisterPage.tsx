// Dependencies: FormEvent, useState, Link, useNavigate — see DEPENDENCY_GUIDE.md
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nContext';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useI18n();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.auth.passwordMinLength);
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { error: string } } }).response?.data?.error
          : t.auth.registrationFailed;
      setError(message || t.auth.registrationFailed);
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
          <p className="mt-2 text-content-tertiary">{t.auth.createAccount}</p>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-content-secondary">
              {t.auth.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-line-strong px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? t.auth.creatingAccount : t.auth.createAccountBtn}
          </button>

          <p className="text-center text-sm text-content-tertiary">
            {t.auth.hasAccount}{' '}
            <Link to="/login" className="text-accent-text hover:text-accent-muted">
              {t.auth.signInBtn}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
