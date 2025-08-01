// src/contexts/AuthContext.tsx (النسخة النظيفة والنهائية)

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
// VVVV هذا هو التعديل الأهم VVVV
import { useData, User, Permission } from './DataContext'; // استيراد الأنواع من DataContext
import { useLocalStorage } from '../hooks/useLocalStorage';

// تم حذف كل الأنواع المكررة من هنا

interface AuthContextType {
    currentUser: User | null;
    login: (username: string, passwordHash: string) => boolean;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { users } = useData(); 
    const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('treasury_current_user_id', null);

    const currentUser = useMemo(() => {
        if (!currentUserId) return null;
        return users.find(u => u.id === currentUserId) || null;
    }, [currentUserId, users]);

    const login = (username: string, passwordHash: string): boolean => {
        const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
        if (user) {
            setCurrentUserId(user.id);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUserId(null);
    };

    const hasPermission = (permission: Permission): boolean => {
        return currentUser?.permissions.includes(permission) || false;
    };

    const value = { currentUser, login, logout, hasPermission };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};