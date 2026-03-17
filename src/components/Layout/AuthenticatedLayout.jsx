import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';

const AuthenticatedLayout = () => {
    // Basic auth check
    const user = localStorage.getItem('user');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex bg-slate-900 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AuthenticatedLayout;
