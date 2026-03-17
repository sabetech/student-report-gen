import React, { useEffect, useState } from 'react';
import { Plus, Edit, FileText, Search, Trash2, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { configService } from '../services/configService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterRecent, setFilterRecent] = useState('Recent');

    // Mock configurations with rich data
    const mockConfigs = [
        {
            id: '1',
            name: 'Final Term - Science 2023',
            description: 'Template configured for Physics, Chemistry and Biology aggregates.',
            department: 'SCIENCE DEPT',
            status: 'Active',
            statusColor: 'bg-green-500',
            image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            imageType: 'gradient',
            updatedAt: 'Oct 24, 2023',
            version: 'v2.4'
        },
        {
            id: '2',
            name: 'Math Midterms - Fall',
            description: 'Standard calculation template for Calculus and Algebra sections.',
            department: 'MATH DEPT',
            status: 'Active',
            statusColor: 'bg-green-500',
            image: 'repeating-linear-gradient(45deg, #8B4513, #8B4513 10px, #A0522D 10px, #A0522D 20px)',
            imageType: 'pattern',
            updatedAt: 'Nov 02, 2023',
            version: 'v1.1'
        },
        {
            id: '3',
            name: 'History Pop Quiz Layout',
            description: 'Work in progress. Pending approval from the department head.',
            department: 'HISTORY DEPT',
            status: 'Draft',
            statusColor: 'bg-yellow-500',
            image: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            imageType: 'gradient',
            updatedAt: 'Yesterday',
            version: 'v0.1'
        },
        {
            id: '4',
            name: 'English 2022 - Legacy',
            description: 'Previous year\'s configuration. Read-only access.',
            department: 'ENGLISH DEPT',
            status: 'Archived',
            statusColor: 'bg-slate-500',
            image: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2U1ZTdlYiIvPjxwYXRoIGQ9Ik0yMCA0MGw0MCAyMEw5MCA0MGw0MCAyMEwxNjAgNDBsNDAgMjBNMjAgODBsNDAgMjBMOTAgODBsNDAgMjBMMTYwIDgwbDQwIDIwIiBzdHJva2U9IiNhYWEiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==)',
            imageType: 'map',
            updatedAt: 'Dec 12, 2022',
            version: 'v3.2'
        },
        {
            id: '5',
            name: 'Regional Mapping Test',
            description: 'Configuration for coordinate-based questions and answers.',
            department: 'GEOGRAPHY',
            status: 'Active',
            statusColor: 'bg-green-500',
            image: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
            imageType: 'gradient',
            updatedAt: 'Aug 15, 2023',
            version: 'v1.0'
        }
    ];

    useEffect(() => {
        // Load saved configs or use mock data
        const savedConfigs = configService.getAll();
        if (savedConfigs.length > 0) {
            setConfigs(savedConfigs);
        } else {
            setConfigs(mockConfigs);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-600 rounded">
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-semibold text-lg">Exam Reporter</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <button className="text-white font-medium text-sm px-1 pb-1 border-b-2 border-blue-500">
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/upload')}
                                className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
                            >
                                Reports
                            </button>
                            <button
                                onClick={() => navigate('/subjects')}
                                className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
                            >
                                Settings
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-slate-400 hover:text-white font-medium text-sm transition-colors"
                            >
                                Logout
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Exam Report Configurations</h1>
                        <p className="text-slate-400 text-sm">Manage your ExcelTo-Report templates and schedules.</p>
                    </div>
                    <button
                        onClick={() => navigate('/configs/new')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg shadow-blue-600/20 transition-colors flex items-center gap-2 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Configuration
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search configurations..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">Filter by:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </select>

                        <select
                            value={filterRecent}
                            onChange={(e) => setFilterRecent(e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Recent</option>
                            <option>Oldest</option>
                            <option>A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {configs.map((config) => (
                        <div
                            key={config.id}
                            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-all cursor-pointer group"
                        >
                            {/* Card Image/Gradient */}
                            <div
                                className="h-32 relative"
                                style={{ background: config.image || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                <span className={`absolute top-3 right-3 px-2 py-1 ${config.statusColor || 'bg-green-500'} text-white text-xs font-medium rounded`}>
                                    {config.status || 'Active'}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-medium text-slate-500 uppercase">{config.department || 'GENERAL'}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {config.name}
                                </h3>

                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                    {config.description || 'No description provided.'}
                                </p>

                                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                    <span>Modified: {config.updatedAt}</span>
                                    <span>{config.version || 'v1.0'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/configs/${config.id}`);
                                        }}
                                        className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/configs/${config.id}`);
                                        }}
                                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button
                        onClick={() => navigate('/configs/new')}
                        className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg p-5 hover:border-blue-500 hover:bg-slate-750 transition-all flex flex-col items-center justify-center min-h-[300px] group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-700 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            Create New
                        </h3>
                        <p className="text-sm text-slate-400 text-center">
                            Start a new configuration from scratch or import a template.
                        </p>
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        Showing <span className="font-medium text-white">1-5</span> of <span className="font-medium text-white">42</span> configurations
                    </p>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors">
                            ‹
                        </button>
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded font-medium">
                            1
                        </button>
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
                            2
                        </button>
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
                            3
                        </button>
                        <span className="px-2 text-slate-500">...</span>
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors">
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
