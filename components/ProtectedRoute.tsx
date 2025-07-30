
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Permission } from '../types';
import { Sidebar } from './Sidebar';

interface ProtectedRouteProps {
    requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
    const { currentUser, hasPermission } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            <div className="flex bg-gray-900 text-white min-h-screen">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-red-500">غير مصرح لك</h1>
                        <p className="mt-4 text-gray-300">ليس لديك الصلاحية الكافية للوصول إلى هذه الصفحة.</p>
                    </div>
                </main>
            </div>
        );
    }
    
    return (
        <div className="flex bg-gray-900 text-white min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
