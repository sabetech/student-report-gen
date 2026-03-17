import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Upload, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../contexts/ThemeContext';

const MainLayout = () => {
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Configs', path: '/configs', icon: Settings },
        { name: 'Subjects', path: '/subjects', icon: FileText },
        { name: 'Upload', path: '/upload', icon: Upload },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Report Gen</h1>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-amber-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-600" />
                        )}
                    </button>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-r-2 border-indigo-600 dark:border-indigo-400'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
