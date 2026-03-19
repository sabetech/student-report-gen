import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Search,
    Plus,
    Trash2,
    ChevronRight,
    Info,
    GraduationCap,
    Layout
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SubjectManagement = () => {
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState('');
    const [subjects, setSubjects] = useState([]); // All subjects from search
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch all exam configurations
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_TARGET;
                const response = await fetch(`${apiUrl}/exam-configurations`);
                const data = await response.json();
                if (data.status === 'OK') {
                    setConfigs(data.configurations);
                }
            } catch (error) {
                console.error('Error fetching configurations:', error);
            }
        };
        fetchConfigs();
    }, []);

    // Fetch assigned subjects when configuration changes
    useEffect(() => {
        if (!selectedConfig) {
            setAssignedSubjects([]);
            return;
        }

        const fetchAssigned = async () => {
            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_TARGET;
                const response = await fetch(`${apiUrl}/exam-config-subjects/${selectedConfig}`);
                const data = await response.json();
                if (data.status === 'OK') {
                    setAssignedSubjects(data.subjects);
                }
            } catch (error) {
                console.error('Error fetching assigned subjects:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssigned();
    }, [selectedConfig]);

    // Search for subjects
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSubjects([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const apiUrl = import.meta.env.VITE_API_TARGET;
                const response = await fetch(`${apiUrl}/subjects?search=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                if (data.status === 'OK') {
                    setSubjects(data.subjects);
                }
            } catch (error) {
                console.error('Error searching subjects:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAssign = async (subject) => {
        if (!selectedConfig) return;

        // Prevent duplicate assignment in UI
        if (assignedSubjects.some(s => s.id === subject.id)) return;

        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const response = await fetch(`${apiUrl}/exam-config-subjects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configId: selectedConfig, subjectId: subject.id })
            });
            const data = await response.json();
            if (data.status === 'OK') {
                setAssignedSubjects([...assignedSubjects, subject]);
                setSearchQuery('');
                setSubjects([]);
            }
        } catch (error) {
            console.error('Error assigning subject:', error);
        }
    };

    const handleUnassign = async (subjectId) => {
        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const response = await fetch(`${apiUrl}/exam-config-subjects/${selectedConfig}/${subjectId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.status === 'OK') {
                setAssignedSubjects(assignedSubjects.filter(s => s.id !== subjectId));
            }
        } catch (error) {
            console.error('Error unassigning subject:', error);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/" className="hover:text-blue-400 font-medium transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">Subject Management</span>
            </nav>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Subject Management</h1>
                <p className="text-slate-400 mt-1">Assign and manage subjects for each exam configuration.</p>
            </div>

            {/* Assignment Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12 relative z-20">
                    <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-sm backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-6 items-end">
                            {/* Exam Config Dropdown */}
                            <div className="flex-1 w-full flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                                    <Layout className="w-3 h-3" />
                                    Exam Configuration
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedConfig}
                                        onChange={(e) => setSelectedConfig(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 h-12 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a configuration</option>
                                        {configs.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.class_name} Configuration (v{c.version})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <ChevronRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            {/* Subject Search Bar */}
                            <div className="flex-[1.5] w-full flex flex-col gap-2 relative">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                                    <Search className="w-3 h-3" />
                                    Search & Assign Subjects
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Type subject name or code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={!selectedConfig}
                                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-11 pr-4 h-12 text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />

                                    {/* Search Results Dropdown */}
                                    {searchQuery.trim() && subjects.length > 0 && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                                            {subjects.map(subject => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => handleAssign(subject)}
                                                    className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-none group/item"
                                                >
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-sm font-bold text-white group-hover/item:text-blue-400 transition-colors">{subject.name}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{subject.code} • {subject.type}</span>
                                                    </div>
                                                    <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 opacity-0 group-hover/item:opacity-100 transition-all">
                                                        <Plus className="w-4 h-4" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {searchQuery.trim() && subjects.length === 0 && !isSearching && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl p-4 text-center z-50">
                                            <p className="text-slate-500 text-xs italic">No subjects found for "{searchQuery}"</p>
                                        </div>
                                    )}

                                    {isSearching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Subjects Table */}
                <div className="lg:col-span-12 relative z-10">
                    <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-sm overflow-hidden backdrop-blur-sm min-h-[400px]">
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/10">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Assigned Subjects</h2>
                            </div>
                            <span className="px-3 py-1 bg-slate-700/50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300">
                                {assignedSubjects.length} Total
                            </span>
                        </div>

                        {selectedConfig ? (
                            assignedSubjects.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-900/40 border-b border-slate-700/50">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Name</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Code</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Type</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {assignedSubjects.map((subject) => (
                                                <tr key={subject.id} className="hover:bg-slate-700/20 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 transition-all">
                                                                <BookOpen className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-200">{subject.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-slate-800 rounded font-mono text-xs text-slate-400 border border-slate-700/50 uppercase tracking-tighter">
                                                            {subject.code}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs text-slate-400 flex items-center gap-1.5 capitalize">
                                                            <Info className="w-3 h-3 text-slate-600" />
                                                            {subject.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleUnassign(subject.id)}
                                                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="Unassign Subject"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                    <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
                                        <Info className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">No subjects assigned</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">
                                        Search for subjects in the search bar above to assign them to this configuration.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="w-20 h-20 bg-blue-500/5 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/10 animate-pulse">
                                    <GraduationCap className="w-10 h-10 text-blue-500/30" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">Get Started</h3>
                                <p className="text-slate-600 text-sm max-w-sm font-medium">
                                    Please select an exam configuration from the dropdown above to manage its subjects.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
