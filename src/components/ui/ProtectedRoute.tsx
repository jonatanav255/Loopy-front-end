// Dependencies: Navigate — see DEPENDENCY_GUIDE.md
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../contexts/I18nContext';

/**
 * Route guard — wraps pages that require authentication.
 * Shows a loading state while the initial auth check runs (fetchUser on mount).
 * Redirects to /login if the user is not authenticated.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-content-muted">{t.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
