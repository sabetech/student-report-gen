import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Upload, LogOut, FileText, Settings as SettingsIcon } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Exam Configurations', path: '/exam-configs', icon: LayoutDashboard },
        { name: 'Subject Management', path: '/subjects', icon: BookOpen },
        { name: 'Upload student data', path: '/upload', icon: Upload },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <aside className="w-64 h-screen bg-slate-800 border-r border-slate-700 flex flex-col fixed left-0 top-0 z-50 transition-all">
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                <div className="p-1.5 bg-blue-600 rounded">
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">Report Gen</span>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                isActive
                                    ? 'bg-blue-600/10 text-blue-400 font-medium border border-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Section (Logout) */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
