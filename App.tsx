// ==========================================================
//   ملف: App.tsx (النسخة النهائية مع الإصلاح المباشر)
// ==========================================================

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

// VVVV تم نسخ النوع المطلوب هنا مباشرة VVVV
export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  VIEW_REPORTS = 'VIEW_REPORTS',
  PERFORM_RECONCILIATION = 'PERFORM_RECONCILIATION',
}
// VVVV تم حذف سطر import { Permission } from "./types"; VVVV

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission={Permission.ADD_TRANSACTION} />}>
              <Route path="transactions" element={<Transactions />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission={Permission.PERFORM_RECONCILIATION} />}>
              <Route path="reconciliation" element={<Reconciliation />} />
            </Route>
            
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