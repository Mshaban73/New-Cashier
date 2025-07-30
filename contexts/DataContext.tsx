// ==========================================================
//   ملف: contexts/DataContext.tsx (النسخة النهائية الصحيحة)
// ==========================================================

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// *** تم حذف سطر import from '../types' ***

// VVVV تم وضع كل أنواع البيانات هنا مباشرة VVVV
export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  VIEW_REPORTS = 'VIEW_REPORTS',
  PERFORM_RECONCILIATION = 'PERFORM_RECONCILIATION',
}
export interface User {
  id: string;
  username: string;
  passwordHash: string;
  permissions: Permission[];
}
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  userId: string;
}
export interface DailyLog {
  id: string;
  date: string;
  systemBalance: number;
  actualBalance: number;
  difference: number;
  notes: string;
  userId: string;
}
// ^^^^ نهاية أنواع البيانات ^^^^

const initialUsers: User[] = [
    { id: 'admin-user', username: 'admin', passwordHash: 'admin123', permissions: Object.values(Permission) },
    { id: 'standard-user', username: 'user', passwordHash: 'user123', permissions: [Permission.ADD_TRANSACTION, Permission.VIEW_REPORTS] }
];

interface DataContextType {
    users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    transactions: Transaction[]; setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    dailyLogs: DailyLog[]; setDailyLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('treasury_users', initialUsers);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('treasury_transactions', []);
    const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLog[]>('treasury_daily_logs', []);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
    const addUser = (user: Omit<User, 'id'>) => setUsers(prev => [...prev, { ...user, id: crypto.randomUUID() }]);
    const updateUser = (updatedUser: User) => setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    const deleteUser = (userId: string) => setUsers(prev => prev.filter(user => user.id !== userId));
    const addDailyLog = (log: Omit<DailyLog, 'id'>) => setDailyLogs(prev => [...prev, { ...log, id: crypto.randomUUID() }]);
    
    const value = { users, setUsers, transactions, setTransactions, dailyLogs, setDailyLogs, addTransaction, addUser, updateUser, deleteUser, addDailyLog };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};