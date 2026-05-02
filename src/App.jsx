import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// Lazy-load every page so each route is a separate chunk.
// Monaco Editor (~2MB) only loads when the user navigates to /practice.
const Landing          = lazy(() => import('./pages/Landing'));
const Login            = lazy(() => import('./pages/Login'));
const Register         = lazy(() => import('./pages/Register'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const PracticeTopic    = lazy(() => import('./pages/PracticeTopic'));
const PracticeWorkspace = lazy(() => import('./pages/PracticeWorkspace'));
const Leaderboard      = lazy(() => import('./pages/Leaderboard'));
const Friends          = lazy(() => import('./pages/Friends'));
const Community        = lazy(() => import('./pages/Community'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));

// Shared full-screen loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#050510]">
    <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/practice/:slug" element={<ProtectedRoute><PracticeTopic /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticeWorkspace /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
