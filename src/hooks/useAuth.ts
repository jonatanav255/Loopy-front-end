// Dependencies: useContext — see DEPENDENCY_GUIDE.md
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Convenience hook to access auth state and actions from any component.
 * Must be used inside <AuthProvider> — throws if not.
 * Returns: { user, loading, login, register, logout }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
