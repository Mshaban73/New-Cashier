
export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  VIEW_REPORTS = 'VIEW_REPORTS',
  PERFORM_RECONCILIATION = 'PERFORM_RECONCILIATION',
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this would be a hash. Here, it's plain text for simplicity.
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
  date: string; // ISO string format
  userId: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  systemBalance: number;
  actualBalance: number;
  difference: number;
  notes: string;
  userId: string;
}
