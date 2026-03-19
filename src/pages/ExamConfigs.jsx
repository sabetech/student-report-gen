import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    ChevronDown,
    Table,
    FunctionSquare,
    History,
    Languages,
    Globe,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const ExamConfigs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [configs, setConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfigs = async () => {
            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_TARGET;
                const response = await fetch(`${apiUrl}/exam-configurations`);
                const data = await response.json();
                if (data.status === 'OK') {
                    // Enrich data with UI-only properties (icons, placeholder images)
                    const enriched = data.configurations.map(c => ({
                        ...c,
                        name: `${c.class_name} Exam Configuration`,
                        dept: 'Academic Dept',
                        description: `Report card configuration specifically tailored for ${c.class_name}.`,
                        status: 'Active',
                        statusColor: 'bg-green-500/20 text-green-400 ring-green-600/20',
                        modified: new Date(c.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        version: `v${c.version}.0`,
                        icon: Table,
                        image: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400&h=200&sig=${c.id}`
                    }));
                    setConfigs(enriched);
                }
            } catch (error) {
                console.error('Error fetching configurations:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfigs();
    }, []);

    const filteredConfigs = configs.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full h-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-dashed border-slate-700 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                        Exam Report Configurations
                    </h1>
                    <p className="text-slate-400 text-base mt-2">
                        Manage your Excel-to-Report templates and schedules.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/exam-configs/new')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Configuration</span>
                </button>
            </div>

            {/* Filters and Search Row */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start lg:items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Search configurations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium">Filter by:</span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-slate-300 text-sm font-medium transition-all group">
                        <span>All Status</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-slate-300 text-sm font-medium transition-all group">
                        <span>Recent</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-medium animate-pulse">Loading configurations...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredConfigs.map((config) => (
                        <div
                            key={config.id}
                            className="group flex flex-col bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Image Header */}
                            <div className="h-44 w-full relative overflow-hidden">
                                <img
                                    src={config.image}
                                    alt={config.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute top-4 right-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.statusColor} ring-1 backdrop-blur-md`}>
                                        {config.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <config.icon className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{config.dept}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                    {config.name}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {config.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between py-4 border-t border-slate-700/50 text-[11px] font-medium text-slate-500 italic">
                                    <span>Modified: {config.modified}</span>
                                    <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{config.version}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/exam-configs/edit/${config.id}`)}
                                        className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                    </button>
                                    <button
                                        onClick={() => navigate(`/exam-configs/edit/${config.id}`)}
                                        className="p-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-all active:scale-90" title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition-all active:scale-90" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <button
                        onClick={() => navigate('/exam-configs/new')}
                        className="group flex flex-col items-center justify-center bg-slate-800/20 border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl transition-all duration-300 p-8 min-h-[400px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 group-hover:scale-110 transition-all">
                            <Plus className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Create New</h3>
                        <p className="text-slate-500 text-sm text-center max-w-[200px]">
                            Start a new configuration from scratch or import a template.
                        </p>
                    </button>
                </div>
            )}

            {/* Pagination Placeholder */}
            <div className="flex flex-col sm:flex-row items-center justify-between py-8 mt-12 border-t border-slate-700/50 gap-4">
                <p className="text-slate-500 text-sm">
                    Showing <span className="font-bold text-white italic">1-{filteredConfigs.length}</span> of <span className="font-bold text-white italic">{filteredConfigs.length}</span> configurations
                </p>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50" disabled>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-600/20">1</button>
                    <button className="w-10 h-10 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-lg font-bold text-sm transition-all">2</button>
                    <button className="w-10 h-10 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-lg font-bold text-sm transition-all">3</button>
                    <span className="px-2 text-slate-600">...</span>
                    <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamConfigs;
