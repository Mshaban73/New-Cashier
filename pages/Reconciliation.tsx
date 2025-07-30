
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { TransactionType, DailyLog } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export const Reconciliation: React.FC = () => {
    const { transactions, dailyLogs, addDailyLog, users } = useData();
    const { currentUser } = useAuth();
    const [actualBalance, setActualBalance] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const systemBalance = useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return totalIncome - totalExpense;
    }, [transactions]);

    const difference = actualBalance ? parseFloat(actualBalance) - systemBalance : 0;

    const today = new Date().toISOString().split('T')[0];
    const hasLoggedToday = dailyLogs.some(log => log.date === today);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasLoggedToday || !currentUser) {
            setError('لقد تم إجراء الجرد لهذا اليوم بالفعل.');
            return;
        }
        if (!actualBalance) {
            setError('الرجاء إدخال الرصيد الفعلي.');
            return;
        }
        setError('');

        addDailyLog({
            date: today,
            systemBalance,
            actualBalance: parseFloat(actualBalance),
            difference,
            notes,
            userId: currentUser.id,
        });

        setActualBalance('');
        setNotes('');
    };
    
    const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">الجرد اليومي للخزينة</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">جرد اليوم - {new Date().toLocaleDateString('ar-EG')}</h2>
                        {hasLoggedToday ? (
                            <div className="text-center p-8 bg-gray-900 rounded-lg">
                                <p className="text-green-400 font-bold">تم إتمام جرد اليوم بنجاح.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400">الرصيد الدفتري (النظام)</label>
                                    <p className="text-2xl font-bold text-cyan-400 mt-1">{systemBalance.toLocaleString('ar-EG')} ج.م</p>
                                </div>
                                <div>
                                    <label htmlFor="actualBalance" className="block mb-2 text-sm font-medium text-gray-300">الرصيد الفعلي (الموجود بالخزينة)</label>
                                    <input
                                        type="number"
                                        id="actualBalance"
                                        value={actualBalance}
                                        onChange={(e) => setActualBalance(e.target.value)}
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                        placeholder="أدخل المبلغ الفعلي"
                                        required
                                    />
                                </div>
                                 <div>
                                    <label className="block text-gray-400">الفرق</label>
                                    <p className={`text-2xl font-bold mt-1 ${difference === 0 ? 'text-gray-300' : difference > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {difference.toLocaleString('ar-EG')} ج.م
                                    </p>
                                    {difference !== 0 && <p className="text-xs text-gray-400">{difference > 0 ? 'زيادة' : 'عجز'}</p>}
                                </div>
                                <div>
                                    <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-300">ملاحظات</label>
                                    <textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                        placeholder="أي ملاحظات حول الفرق إن وجد..."
                                    ></textarea>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                    تأكيد وحفظ الجرد
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">سجل الجرد السابق</h2>
                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-right">
                            <thead className="text-gray-400 sticky top-0 bg-gray-800">
                                <tr className="border-b-2 border-gray-700">
                                    <th className="p-3 font-semibold text-right">التاريخ</th>
                                    <th className="p-3 font-semibold text-right">الرصيد الدفتري</th>
                                    <th className="p-3 font-semibold text-right">الرصيد الفعلي</th>
                                    <th className="p-3 font-semibold text-right">الفرق</th>
                                    <th className="p-3 font-semibold text-right">المسؤول</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLogs.length > 0 ? sortedLogs.map((log) => {
                                    const user = users.find(u => u.id === log.userId);
                                    return (
                                        <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3">{new Date(log.date).toLocaleDateString('ar-EG')}</td>
                                            <td className="p-3">{log.systemBalance.toLocaleString('ar-EG')}</td>
                                            <td className="p-3">{log.actualBalance.toLocaleString('ar-EG')}</td>
                                            <td className={`p-3 font-bold ${log.difference === 0 ? 'text-gray-300' : log.difference > 0 ? 'text-yellow-400' : 'text-red-400'}`}>{log.difference.toLocaleString('ar-EG')}</td>
                                            <td className="p-3 text-gray-400">{user?.username || 'غير معروف'}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-gray-500">لا يوجد سجلات جرد سابقة.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
