import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const ExamConfigEditor = () => {
    const navigate = useNavigate();
    
    // State for Assessment Weights
    const [weights, setWeights] = useState([
        { id: 1, name: 'Progressive Tests', value: 30 },
        { id: 2, name: 'Class Assignments', value: 20 },
        { id: 3, name: 'End of Term Exam', value: 50 },
    ]);

    // State for Remarks
    const [remarks, setRemarks] = useState([
        { id: 1, grade: 'A', text: 'Excellent performance. Keep it up!' },
        { id: 2, grade: 'B', text: 'Very good work, shows strong understanding.' },
    ]);

    // State for Grading Scale
    const [gradingScale, setGradingScale] = useState([
        { id: 1, min: 80, max: 100, label: 'A', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
        { id: 2, min: 70, max: 79, label: 'B', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { id: 3, min: 60, max: 69, label: 'C', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        { id: 4, min: 0, max: 59, label: 'D', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    ]);

    const totalWeight = weights.reduce((sum, w) => sum + Number(w.value), 0);

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
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
                        New Exam Configuration
                    </h1>
                    <p className="text-slate-400 text-base font-normal">
                        Configure assessment weights, grading logic, and automatic remarks for this report card type.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button 
                        onClick={() => navigate('/exam-configs')}
                        className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="flex items-center gap-2 justify-center rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors active:scale-95">
                        <Save className="w-4 h-4" />
                        Save Configuration
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Weights & Remarks */}
                <div className="lg:col-span-7 flex flex-col gap-8">
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
                                            className="w-full bg-transparent border-none text-white font-bold p-0 focus:ring-0 placeholder-slate-600 text-sm"
                                            placeholder="Component Name..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-24">
                                            <input 
                                                type="number" 
                                                value={w.value}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">%</span>
                                        </div>
                                        <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5 font-bold text-sm transition-all duration-300">
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
                                <p className="text-xs text-slate-500 mt-0.5">Define comments based on the final calculated grade.</p>
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
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] transition-all"
                                            rows="1"
                                        />
                                    </div>
                                    <button className="mt-7 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition-all px-2 py-1">
                            <Plus className="w-4 h-4" />
                            <span>Add Remark Rule</span>
                        </button>
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
                                            className="w-full bg-slate-800/50 border-none rounded-lg p-2 text-center font-mono text-sm text-white focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input 
                                            type="number" 
                                            value={s.max}
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
