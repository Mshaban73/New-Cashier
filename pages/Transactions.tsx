
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Transaction, TransactionType } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const TransactionForm: React.FC<{ type: TransactionType; onClose: () => void }> = ({ type, onClose }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const { addTransaction } = useData();
    const { currentUser } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !currentUser) return;

        addTransaction({
            type,
            amount: parseFloat(amount),
            description,
            date: new Date().toISOString(),
            userId: currentUser.id,
        });

        onClose();
    };

    const isIncome = type === TransactionType.INCOME;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md border border-gray-700 text-white">
                <h2 className={`text-2xl font-bold mb-6 text-center ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                    تسجيل {isIncome ? 'دخل' : 'مصروف'} جديد
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-300">المبلغ</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-300">الوصف</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                            placeholder="وصف المعاملة..."
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">إلغاء</button>
                        <button type="submit" className={`px-6 py-2 rounded-lg ${isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition-colors`}>حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Transactions: React.FC = () => {
    const { transactions, users } = useData();
    const [showForm, setShowForm] = useState<TransactionType | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    const filteredTransactions = useMemo(() => {
        return [...transactions]
            .filter(t => filter === 'ALL' || t.type === filter)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, filter]);
    
    return (
        <div className="space-y-6">
             {showForm && <TransactionForm type={showForm} onClose={() => setShowForm(null)} />}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-white">سجل المعاملات</h1>
                <div className="flex gap-4">
                    <button onClick={() => setShowForm(TransactionType.INCOME)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة دخل</button>
                    <button onClick={() => setShowForm(TransactionType.EXPENSE)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة مصروف</button>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex justify-end mb-4">
                    <select onChange={(e) => setFilter(e.target.value as any)} value={filter} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5">
                        <option value="ALL">الكل</option>
                        <option value="INCOME">الدخل</option>
                        <option value="EXPENSE">المصروفات</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="text-gray-400">
                            <tr className="border-b-2 border-gray-700">
                                <th className="p-4 font-semibold text-right">التاريخ والوقت</th>
                                <th className="p-4 font-semibold text-right">الوصف</th>
                                <th className="p-4 font-semibold text-right">النوع</th>
                                <th className="p-4 font-semibold text-right">المبلغ (ج.م)</th>
                                <th className="p-4 font-semibold text-right">المستخدم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => {
                                const user = users.find(u => u.id === tx.userId);
                                const isIncome = tx.type === TransactionType.INCOME;
                                return (
                                    <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-4 text-gray-300">{new Date(tx.date).toLocaleString('ar-EG')}</td>
                                        <td className="p-4">{tx.description}</td>
                                        <td className={`p-4 font-semibold`}>
                                            <span className={`px-2 py-1 rounded-full text-xs ${isIncome ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {isIncome ? 'دخل' : 'مصروف'}
                                            </span>
                                        </td>
                                        <td className={`p-4 font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>{tx.amount.toLocaleString('ar-EG')}</td>
                                        <td className="p-4 text-gray-400">{user?.username || 'غير معروف'}</td>
                                    </tr>
                                )
                            }) : (
                                 <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">لا توجد معاملات لعرضها.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
