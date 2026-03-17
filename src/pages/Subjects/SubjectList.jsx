import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, FileText, Bell, User, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subjectService';

const SubjectList = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConfig, setSelectedConfig] = useState('Fall 2023 Midterms');

    // Mock subjects with rich data matching the design
    const mockSubjects = [
        { id: '1', code: 'MATH101', name: 'Calculus 1', department: 'Mathematics', credits: 4.0, status: 'Assigned', statusColor: 'text-green-400' },
        { id: '2', code: 'CS202', name: 'Data Structures', department: 'Computer Science', credits: 3.5, status: 'Assigned', statusColor: 'text-green-400' },
        { id: '3', code: 'ENG105', name: 'Creative Writing', department: 'English', credits: 2.0, status: 'Unassigned', statusColor: 'text-slate-400' },
        { id: '4', code: 'PHY501', name: 'Advanced Physics', department: 'Science', credits: 4.0, status: 'Assigned', statusColor: 'text-green-400' },
        { id: '5', code: 'HIS200', name: 'World History', department: 'Humanities', credits: 3.0, status: 'Unassigned', statusColor: 'text-slate-400' }
    ];

    const [selectedSubjects, setSelectedSubjects] = useState(['2']); // CS202 pre-selected

    useEffect(() => {
        const savedSubjects = subjectService.getAll();
        if (savedSubjects.length > 0) {
            setSubjects(savedSubjects.map((s, idx) => ({
                ...s,
                code: s.code || `SUB${idx + 1}`,
                department: 'General',
                credits: 3.0,
                status: 'Unassigned',
                statusColor: 'text-slate-400'
            })));
        } else {
            setSubjects(mockSubjects);
        }
    }, []);

    const toggleSubjectSelection = (id) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-blue-600 rounded">
                            <FileText className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white font-semibold">Student Report Gen</span>
                    </div>
                    <p className="text-xs text-slate-500">Admin Portal</p>
                </div>

                <nav className="flex-1 px-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mb-1"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Dashboard</span>
                    </button>
                    <button
                        onClick={() => navigate('/upload')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mb-1"
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Exam Reports</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-blue-400 bg-slate-800 rounded-md transition-colors mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Subject Management</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Students</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            AU
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-500 truncate">admin@examgen.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
                                Home
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
                                Configuration
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-blue-400 font-medium">Subject Management</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Title Section */}
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Subject Management</h1>
                                <p className="text-slate-400 text-sm">
                                    Manage academic subjects, edit details, and assign them to exam report configurations.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    const name = prompt('Subject Name:');
                                    const code = prompt('Subject Code:');
                                    if (name) {
                                        subjectService.create({ name, code });
                                        window.location.reload();
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg shadow-blue-600/20 transition-colors flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                New Subject
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1">
                                <label className="block text-xs text-slate-400 uppercase font-medium mb-2">Active Configuration</label>
                                <select
                                    value={selectedConfig}
                                    onChange={(e) => setSelectedConfig(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>Fall 2023 Midterms</option>
                                    <option>Spring 2024 Finals</option>
                                    <option>Summer 2024 Quiz</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-xs text-slate-400 uppercase font-medium mb-2">Find Subject</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name, code, or department..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="px-4 py-3 text-left">
                                            <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Subject Code</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Subject Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Department</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Credits</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject, index) => (
                                        <tr
                                            key={subject.id}
                                            className={`border-b border-slate-700/50 hover:bg-slate-750 transition-colors ${index % 2 === 0 ? 'bg-slate-800' : 'bg-slate-850'}`}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(subject.id)}
                                                    onChange={() => toggleSubjectSelection(subject.id)}
                                                    className="rounded border-slate-600 bg-slate-700"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-300 font-mono text-sm">{subject.code}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-white font-medium">{subject.name}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-400 text-sm">{subject.department}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-slate-400 text-sm">{subject.credits}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`flex items-center gap-1.5 text-sm ${subject.statusColor}`}>
                                                    {subject.status === 'Assigned' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
                                                    {subject.status === 'Unassigned' && <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>}
                                                    {subject.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button className="text-slate-400 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between text-sm">
                            <p className="text-slate-400">
                                Showing <span className="font-medium text-white">1 to 5</span> of <span className="font-medium text-white">42</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectList;
