import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { configService } from '../../services/configService';
import { subjectService } from '../../services/subjectService';
import { excelService } from '../../services/excelService';
import { gradeService } from '../../services/gradeService';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';

const ExcelUpload = () => {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({
        configId: '',
        subjectId: '',
        className: '',
        teacherName: ''
    });

    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setConfigs(configService.getAll());
        setSubjects(subjectService.getAll());
    }, []);

    const handleDownloadTemplate = () => {
        if (!formData.configId) {
            setError('Please select a configuration first.');
            return;
        }
        const config = configs.find(c => c.id === formData.configId);
        if (config) {
            excelService.generateTemplate(config);
            setError('');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.configId || !formData.subjectId || !formData.className || !formData.teacherName) {
            setError('All fields are required.');
            return;
        }
        if (!file) {
            setError('Please upload an Excel file.');
            return;
        }

        setLoading(true);
        try {
            const config = configs.find(c => c.id === formData.configId);
            const subject = subjects.find(s => s.id === formData.subjectId);

            const { data } = await excelService.readUpload(file);

            // Calculate scores
            const processedData = data.map(student => gradeService.calculateScore(student, config));

            const metadata = {
                configId: formData.configId,
                configName: config.name,
                subjectId: formData.subjectId,
                subjectName: subject.name,
                className: formData.className,
                teacher: formData.teacherName
            };

            navigate('/upload/preview', { state: { processedData, metadata } });
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to process file.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload Scores</h1>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Configuration</label>
                            <select
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.configId}
                                onChange={(e) => setFormData({ ...formData, configId: e.target.value })}
                            >
                                <option value="">Select Configuration</option>
                                {configs.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <select
                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Class Name"
                            placeholder="e.g. Grade 5A"
                            value={formData.className}
                            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        />

                        <Input
                            label="Teacher Name"
                            placeholder="e.g. Mr. Smith"
                            value={formData.teacherName}
                            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                        />
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-slate-700">Upload Excel File</label>
                            <Button type="button" variant="ghost" size="sm" onClick={handleDownloadTemplate} disabled={!formData.configId}>
                                <Download className="w-4 h-4 mr-2" /> Download Template
                            </Button>
                        </div>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                            />
                            <div className="space-y-1 text-center">
                                <FileSpreadsheet className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600 justify-center">
                                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                        {file ? file.name : 'Upload a file'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">XLSX up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" /> {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Process & Preview'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ExcelUpload;
