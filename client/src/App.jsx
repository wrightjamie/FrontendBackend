import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import UserButton from './components/UserButton';
import LoginModal from './components/LoginModal';
import AdminLayout from './layouts/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminData from './pages/admin/AdminData';
import AdminSettings from './pages/admin/AdminSettings';
import GenericAdminPage from './pages/admin/GenericAdminPage';
import { Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <>
      <UserButton isLoggedIn={isLoggedIn} username={username} />
      <LoginModal
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
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
    </>
  );
}

export default App;
