import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Search,
    ChevronRight,
    Layout,
    Users,
    Download,
    Printer,
    Loader2,
    AlertCircle,
    Upload,
    Check,
    Calendar,
    Settings
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ReportTemplate from '../components/Reports/ReportTemplate';

const GenerateResults = () => {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [validationResults, setValidationResults] = useState([]);
    const [isValidating, setIsValidating] = useState(false);

    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [reportOptions, setReportOptions] = useState({
        passmark: 55,
        year: '2024/2025',
        term: '3',
        totalTermDays: 57,
        nextTermBegins: 'Tuesday, 9th September 2025',
        noOnRoll: 108
    });

    const [allReportData, setAllReportData] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const reportRef = React.useRef();

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: `Terminal_Reports_${selectedConfig}`,
    });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const res = await fetch(`${apiUrl}/exam-configurations`);
            const data = await res.json();
            if (data.status === 'OK') {
                setConfigs(data.configurations);
            }
        } catch (error) {
            console.error('Error fetching configs:', error);
        }
    };

    useEffect(() => {
        if (selectedConfig) {
            performValidation(selectedConfig);
        } else {
            setValidationResults([]);
        }
    }, [selectedConfig]);

    const performValidation = async (configId) => {
        setIsValidating(true);
        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const res = await fetch(`${apiUrl}/exam-config-validation/${configId}`);
            const data = await res.json();
            if (data.status === 'OK') {
                setValidationResults(data.validation);
            }
        } catch (error) {
            console.error('Validation error:', error);
        } finally {
            setIsValidating(false);
        }
    };

    const fetchReportData = async () => {
        setIsFetchingData(true);
        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const res = await fetch(`${apiUrl}/report-data/${selectedConfig}`);
            const data = await res.json();
            if (data.status === 'OK') {
                setAllReportData(data);
                setSelectedStudents(data.students.map(s => s.id));
                setIsOptionsModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setIsFetchingData(false);
        }
    };

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleAllStudents = () => {
        if (selectedStudents.length === allReportData.students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(allReportData.students.map(s => s.id));
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                        Generate Student Results
                    </h1>
                    <p className="text-slate-400 text-base mt-2">
                        Select a configuration and class to generate and print student performance reports.
                    </p>
                </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 group hover:border-blue-500/30 transition-all">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                        <Layout className="w-3 h-3 text-blue-500" />
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
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-500 transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 group hover:border-blue-500/30 transition-all">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                        <Search className="w-3 h-3 text-blue-500" />
                        Search Students
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by name or admission no..."
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl pl-11 pr-4 h-12 text-white text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Main Action Area */}
            {!selectedConfig ? (
                <div className="bg-slate-800/20 border-2 border-dashed border-slate-700/50 rounded-3xl py-32 flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-slate-700/50">
                        <FileText className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No Configuration Selected</h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                        Please select an exam configuration from the dropdown above to view students and generate results.
                    </p>
                </div>
            ) : isValidating ? (
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl py-32 flex flex-col items-center justify-center text-center px-6">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Validating Grades...</h3>
                    <p className="text-sm text-slate-400 max-w-sm font-medium">Checking for missing scores across all assigned subjects.</p>
                </div>
            ) : validationResults.length > 0 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-400 leading-tight">Missing Grades Detected</h3>
                            <p className="text-sm text-red-400/70 mt-1 font-medium italic">Reports cannot be generated until all subjects have been scored for every student.</p>
                            <button
                                onClick={() => navigate('/upload', { state: { configId: selectedConfig } })}
                                className="mt-4 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-red-500/20"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Go to Upload Data
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-700/50 bg-slate-900/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700/50">
                                    <Users className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-tight">Action Required</h2>
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{validationResults.length} Students with Incomplete Data</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Student Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Admission No</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Missing Subjects</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {filteredValidation.map((v, i) => (
                                        <tr key={v.studentId} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-white">{v.studentName}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-mono text-xs text-slate-400 bg-slate-900/50 w-fit px-2 py-1 rounded-md">{v.admissionNo}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {v.missingSubjects.map(sub => (
                                                        <span key={sub} className="px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/10">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-400 leading-tight">All Data Verified</h3>
                            <p className="text-sm text-green-400/70 mt-1 font-medium">All student scores have been successfully synchronized. Ready to generate and print final result reports.</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-12 border border-blue-500/10 text-center flex flex-col items-center gap-8 shadow-2xl">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                            <Check className="w-12 h-12" />
                        </div>
                        <div className="max-w-md">
                            <h2 className="text-3xl font-black text-white mb-4">All Grades Verified!</h2>
                            <p className="text-slate-400 font-medium">Validation complete. All students have been assigned grades for all subjects. You can now generate the final terminal reports.</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                            <button
                                onClick={fetchReportData}
                                disabled={isFetchingData}
                                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
                            >
                                {isFetchingData ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5 group-hover:bounce" />
                                )}
                                Generate PDFs
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 group">
                                <Printer className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Print All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Print Container */}
            <div style={{ display: 'none' }}>
                <div ref={reportRef} className="print:block">
                    {allReportData && allReportData.students
                        .filter(s => selectedStudents.includes(s.id))
                        .map((student, idx) => (
                            <div key={student.id} style={{ pageBreakAfter: 'always' }}>
                                <ReportTemplate
                                    student={student}
                                    school={allReportData.school}
                                    config={allReportData.config}
                                    options={reportOptions}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Options Modal */}
            {isOptionsModalOpen && allReportData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                            <div>
                                <h3 className="text-2xl font-black text-white">Report Configuration</h3>
                                <p className="text-slate-400 text-sm font-medium">Finalize details before generating PDFs</p>
                            </div>
                            <button
                                onClick={() => setIsOptionsModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                            >
                                <AlertCircle className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:grid lg:grid-cols-2 lg:gap-12">
                            {/* Form Options */}
                            <div className="space-y-6">
                                <h4 className="flex items-center gap-2 text-blue-400 font-black uppercase text-xs tracking-widest">
                                    <Settings className="w-4 h-4" />
                                    Terminal Options
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Year</label>
                                        <input
                                            type="text"
                                            value={reportOptions.year}
                                            onChange={(e) => setReportOptions({ ...reportOptions, year: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Term No.</label>
                                        <input
                                            type="number"
                                            value={reportOptions.term}
                                            onChange={(e) => setReportOptions({ ...reportOptions, term: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pass Mark</label>
                                        <input
                                            type="number"
                                            value={reportOptions.passmark}
                                            onChange={(e) => setReportOptions({ ...reportOptions, passmark: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Days</label>
                                        <input
                                            type="number"
                                            value={reportOptions.totalTermDays}
                                            onChange={(e) => setReportOptions({ ...reportOptions, totalTermDays: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all font-bold outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Next Term Starts</label>
                                        <input
                                            type="text"
                                            value={reportOptions.nextTermBegins}
                                            onChange={(e) => setReportOptions({ ...reportOptions, nextTermBegins: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Student Selection */}
                            <div className="mt-12 lg:mt-0 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="flex items-center gap-2 text-blue-400 font-black uppercase text-xs tracking-widest">
                                        <Users className="w-4 h-4" />
                                        Select Students ({selectedStudents.length})
                                    </h4>
                                    <button
                                        onClick={toggleAllStudents}
                                        className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest underline"
                                    >
                                        {selectedStudents.length === allReportData.students.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="bg-slate-800/50 rounded-2xl border border-slate-800 overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {allReportData.students.map(student => (
                                        <div
                                            key={student.id}
                                            onClick={() => toggleStudentSelection(student.id)}
                                            className={`flex items-center gap-4 px-4 py-3 border-b border-slate-900 last:border-0 cursor-pointer transition-all hover:bg-slate-800 ${selectedStudents.includes(student.id) ? 'bg-blue-600/10' : ''
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedStudents.includes(student.id)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-slate-600'
                                                }`}>
                                                {selectedStudents.includes(student.id) && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-sm font-bold transition-all ${selectedStudents.includes(student.id) ? 'text-white' : 'text-slate-400'}`}>
                                                    {student.name}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{student.admissionNo}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-800 flex justify-end gap-4 bg-slate-800/20">
                            <button
                                onClick={() => setIsOptionsModalOpen(false)}
                                className="px-8 py-3 rounded-xl text-slate-400 font-black uppercase text-xs tracking-widest hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsOptionsModalOpen(false);
                                    handlePrint();
                                }}
                                disabled={selectedStudents.length === 0}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                Generate & Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateResults;
