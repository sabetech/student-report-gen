import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    Save,
    X,
    PieChart,
    Plus,
    Trash2,
    CheckCircle,
    MessageSquare,
    FunctionSquare,
    ArrowRight,
    ChevronRight,
    GraduationCap
} from 'lucide-react';

const ExamConfigEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus({ type: '', message: '' });

        const payload = {
            id: id, // if defined, it's an update to the specific version
            class_id: selectedClass,
            weights: weights.map(w => ({ name: w.name, value: w.value })),
            remarks: remarks.map(r => ({ grade: r.grade, text: r.text })),
            gradingScale: gradingScale.map(s => ({ label: s.label, min: s.min, max: s.max }))
        };

        try {
            const apiUrl = import.meta.env.VITE_API_TARGET;
            const response = await fetch(`${apiUrl}/exam-configurations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.status === 'OK') {
                setSaveStatus({ type: 'success', message: 'Configuration saved successfully!' });
                setTimeout(() => navigate('/exam-configs'), 2000);
            } else {
                setSaveStatus({ type: 'error', message: data.message || 'Failed to save configuration' });
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            setSaveStatus({ type: 'error', message: 'A network error occurred while saving.' });
        } finally {
            setIsSaving(false);
        }
    };

    // State for Assessment Weights
    const [weights, setWeights] = useState([
        { id: 1, name: 'Progressive Tests', value: 30 },
        { id: 2, name: 'Class Assignments', value: 20 },
        { id: 3, name: 'End of Term Exam', value: 50 },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_TARGET;

                // Fetch classes
                const classesRes = await fetch(`${apiUrl}/classes`);
                const classesData = await classesRes.json();
                if (classesData.status === 'OK') {
                    setClasses(classesData.classes);
                }

                // If in edit mode, fetch config details
                if (id) {
                    const configRes = await fetch(`${apiUrl}/exam-configurations/${id}`);
                    const configData = await configRes.json();
                    if (configData.status === 'OK') {
                        const config = configData.configuration;
                        setSelectedClass(config.class_id);

                        // Map weights
                        if (config.assessment_weights?.length > 0) {
                            setWeights(config.assessment_weights.map((w, idx) => ({
                                id: idx + 1,
                                name: w.name,
                                value: w.value
                            })));
                        }

                        // Map remarks
                        if (config.grade_remarks?.length > 0) {
                            setRemarks(config.grade_remarks.map((r, idx) => ({
                                id: idx + 1,
                                grade: r.grade,
                                text: r.text
                            })));
                        }

                        // Map scale
                        if (config.grading_scales?.length > 0) {
                            setGradingScale(config.grading_scales.map((s, idx) => ({
                                id: idx + 1,
                                label: s.label,
                                min: s.min,
                                max: s.max
                            })));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // State for Remarks (Fixed to 9 numerical grades: 1-9)
    const [remarks, setRemarks] = useState(
        Array.from({ length: 9 }, (_, i) => ({
            id: i + 1,
            grade: i + 1,
            text: ''
        }))
    );

    const updateRemark = (id, text) => {
        setRemarks(remarks.map(r => r.id === id ? { ...r, text } : r));
    };

    // State for Grading Scale (Updated for 1-9 system)
    const [gradingScale, setGradingScale] = useState([
        { id: 1, min: 90, max: 100, label: '1', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
        { id: 2, min: 80, max: 89, label: '2', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { id: 3, min: 70, max: 79, label: '3', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        { id: 4, min: 60, max: 69, label: '4', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        { id: 5, min: 55, max: 59, label: '5', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { id: 6, min: 50, max: 54, label: '6', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
        { id: 7, min: 45, max: 49, label: '7', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
        { id: 8, min: 40, max: 44, label: '8', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { id: 9, min: 0, max: 39, label: '9', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    ]);

    const updateGradingScale = (id, field, value) => {
        setGradingScale(gradingScale.map(s =>
            s.id === id ? { ...s, [field]: Number(value) } : s
        ));
    };

    const totalWeight = weights.reduce((sum, w) => sum + Number(w.value), 0);

    const updateWeight = (id, field, value) => {
        setWeights(weights.map(w =>
            w.id === id ? { ...w, [field]: field === 'value' ? Math.max(0, Number(value)) : value } : w
        ));
    };

    const addWeight = () => {
        const newId = weights.length > 0 ? Math.max(...weights.map(w => w.id)) + 1 : 1;
        setWeights([...weights, { id: newId, name: 'New Component', value: 0 }]);
    };

    const removeWeight = (id) => {
        if (weights.length > 1) {
            setWeights(weights.filter(w => w.id !== id));
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto relative">
            {isLoading && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                    <p className="text-white font-bold">Loading Configuration...</p>
                </div>
            )}
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
                <Link to="/" className="text-slate-500 hover:text-blue-400 transition-colors font-medium">Home</Link>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <Link to="/exam-configs" className="text-slate-500 hover:text-blue-400 transition-colors font-medium">Configurations</Link>
                <ChevronRight className="w-4 h-4 text-slate-600" />
                <span className="text-white font-medium">New Configuration</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        {id ? 'Edit Exam Configuration' : 'New Exam Configuration'}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {id ? 'Update your assessment weights and grading logic.' : 'Configure assessment weights, grading logic, and automatic remarks.'}
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => navigate('/exam-configs')}
                        className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || totalWeight !== 100 || !selectedClass || remarks.some(r => !r.text.trim())}
                        className={`flex items-center gap-2 justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            {/* Status Message */}
            {saveStatus.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${saveStatus.type === 'success'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {saveStatus.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <X className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm font-bold">{saveStatus.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Weights & Remarks */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    {/* Class Selection Section */}
                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-green-500/10 rounded-xl text-green-500 border border-green-500/10">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Target Class</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Select the class this exam configuration applies to.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50"
                            >
                                <option value="" disabled>{isLoading ? 'Loading classes...' : 'Select a class'}</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.class}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </div>
                        </div>
                    </section>

                    {/* Assessment Weights Section */}
                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-600/10">
                                    <PieChart className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Assessment Weights</h2>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total:</span>
                                <span className={`font-black text-lg ${totalWeight === 100 ? 'text-green-500' : 'text-red-500'}`}>
                                    {totalWeight}%
                                </span>
                                {totalWeight === 100 && <CheckCircle className="w-5 h-5 text-green-500" />}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-900 rounded-full h-2.5 mb-8 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${totalWeight === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                style={{ width: `${Math.min(totalWeight, 100)}%` }}
                            ></div>
                        </div>

                        <div className="space-y-4">
                            {weights.map((w) => (
                                <div key={w.id} className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={w.name}
                                            onChange={(e) => updateWeight(w.id, 'name', e.target.value)}
                                            className="w-full bg-transparent border-none text-white font-bold p-0 focus:ring-0 placeholder-slate-600 text-sm"
                                            placeholder="Component Name..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-24">
                                            <input
                                                type="number"
                                                value={w.value}
                                                onChange={(e) => updateWeight(w.id, 'value', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-right font-mono text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">%</span>
                                        </div>
                                        <button
                                            onClick={() => removeWeight(w.id)}
                                            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addWeight}
                            className="mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 font-bold text-sm transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Assessment Component</span>
                        </button>
                    </section>

                    {/* Remarks Configuration Section */}
                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/10">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Remarks Configuration</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Define comments for each grade from 1 (Best) to 9 (Worst).</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {remarks.map((r) => (
                                <div key={r.id} className="flex gap-6 items-start p-5 rounded-2xl bg-slate-900/50 border border-slate-800 transition-all hover:border-blue-500/20">
                                    <div className="flex flex-col gap-1.5 w-20 shrink-0">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Grade</label>
                                        <div className="h-10 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 font-black text-xl text-white">
                                            {r.grade}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Remark Text</label>
                                        <textarea
                                            value={r.text}
                                            onChange={(e) => updateRemark(r.id, e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] transition-all"
                                            rows="1"
                                            placeholder={`Enter remark for Grade ${r.grade}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Grading Scale */}
                <div className="lg:col-span-5">
                    <section className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50 shadow-sm h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/10">
                                    <FunctionSquare className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Grading Scale</h2>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600 px-3 py-1.5 rounded-full border border-blue-600/20 transition-all">
                                Auto-Fill Standard
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-3 px-3 pb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <div className="col-span-3">Min</div>
                                <div className="col-span-3">Max</div>
                                <div className="col-span-4 pl-4">Label</div>
                                <div className="col-span-2"></div>
                            </div>

                            {gradingScale.map((s) => (
                                <div key={s.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-slate-900/30 border border-transparent hover:border-slate-700/50 group transition-all duration-300">
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            value={s.min}
                                            onChange={(e) => updateGradingScale(s.id, 'min', e.target.value)}
                                            className="w-full bg-slate-800/50 border-none rounded-lg p-2 text-center font-mono text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            value={s.max}
                                            onChange={(e) => updateGradingScale(s.id, 'max', e.target.value)}
                                            className="w-full bg-slate-800/50 border-none rounded-lg p-2 text-center font-mono text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-4 pl-3">
                                        <div className="flex items-center gap-3">
                                            <ArrowRight className="w-4 h-4 text-slate-600" />
                                            <input
                                                type="text"
                                                value={s.label}
                                                className={`w-full ${s.color} border border-white/5 rounded-lg p-2 text-center font-black text-sm focus:ring-1 focus:ring-white/20`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                            <span>Add Range</span>
                        </button>

                        {/* Distribution Preview */}
                        <div className="mt-auto pt-8 border-t border-slate-800/50">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">Distribution Preview</h4>
                            <div className="flex w-full h-5 rounded-full overflow-hidden bg-slate-900 ring-1 ring-white/5">
                                <div className="bg-red-500/60 h-full border-r border-white/5" style={{ width: '59%' }}></div>
                                <div className="bg-yellow-500/60 h-full border-r border-white/5" style={{ width: '10%' }}></div>
                                <div className="bg-blue-500/60 h-full border-r border-white/5" style={{ width: '10%' }}></div>
                                <div className="bg-green-500/60 h-full" style={{ width: '21%' }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-600 mt-2 font-mono font-bold px-1">
                                <span>0</span>
                                <span className="translate-x-4">50</span>
                                <span>100</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <footer className="mt-12 py-8 border-t border-slate-800 text-center text-xs text-slate-600 font-medium">
                © 2024 Exam Reporter. All rights reserved.
            </footer>
        </div>
    );
};

export default ExamConfigEditor;
