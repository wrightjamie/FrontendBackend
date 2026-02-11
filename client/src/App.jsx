import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginModal from './components/auth/LoginModal';
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminData from './pages/admin/AdminData';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSettings from './pages/admin/AdminSettings';
import ToastPlayground from './pages/admin/ToastPlayground';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useSiteMeta } from './hooks/useSiteMeta';
import Setup from './pages/Setup';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MaintenancePage from './pages/MaintenancePage';
import styles from './App.module.css';

function App() {
  const { user, needsSetup, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If setup is needed and we aren't on setup page, redirect
    if (!loading && needsSetup && location.pathname !== '/setup') {
      navigate('/setup');
    }
  }, [needsSetup, loading, location.pathname, navigate]);

  const { meta, loading: loadingMeta } = useSiteMeta();
  const isAdmin = user?.role === 'admin';

  if (loading || loadingMeta) return <div>Loading...</div>;

  // Maintenance Mode Redirect Logic
  // Show maintenance page if active and user is not an admin
  if (meta.maintenanceMode && !isAdmin && location.pathname !== '/login') {
    return <MaintenancePage />;
  }

  const isSetupPage = location.pathname === '/setup';

  return (
    <div className={styles.appContainer}>
      {!isSetupPage && (
        <>
          <Header />
          <LoginModal />
        </>
      )}
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'editor']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="data" element={<AdminData />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="test-toasts" element={<ToastPlayground />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isSetupPage && <Footer />}
    </div>
  );
}

export default App;
