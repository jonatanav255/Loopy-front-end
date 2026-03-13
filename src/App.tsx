// Dependencies: BrowserRouter, Routes, Route, Navigate — see DEPENDENCY_GUIDE.md
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TopicsPage } from './pages/TopicsPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { ConceptDetailPage } from './pages/ConceptDetailPage';
import { ReviewPage } from './pages/ReviewPage';
import { TeachBackPage } from './pages/TeachBackPage';
import { AIPage } from './pages/AIPage';
import { SearchPage } from './pages/SearchPage';
import { DataPortPage } from './pages/DataPortPage';

/**
 * Root component — sets up routing, auth context, toast notifications, and i18n.
 * Public routes: /login, /register
 * Protected routes use AppLayout with sidebar navigation.
 */
function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes with sidebar layout */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="topics" element={<TopicsPage />} />
                  <Route path="topics/:topicId" element={<TopicDetailPage />} />
                  <Route path="topics/:topicId/concepts/:conceptId" element={<ConceptDetailPage />} />
                  <Route path="review" element={<ReviewPage />} />
                  <Route path="teach-back" element={<TeachBackPage />} />
                  <Route path="ai" element={<AIPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="data" element={<DataPortPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

export default App;
