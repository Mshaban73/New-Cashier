
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Permission } from '../types';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CashIcon } from './icons/CashIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LogoutIcon } from './icons/LogoutIcon';

export const Sidebar: React.FC = () => {
    const { currentUser, logout, hasPermission } = useAuth();

    const navLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-gray-900 text-white";

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-l border-gray-700">
            <h2 className="text-3xl font-semibold text-white text-center">الخزينة</h2>
            <div className="flex flex-col items-center mt-6 -mx-2">
                <img className="object-cover w-24 h-24 mx-2 rounded-full" src={`https://picsum.photos/seed/${currentUser?.id}/100`} alt="avatar" />
                <h4 className="mx-2 mt-2 font-medium text-gray-300">{currentUser?.username}</h4>
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`} end>
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="mx-4 font-medium">لوحة التحكم</span>
                    </NavLink>

                    {hasPermission(Permission.ADD_TRANSACTION) && (
                         <NavLink to="/transactions" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <CashIcon className="w-5 h-5" />
                            <span className="mx-4 font-medium">المعاملات</span>
                        </NavLink>
                    )}
                    
                    {hasPermission(Permission.PERFORM_RECONCILIATION) && (
                        <NavLink to="/reconciliation" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <CalculatorIcon className="w-5 h-5" />
                            <span className="mx-4 font-medium">الجرد اليومي</span>
                        </NavLink>
                    )}

                    {hasPermission(Permission.MANAGE_USERS) && (
                        <NavLink to="/users" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <UsersIcon className="w-5 h-5" />
                            <span className="mx-4 font-medium">إدارة المستخدمين</span>
                        </NavLink>
                    )}
                </nav>

                <div>
                    <button onClick={logout} className={`${navLinkClasses} w-full`}>
                        <LogoutIcon className="w-5 h-5" />
                        <span className="mx-4 font-medium">تسجيل الخروج</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
