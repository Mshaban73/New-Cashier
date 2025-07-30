
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { UserManagement } from './pages/UserManagement';
import { Reconciliation } from './pages/Reconciliation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Permission } from './types';

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Routes that only require the user to be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            {/* Route for transactions, requiring ADD_TRANSACTION permission */}
            <Route element={<ProtectedRoute requiredPermission={Permission.ADD_TRANSACTION} />}>
              <Route path="transactions" element={<Transactions />} />
            </Route>

            {/* Route for reconciliation, requiring PERFORM_RECONCILIATION permission */}
            <Route element={<ProtectedRoute requiredPermission={Permission.PERFORM_RECONCILIATION} />}>
              <Route path="reconciliation" element={<Reconciliation />} />
            </Route>
            
            {/* Route for user management, requiring MANAGE_USERS permission */}
            <Route element={<ProtectedRoute requiredPermission={Permission.MANAGE_USERS} />}>
              <Route path="users" element={<UserManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
