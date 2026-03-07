// Dependencies: Navigate — see DEPENDENCY_GUIDE.md
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route guard — wraps pages that require authentication.
 * Shows a loading state while the initial auth check runs (fetchUser on mount).
 * Redirects to /login if the user is not authenticated.
 * Usage: <ProtectedRoute><DashboardPage /></ProtectedRoute>
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Wait for the initial auth check before deciding (prevents flash of login page)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // No user = not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
