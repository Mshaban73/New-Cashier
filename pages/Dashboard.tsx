
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Transaction, TransactionType } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-gray-800 p-6 rounded-xl border border-gray-700`}>
        <h3 className="text-gray-400 text-lg">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const { users } = useData();
    const user = users.find(u => u.id === tx.userId);
    const isIncome = tx.type === TransactionType.INCOME;

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="p-4">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
            <td className="p-4">{tx.description}</td>
            <td className={`p-4 font-semibold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                {isIncome ? '+' : '-'} {tx.amount.toLocaleString('ar-EG')}
            </td>
            <td className="p-4 text-gray-400">{user?.username || 'غير معروف'}</td>
        </tr>
    );
};

export const Dashboard: React.FC = () => {
    const { transactions } = useData();
    const { currentUser } = useAuth();
    
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = totalIncome - totalExpense;

    const today = new Date().toISOString().split('T')[0];
    const todayIncome = transactions
        .filter(t => t.type === TransactionType.INCOME && t.date.startsWith(today))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const todayExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(today))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">أهلاً بك، {currentUser?.username}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="الرصيد الحالي" value={`${currentBalance.toLocaleString('ar-EG')} ج.م`} color="text-cyan-400" />
                <StatCard title="إجمالي الدخل" value={`${totalIncome.toLocaleString('ar-EG')} ج.م`} color="text-green-400" />
                <StatCard title="إجمالي المصروفات" value={`${totalExpense.toLocaleString('ar-EG')} ج.م`} color="text-red-400" />
                <StatCard title="صافي حركة اليوم" value={`${(todayIncome - todayExpense).toLocaleString('ar-EG')} ج.م`} color="text-yellow-400" />
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">آخر 5 معاملات</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="text-gray-400">
                            <tr className="border-b border-gray-600">
                                <th className="p-4 font-semibold text-right">التاريخ</th>
                                <th className="p-4 font-semibold text-right">الوصف</th>
                                <th className="p-4 font-semibold text-right">المبلغ (ج.م)</th>
                                <th className="p-4 font-semibold text-right">المستخدم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-gray-500">لا توجد معاملات لعرضها.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
