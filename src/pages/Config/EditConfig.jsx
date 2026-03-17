import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, FileText, ChevronRight, Bell, User, CheckCircle2 } from 'lucide-react';
import { configService } from '../../services/configService';
import { subjectService } from '../../services/subjectService';

const EditConfig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        components: [
            { id: Date.now(), name: 'Progressive Tests', weight: 30 },
            { id: Date.now() + 1, name: 'Class Assignments', weight: 20 },
            { id: Date.now() + 2, name: 'End of Term Exam', weight: 50 }
        ],
        gradingScale: [
            { id: Date.now() + 1, min: 80, max: 100, grade: 'A', color: '#10b981' },
            { id: Date.now() + 2, min: 70, max: 79, grade: 'B', color: '#3b82f6' },
            { id: Date.now() + 3, min: 60, max: 69, grade: 'C', color: '#f59e0b' },
            { id: Date.now() + 4, min: 0, max: 59, grade: 'D', color: '#ef4444' }
        ],
        remarks: {
            'A': 'Excellent performance. Keep it up!',
            'B': 'Very good work, shows strong understanding.',
            'C': 'Good work, shows understanding.',
            'D': 'Needs improvement.'
        },
        subjects: []
    });

    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setAvailableSubjects(subjectService.getAll());
        if (!isNew) {
            const config = configService.getById(id);
            if (config) {
                setFormData(config);
            } else {
                navigate('/dashboard');
            }
        }
    }, [id, isNew, navigate]);

    const handleComponentChange = (index, field, value) => {
        const newComponents = [...formData.components];
        newComponents[index][field] = value;
        setFormData({ ...formData, components: newComponents });
    };

    const addComponent = () => {
        setFormData({
            ...formData,
            components: [...formData.components, { id: Date.now(), name: '', weight: 0 }]
        });
    };

    const removeComponent = (index) => {
        const newComponents = formData.components.filter((_, i) => i !== index);
        setFormData({ ...formData, components: newComponents });
    };

    const handleGradeChange = (index, field, value) => {
        const newScale = [...formData.gradingScale];
        newScale[index][field] = value;

        if (field === 'grade') {
            const oldGrade = formData.gradingScale[index].grade;
            const newRemarks = { ...formData.remarks };
            newRemarks[value] = newRemarks[oldGrade] || '';
            delete newRemarks[oldGrade];
            setFormData({ ...formData, gradingScale: newScale, remarks: newRemarks });
        } else {
            setFormData({ ...formData, gradingScale: newScale });
        }
    };

    const addGradeRange = () => {
        setFormData({
            ...formData,
            gradingScale: [...formData.gradingScale, { id: Date.now(), min: 0, max: 0, grade: '', color: '#6b7280' }]
        });
    };

    const removeGradeRange = (index) => {
        const rangeToRemove = formData.gradingScale[index];
        const newScale = formData.gradingScale.filter((_, i) => i !== index);
        const newRemarks = { ...formData.remarks };
        delete newRemarks[rangeToRemove.grade];
        setFormData({ ...formData, gradingScale: newScale, remarks: newRemarks });
    };

    const handleRemarkChange = (grade, value) => {
        setFormData({
            ...formData,
            remarks: { ...formData.remarks, [grade]: value }
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';

        const totalWeight = formData.components.reduce((sum, c) => sum + Number(c.weight), 0);
        if (Math.abs(totalWeight - 100) > 0.1) newErrors.components = `Total weight must be 100% (Current: ${totalWeight}%)`;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        if (isNew) {
            configService.create(formData);
        } else {
            configService.update(id, formData);
        }
        navigate('/dashboard');
    };

    const totalWeight = formData.components.reduce((sum, c) => sum + Number(c.weight || 0), 0);

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-600 rounded">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg">Exam Reporter</span>
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

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mt-4 text-sm">
                    <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
                        Home
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
                        Configurations
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-300">Edit Configuration</span>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isNew ? 'Create New Report' : `Edit: ${formData.name || 'Configuration'}`}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Configure assessment weights, grading logic, and remarks for this report card type.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md border border-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg shadow-blue-600/20 transition-colors flex items-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Assessment Weights */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-white">Assessment Weights</h2>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-slate-400">Define component weights for final score</p>
                            <span className={`text-sm font-semibold ${Math.abs(totalWeight - 100) < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                                Total: {totalWeight}% {Math.abs(totalWeight - 100) < 0.1 && '✓'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-[1fr,120px,40px] gap-3 text-xs text-slate-500 uppercase font-medium mb-2">
                                <div>Component Name</div>
                                <div>Weight (%)</div>
                                <div>Actions</div>
                            </div>

                            {formData.components.map((comp, index) => (
                                <div key={comp.id} className="grid grid-cols-[1fr,120px,40px] gap-3 items-center">
                                    <input
                                        type="text"
                                        value={comp.name}
                                        onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                                        className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Component name"
                                    />
                                    <input
                                        type="number"
                                        value={comp.weight}
                                        onChange={(e) => handleComponentChange(index, 'weight', e.target.value)}
                                        className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={() => removeComponent(index)}
                                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addComponent}
                            className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Assessment Component
                        </button>
                    </div>

                    {/* Grading Scale */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-5 h-5 text-purple-500" />
                            <h2 className="text-lg font-semibold text-white">Grading Scale</h2>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">Auto-fill Aligned</p>

                        <div className="space-y-3">
                            <div className="grid grid-cols-[80px,80px,1fr,40px] gap-3 text-xs text-slate-500 uppercase font-medium mb-2">
                                <div>Min</div>
                                <div>Max</div>
                                <div>Label</div>
                                <div></div>
                            </div>

                            {formData.gradingScale.map((range, index) => (
                                <div key={range.id} className="grid grid-cols-[80px,80px,1fr,40px] gap-3 items-center">
                                    <input
                                        type="number"
                                        value={range.min}
                                        onChange={(e) => handleGradeChange(index, 'min', e.target.value)}
                                        className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={range.max}
                                        onChange={(e) => handleGradeChange(index, 'max', e.target.value)}
                                        className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={range.grade}
                                            onChange={(e) => handleGradeChange(index, 'grade', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="A"
                                        />
                                        <div
                                            className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                                            style={{ backgroundColor: range.color || '#6b7280' }}
                                            title="Grade color"
                                        ></div>
                                    </div>
                                    <button
                                        onClick={() => removeGradeRange(index)}
                                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addGradeRange}
                            className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Range
                        </button>

                        {/* Distribution Preview */}
                        <div className="mt-6">
                            <p className="text-xs text-slate-500 uppercase font-medium mb-2">Distribution Preview</p>
                            <div className="flex h-3 rounded-full overflow-hidden">
                                {formData.gradingScale.map((range, idx) => (
                                    <div
                                        key={range.id}
                                        style={{
                                            backgroundColor: range.color || '#6b7280',
                                            width: `${(Number(range.max) - Number(range.min) + 1)}%`
                                        }}
                                        title={`${range.grade}: ${range.min}-${range.max}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Remarks Configuration */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-white">Remarks Configuration</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">Define comments to show for each grade</p>

                    <div className="space-y-4">
                        <div className="grid grid-cols-[100px,1fr,40px] gap-3 text-xs text-slate-500 uppercase font-medium mb-2">
                            <div>Grade</div>
                            <div>Remarks Text</div>
                            <div></div>
                        </div>

                        {formData.gradingScale.map((range) => (
                            <div key={range.id} className="grid grid-cols-[100px,1fr,40px] gap-3 items-center">
                                <div className="px-4 py-2 bg-slate-700 rounded-md text-white text-center font-bold">
                                    {range.grade}
                                </div>
                                <input
                                    type="text"
                                    value={formData.remarks[range.grade] || ''}
                                    onChange={(e) => handleRemarkChange(range.grade, e.target.value)}
                                    className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Remarks for grade ${range.grade}`}
                                />
                                <div className="p-2">
                                    <Trash2 className="w-4 h-4 text-slate-600" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Remarks Rule
                    </button>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-xs text-slate-600">
                    © 2024 Exam Reporter. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default EditConfig;
