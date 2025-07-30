
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Transaction, DailyLog, Permission } from '../types';

// Default admin user
const initialUsers: User[] = [
    {
        id: 'admin-user',
        username: 'admin',
        passwordHash: 'admin123', // Plain text for offline simplicity
        permissions: Object.values(Permission),
    },
    {
        id: 'standard-user',
        username: 'user',
        passwordHash: 'user123',
        permissions: [Permission.ADD_TRANSACTION, Permission.VIEW_REPORTS],
    }
];

interface DataContextType {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    dailyLogs: DailyLog[];
    setDailyLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    addDailyLog: (log: Omit<DailyLog, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('treasury_users', initialUsers);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('treasury_transactions', []);
    const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLog[]>('treasury_daily_logs', []);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        setTransactions(prev => [...prev, newTransaction]);
    };
    
    const addUser = (user: Omit<User, 'id'>) => {
        const newUser = { ...user, id: crypto.randomUUID() };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(user => user.id !== userId));
    };
    
    const addDailyLog = (log: Omit<DailyLog, 'id'>) => {
        const newLog = { ...log, id: crypto.randomUUID() };
        setDailyLogs(prev => [...prev, newLog]);
    }

    const value = {
        users,
        setUsers,
        transactions,
        setTransactions,
        dailyLogs,
        setDailyLogs,
        addTransaction,
        addUser,
        updateUser,
        deleteUser,
        addDailyLog,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
