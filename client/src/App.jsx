import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LoginModal from './components/LoginModal';
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminData from './pages/admin/AdminData';
import AdminSettings from './pages/admin/AdminSettings';
import GenericAdminPage from './pages/admin/GenericAdminPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Setup from './pages/Setup';
import Header from './components/Header';
import Footer from './components/Footer';
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

  if (loading) return <div>Loading...</div>;

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
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<GenericAdminPage title="Analytics" />} />
            <Route path="logs" element={<GenericAdminPage title="System Logs" />} />
            <Route path="security" element={<GenericAdminPage title="Security" />} />
            <Route path="roles" element={<GenericAdminPage title="Permissions & Roles" />} />
            <Route path="audit" element={<GenericAdminPage title="Audit Trail" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isSetupPage && <Footer />}
    </div>
  );
}

export default App;
