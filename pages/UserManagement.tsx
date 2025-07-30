
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { User, Permission } from '../contexts/DataContext';

const UserFormModal: React.FC<{ user?: User; onClose: () => void }> = ({ user, onClose }) => {
    const { addUser, updateUser } = useData();
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>(user?.permissions || []);
    const [error, setError] = useState('');

    const handlePermissionChange = (permission: Permission, checked: boolean) => {
        setPermissions(prev =>
            checked ? [...prev, permission] : prev.filter(p => p !== permission)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            setError('اسم المستخدم مطلوب.');
            return;
        }
        if (!user && !password) { // Password required for new users
             setError('كلمة المرور مطلوبة للمستخدم الجديد.');
            return;
        }
        
        const userData = {
            username,
            passwordHash: password || user?.passwordHash || '', // Keep old password if not changed
            permissions,
        };
        
        if (user) {
            updateUser({ ...user, ...userData });
        } else {
            addUser(userData);
        }
        onClose();
    };

    const permissionLabels: Record<Permission, string> = {
        [Permission.MANAGE_USERS]: 'إدارة المستخدمين',
        [Permission.ADD_TRANSACTION]: 'إضافة معاملات',
        [Permission.VIEW_REPORTS]: 'عرض التقارير',
        [Permission.PERFORM_RECONCILIATION]: 'إجراء الجرد اليومي',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg border border-gray-700 text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">اسم المستخدم</label>
                        <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg w-full p-2.5" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">كلمة المرور</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg w-full p-2.5" placeholder={user ? 'اترك الحقل فارغاً لعدم التغيير' : ''} />
                    </div>
                    <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-300">الصلاحيات</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(Permission).map(p => (
                                <label key={p} className="flex items-center space-x-3 space-x-reverse">
                                    <input type="checkbox" checked={permissions.includes(p)} onChange={e => handlePermissionChange(p, e.target.checked)} className="form-checkbox h-5 w-5 text-cyan-600 bg-gray-700 border-gray-500 rounded focus:ring-cyan-500" />
                                    <span className="text-gray-300">{permissionLabels[p]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">إلغاء</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const UserManagement: React.FC = () => {
    const { users, deleteUser } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedUser(undefined);
        setIsModalOpen(true);
    };
    
    const handleDelete = (userId: string) => {
        if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
            deleteUser(userId);
        }
    }

    return (
        <div className="space-y-6">
            {isModalOpen && <UserFormModal user={selectedUser} onClose={() => setIsModalOpen(false)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>
                <button onClick={handleAddNew} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">إضافة مستخدم جديد</button>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-700/50 text-gray-300">
                            <tr>
                                <th className="p-4 text-right">اسم المستخدم</th>
                                <th className="p-4 text-right">الصلاحيات</th>
                                <th className="p-4 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                    <td className="p-4 font-medium">{user.username}</td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {user.permissions.length === Object.values(Permission).length ? 'كامل الصلاحيات' : `${user.permissions.length} صلاحيات`}
                                    </td>
                                    <td className="p-4 text-center space-x-2 space-x-reverse">
                                        <button onClick={() => handleEdit(user)} className="text-yellow-400 hover:text-yellow-300">تعديل</button>
                                        {user.id !== 'admin-user' && ( // Prevent admin deletion
                                            <>
                                            <span>|</span>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-400">حذف</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
