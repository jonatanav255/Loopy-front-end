// Dependencies: createContext, useCallback, useEffect, useState — see DEPENDENCY_GUIDE.md
import { createContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { UserResponse } from '../types/auth';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// null default means useContext returns null if no Provider exists above (useAuth guards this)
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides auth state (user, loading) and actions (login, register, logout) to the entire app.
 * On mount, checks localStorage for an existing token and fetches the user profile.
 * Tokens are stored in localStorage — persists across tabs and browser restarts.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true); // True until initial auth check completes

  /** Checks if we have a stored token and loads the user profile from /api/auth/me. */
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      // Token is invalid/expired and refresh failed — clear everything
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs once on mount to restore the session
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /** Authenticates, stores tokens, then fetches user profile. */
  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    await fetchUser();
  };

  /** Creates account, stores tokens, then fetches user profile (auto-login after register). */
  const register = async (email: string, password: string) => {
    const { data } = await authApi.register({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    await fetchUser();
  };

  /** Revokes refresh token on server, then clears local state. */
  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Server might be down — still clear local state
      }
    }
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
