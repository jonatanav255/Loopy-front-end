// Dependencies: axios.create, interceptors, localStorage — see DEPENDENCY_GUIDE.md
import axios from 'axios';

// Configured Axios instance for all API calls.
// baseURL '/api' is proxied to localhost:8080 by Vite during development (see vite.config.ts).
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * REQUEST interceptor — attaches the JWT access token to every outgoing request.
 * The backend's JwtAuthenticationFilter reads this to authenticate the user.
 */
/** Returns the storage that holds the current session's tokens. */
function getStorage(): Storage {
  if (localStorage.getItem('accessToken')) return localStorage;
  return sessionStorage;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * RESPONSE interceptor — handles automatic token refresh on 401 responses.
 * Flow: request fails with 401 → use refresh token to get new tokens → retry original request.
 * If refresh also fails, clear storage and redirect to login.
 * The _retry flag prevents infinite loops (only retry once per request).
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storage = getStorage();
      const refreshToken = storage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Use raw axios (not the api instance) to avoid triggering this interceptor again
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        storage.setItem('accessToken', data.accessToken);
        storage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest); // Retry the original request with new token
      } catch {
        // Refresh failed — token is expired or revoked, force re-login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
