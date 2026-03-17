import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { configService } from '../../services/configService';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const PreviewReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/upload');
            return;
        }
        const { processedData, metadata } = location.state;
        setData(processedData);
        setMetadata(metadata);

        // Re-fetch config to get components details for display headers
        const loadedConfig = configService.getById(metadata.configId);
        setConfig(loadedConfig);
    }, [location, navigate]);

    const handleGeneratePDF = () => {
        if (data && config && metadata) {
            pdfService.generateReport(data, config, metadata);
        }
    };

    if (!data || !config) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/upload')} className="mr-4 text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Report Preview</h1>
                        <p className="text-sm text-slate-500">
                            {metadata.className} • {metadata.subjectName} • {data.length} Students
                        </p>
                    </div>
                </div>
                <Button onClick={handleGeneratePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF Reports
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                {config.components.map(comp => (
                                    <th key={comp.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        {comp.name} ({comp.weight}%)
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {data.map((student, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student['Student ID']}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student['Student Name']}</td>
                                    {config.components.map(comp => (
                                        <td key={comp.id} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {student[comp.name] || '-'}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{student.totalScore}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {student.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PreviewReport;
