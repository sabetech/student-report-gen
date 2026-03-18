import React, { useState, useEffect, useMemo } from 'react';
import { 
    Upload, 
    Search, 
    ChevronRight, 
    CheckCircle, 
    AlertCircle, 
    Save, 
    Users, 
    BookOpen, 
    TrendingUp,
    FileSpreadsheet,
    ArrowUpDown
} from 'lucide-react';

const UploadData = () => {
    const [configs, setConfigs] = useState([]);
    const [selectedConfigId, setSelectedConfigId] = useState('');
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [students, setStudents] = useState([]);
    const [existingScores, setExistingScores] = useState({}); // { studentId_weightId: score }
    const [localScores, setLocalScores] = useState({}); // { studentId_weightId: score }
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const selectedConfig = useMemo(() => 
        configs.find(c => c.id === parseInt(selectedConfigId)), 
    [configs, selectedConfigId]);

    // Fetch initial configs
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const res = await fetch(`${apiUrl}/exam-configurations`);
                const data = await res.json();
                if (data.status === 'OK') setConfigs(data.configurations);
            } catch (error) {
                console.error('Error fetching configs:', error);
            }
        };
        fetchConfigs();
    }, []);

    // When config changes, fetch subjects and students
    useEffect(() => {
        if (!selectedConfigId) {
            setAssignedSubjects([]);
            setStudents([]);
            setSelectedSubjectId('');
            return;
        }

        const fetchConfigDetails = async () => {
            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                
                // Fetch subjects
                const subjectsRes = await fetch(`${apiUrl}/exam-config-subjects/${selectedConfigId}`);
                const subjectsData = await subjectsRes.json();
                if (subjectsData.status === 'OK') setAssignedSubjects(subjectsData.subjects);

                // Fetch full config for weights/scales/remarks
                const fullConfigRes = await fetch(`${apiUrl}/exam-configurations/${selectedConfigId}`);
                const fullConfigData = await fullConfigRes.json();
                if (fullConfigData.status === 'OK') {
                    // We'll use this for calculations
                    setSelectedConfigData(fullConfigData.configuration);
                }

                // Fetch students for the class
                const studentsRes = await fetch(`${apiUrl}/class-students/${selectedConfig.class_id}`);
                const studentsData = await studentsRes.json();
                if (studentsData.status === 'OK') setStudents(studentsData.students);

            } catch (error) {
                console.error('Error fetching config details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfigDetails();
    }, [selectedConfigId, selectedConfig]);

    const [selectedConfigData, setSelectedConfigData] = useState(null);

    // When subject changes, fetch existing scores
    useEffect(() => {
        if (!selectedConfigId || !selectedSubjectId) {
            setExistingScores({});
            setLocalScores({});
            return;
        }

        const fetchScores = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const res = await fetch(`${apiUrl}/student-subject-scores/${selectedConfigId}/${selectedSubjectId}`);
                const data = await res.json();
                if (data.status === 'OK') {
                    const scoreMap = {};
                    data.scores.forEach(s => {
                        scoreMap[`${s.student_id}_${s.weight_id}`] = s.score;
                    });
                    setExistingScores(scoreMap);
                    setLocalScores(scoreMap);
                }
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };
        fetchScores();
    }, [selectedSubjectId, selectedConfigId]);

    const handleScoreChange = (studentId, weightId, value) => {
        setLocalScores(prev => ({
            ...prev,
            [`${studentId}_${weightId}`]: value === '' ? '' : Math.max(0, parseFloat(value) || 0)
        }));
    };

    // Calculation Engine
    const studentStats = useMemo(() => {
        if (!selectedConfigData || students.length === 0) return [];

        const weights = selectedConfigData.assessment_weights || [];
        const scales = selectedConfigData.grading_scales || [];
        const remarks = selectedConfigData.grade_remarks || [];

        const stats = students.map(student => {
            let sumRaw = 0;
            weights.forEach(w => {
                sumRaw += parseFloat(localScores[`${student.id}_${w.id}`] || 0);
            });

            const gradeObj = scales.find(s => sumRaw >= s.min && sumRaw <= s.max);
            const grade = gradeObj ? gradeObj.label : '-';
            
            const remarkObj = remarks.find(r => r.grade === grade);
            const remark = remarkObj ? remarkObj.text : '-';

            return {
                ...student,
                total: sumRaw,
                grade,
                remark
            };
        });

        // Calculate Rank
        const sorted = [...stats].sort((a, b) => b.total - a.total);
        return stats.map(s => ({
            ...s,
            rank: sorted.findIndex(item => item.total === s.total) + 1
        }));
    }, [students, localScores, selectedConfigData]);

    // Calculate if any scores are invalid
    const hasInvalidScores = useMemo(() => {
        if (!selectedConfigData) return false;
        return Object.entries(localScores).some(([key, value]) => {
            const [studentId, weightId] = key.split('_');
            const weight = selectedConfigData.assessment_weights.find(w => w.id === parseInt(weightId));
            return weight && value !== '' && parseFloat(value) > weight.value;
        });
    }, [localScores, selectedConfigData]);

    const handleSave = async () => {
        if (!selectedConfigId || !selectedSubjectId || hasInvalidScores) return;
        setIsSaving(true);
        setStatus({ type: '', message: '' });

        const scoresToSave = [];
        students.forEach(student => {
            selectedConfigData.assessment_weights.forEach(w => {
                const score = localScores[`${student.id}_${w.id}`];
                if (score !== undefined && score !== '') {
                    scoresToSave.push({
                        student_id: student.id,
                        config_id: selectedConfigId,
                        subject_id: selectedSubjectId,
                        weight_id: w.id,
                        score: score
                    });
                }
            });
        });

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/student-subject-scores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scores: scoresToSave })
            });

            const data = await res.json();
            if (data.status === 'OK') {
                setStatus({ type: 'success', message: 'Data saved successfully!' });
                setExistingScores(localScores);
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to save data' });
            }
        } catch (error) {
            console.error('Error saving:', error);
            setStatus({ type: 'error', message: 'A network error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!selectedConfigData || students.length === 0) return;

        const weights = selectedConfigData.assessment_weights || [];
        const headers = ['Admission No', 'Student Name', ...weights.map(w => `${w.name} (${w.value}%)`)];
        
        const rows = students.map(student => {
            const studentScores = weights.map(w => localScores[`${student.id}_${w.id}`] || '');
            return [student.admission_no, student.fullname, ...studentScores];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${selectedConfig.class_name}_${assignedSubjects.find(s => s.id === parseInt(selectedSubjectId))?.name || 'Template'}_Scores.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',');
            const dataRows = lines.slice(1);

            const weights = selectedConfigData.assessment_weights || [];
            const newScores = { ...localScores };

            dataRows.forEach(rowLine => {
                const columns = rowLine.split(',');
                const admissionNo = columns[0];
                const student = students.find(s => s.admission_no === admissionNo);
                
                if (student) {
                    weights.forEach((w, index) => {
                        const scoreValue = columns[index + 2]; // Offset by 2 (Admission No, Name)
                        if (scoreValue !== undefined && scoreValue !== '') {
                            newScores[`${student.id}_${w.id}`] = Math.max(0, parseFloat(scoreValue) || 0);
                        }
                    });
                }
            });

            setLocalScores(newScores);
            setStatus({ type: 'success', message: 'CSV data imported successfully!' });
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Upload className="w-8 h-8 text-blue-500" />
                        Data Entry Terminal
                    </h1>
                    <p className="text-slate-400">Record assessment results and generate real-time performance analytics.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={handleDownloadCSV}
                        disabled={!selectedSubjectId || students.length === 0}
                        className="flex items-center gap-2 px-4 h-11 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-bold rounded-xl transition-all border border-slate-700"
                    >
                        <ChevronRight className="w-4 h-4 rotate-90" />
                        Download Template
                    </button>

                    <label className={`flex items-center gap-2 px-4 h-11 bg-slate-800 hover:bg-slate-700 cursor-pointer text-slate-300 font-bold rounded-xl transition-all border border-slate-700 ${(!selectedSubjectId || students.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-4 h-4" />
                        Upload CSV
                        <input 
                            type="file" 
                            accept=".csv" 
                            className="hidden" 
                            onChange={handleFileUpload}
                            disabled={!selectedSubjectId || students.length === 0}
                        />
                    </label>

                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !selectedSubjectId || students.length === 0 || hasInvalidScores}
                        className="flex items-center gap-2 px-6 h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Sync Changes
                    </button>
                </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Exam Configuration */}
                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        <FileSpreadsheet className="w-4 h-4" />
                        1. Exam Configuration
                    </label>
                    <select
                        value={selectedConfigId}
                        onChange={(e) => setSelectedConfigId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                        <option value="">Select Configuration</option>
                        {configs.map(c => (
                            <option key={c.id} value={c.id}>{c.class_name} Configuration</option>
                        ))}
                    </select>
                </div>

                {/* 2. Target Class (Auto-filled) */}
                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        <Users className="w-4 h-4" />
                        2. Linked Class
                    </label>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-medium">
                        {selectedConfig ? selectedConfig.class_name : 'No selection'}
                    </div>
                </div>

                {/* 3. Subject Assigned */}
                <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        <BookOpen className="w-4 h-4" />
                        3. Subject Module
                    </label>
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        disabled={!selectedConfigId}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Select Subject</option>
                        {assignedSubjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Status Feedback */}
            {status.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-2 duration-300 ${
                    status.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold">{status.message}</span>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold animate-pulse">Syncing student roster...</p>
                    </div>
                ) : !selectedSubjectId ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <Search className="w-16 h-16 text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Awaiting Selection</h3>
                        <p className="text-slate-600 max-w-sm">Please select a configuration and subject to begin data entry.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[250px]">Student Name</th>
                                    {(selectedConfigData?.assessment_weights || []).map(w => (
                                        <th key={w.id} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center min-w-[120px]">
                                            {w.name}
                                            <div className="text-blue-500/70 lowercase font-medium mt-0.5">({w.value}%)</div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Total</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Grade</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Remark</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Rank</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {studentStats.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-700/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                                    {student.fullname}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium font-mono lowercase">
                                                    ID: {student.admission_no}
                                                </span>
                                            </div>
                                        </td>
                                        {(selectedConfigData?.assessment_weights || []).map(w => {
                                            const score = localScores[`${student.id}_${w.id}`];
                                            const isInvalid = score !== undefined && score !== '' && parseFloat(score) > w.value;
                                            return (
                                                <td key={w.id} className="px-6 py-4 text-center">
                                                    <div className="relative group/input">
                                                        <input 
                                                            type="number"
                                                            value={score ?? ''}
                                                            onChange={(e) => handleScoreChange(student.id, w.id, e.target.value)}
                                                            placeholder="0"
                                                            className={`w-20 bg-slate-900/50 border rounded-lg px-3 py-2 text-center text-sm font-bold outline-none transition-all placeholder:text-slate-700 ${
                                                                isInvalid 
                                                                    ? 'border-red-500 bg-red-500/10 text-red-500 ring-2 ring-red-500/20' 
                                                                    : 'border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                            }`}
                                                        />
                                                        {isInvalid && (
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover/input:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                                Max: {w.value}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-white px-3 py-1 bg-slate-900 rounded-lg border border-slate-700">
                                                {student.total.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-sm font-black w-8 h-8 flex items-center justify-center rounded-lg mx-auto ${
                                                ['1', '2', '3'].includes(student.grade) 
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                                    : student.grade === '-' 
                                                        ? 'bg-slate-800 text-slate-600'
                                                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                                {student.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-slate-400 truncate max-w-[150px] block">
                                                {student.remark}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <TrendingUp className="w-3 h-3 text-blue-500/50" />
                                                <span className="text-sm font-bold text-blue-400">
                                                    {student.rank}<sup>{['st','nd','rd'][student.rank-1] || 'th'}</sup>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="p-12 text-center">
                                <p className="text-slate-500 italic">No students found in this class.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Legend / Info */}
            <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="flex-1 bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-4">
                        <ArrowUpDown className="w-5 h-5 text-blue-400" />
                        <h4 className="font-bold text-white">Ranking Algorithm</h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Students are ranked automatically based on their weighted total score across all assessment components. 
                        In the event of a tie, students share the same rank.
                    </p>
                </div>
                <div className="flex-1 bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <h4 className="font-bold text-white">Grading Logic</h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Grades are assigned based on the boundaries defined in the selected <b>Exam Configuration</b>. 
                        Total score is the sum of raw marks entered for each component.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UploadData;
