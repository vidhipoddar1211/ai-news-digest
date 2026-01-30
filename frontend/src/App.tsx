import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Feed } from './pages/Feed';
import { History } from './pages/History';
import { Preferences } from './pages/Preferences';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Loading } from './pages/Loading';
import { NotFound } from './pages/NotFound';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/login" element={<Layout><PublicRoute><Login /></PublicRoute></Layout>} />
      <Route path="/register" element={<Layout><PublicRoute><Register /></PublicRoute></Layout>} />

      <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
      <Route path="/feed" element={<Layout><ProtectedRoute><Feed /></ProtectedRoute></Layout>} />
      <Route path="/history" element={<Layout><ProtectedRoute><History /></ProtectedRoute></Layout>} />
      <Route path="/preferences" element={<Layout><ProtectedRoute><Preferences /></ProtectedRoute></Layout>} />
      <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
      <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} />

      <Route path="/loading" element={<Loading />} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
