import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    LabelList
} from 'recharts';

const ReportTemplate = React.forwardRef(({ student, school, config, options }, ref) => {
    // Demo data for the chart - in a real app, we'd fetch actual term history
    const chartData = [
        { name: 'Term 1', score: 470 },
        { name: 'Term 2', score: 491 },
        { name: 'Term 3', score: student.overallTotal },
    ];

    const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div ref={ref} className="bg-white p-8 w-[210mm] min-h-[297mm] mx-auto text-slate-800 font-sans print:p-0 print:shadow-none shadow-2xl border border-slate-200 print:border-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between border-b-4 border-green-600 pb-4 mb-4">
                <div className="flex items-center gap-6">
                    <div className="w-28 h-28 bg-green-600 flex items-center justify-center rounded-xl p-2 shrink-0">
                        {school.logo_url ? (
                            <img src={school.logo_url} alt="School Logo" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-white font-black text-2xl text-center leading-tight">THE<br/>NEST</div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase mb-1">
                            {school.name || "THE NEST SCHOOL - TAKORADI"}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-green-700 italic">
                             <div className="flex items-center gap-1">📞 {school.phone || "N/A"}</div>
                             <div className="flex items-center gap-1">📍 {school.address || "N/A"}</div>
                             <div className="flex items-center gap-1">🌐 {school.website || "N/A"}</div>
                             <div className="flex items-center gap-1">📧 {school.email || "admin@thenest.edu.gh"}</div>
                        </div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end pt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-tight">Aspire to the highest</span>
                </div>
            </div>

            {/* Report Title */}
            <div className="bg-black text-white py-1.5 px-6 flex justify-end mb-4">
                <h2 className="text-xl font-black tracking-[0.2em] uppercase italic">Learner Terminal Report</h2>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-10 mb-6 border-b border-slate-200 pb-4 font-bold text-[12px]">
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">Year:</span>
                    <span className="text-red-600">{options.year}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">Total Term Days:</span>
                    <span className="text-red-500">{options.totalTermDays}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">Pass Mark:</span>
                    <span className="text-red-500">{options.passmark}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">Term:</span>
                    <span className="text-red-500">{options.term}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">Next Term begins:</span>
                    <span className="text-red-500 italic text-[11px]">{options.nextTermBegins}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 underline decoration-slate-300">No. on Roll:</span>
                    <span className="text-red-500">{options.noOnRoll}</span>
                </div>
            </div>

            {/* Student Identity Grid */}
            <div className="grid grid-cols-12 gap-x-6 mb-6 text-[12px]">
                <div className="col-span-6 space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-20 shrink-0">Name:</span>
                        <span className="text-blue-900 font-black text-lg border-b-2 border-slate-900 flex-1 uppercase tracking-tight leading-none pb-1">{student.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-20 shrink-0">ID:</span>
                        <span className="text-red-600 font-black border-b border-slate-900 flex-1">{student.admissionNo}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-20 shrink-0">Class:</span>
                        <span className="text-red-600 font-black border-b border-slate-900 flex-1 uppercase">{config.class_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-20 shrink-0">Attendance:</span>
                        <div className="border-b border-slate-900 flex-1 flex justify-between px-2 font-black text-red-600">
                            <span>{student.attendance || "0"}</span>
                            <span className="text-slate-400 font-bold text-[10px]">Out of:</span>
                            <span>{options.totalTermDays}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-20 shrink-0">Total Score:</span>
                        <div className="border-b border-slate-900 flex-1 flex justify-between px-2 font-black text-red-600">
                            <span>{student.overallTotal}</span>
                            <span className="text-slate-400 font-bold text-[10px]">Out of:</span>
                            <span>{student.subjects.length * 100}</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-6 space-y-3">
                    <div className="flex justify-between border-b border-white hover:border-slate-100 py-0.5">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-28 text-[11px]">Term 1 Score:</span>
                        <span className="text-red-600 font-black">469.98</span>
                    </div>
                    <div className="flex justify-between border-b border-white hover:border-slate-100 py-0.5">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-28 text-[11px]">Term 2 Score:</span>
                        <span className="text-red-600 font-black">491.02</span>
                    </div>
                    <div className="flex justify-between border-b border-white hover:border-slate-100 py-0.5">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-28 text-[11px]">Term 3 Score:</span>
                        <span className="text-red-600 font-black">{student.overallTotal}</span>
                    </div>
                    <div className="flex justify-between border-b border-white hover:border-slate-100 py-1 border-t-2 border-slate-200 mt-1">
                        <span className="text-blue-900 font-black underline decoration-slate-200 w-28 uppercase text-[11px]">Average Score:</span>
                        <span className="text-red-600 font-black text-base">{student.overallAverage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 mt-1">
                        <div className="flex justify-between border-b border-slate-100">
                            <span className="text-slate-500 font-bold text-[10px]">Total Subjects:</span>
                            <span className="text-slate-900 font-black">{student.subjects.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100">
                            <span className="text-green-800 font-bold text-[10px]">Passed:</span>
                            <span className="text-green-600 font-black">{student.subjects.filter(s => s.total >= options.passmark).length}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 border-t border-slate-100 pt-1">
                        <span className="text-slate-500 font-bold underline decoration-slate-200 w-28 text-[11px]">Promoted To:</span>
                        <span className="text-orange-500 font-black border-b border-slate-900 flex-1 text-center italic text-[11px]">{student.promotionStatus || "---"}</span>
                    </div>
                </div>
            </div>

            {/* Subject Table */}
            <div className="mb-4 border-2 border-blue-900 overflow-hidden rounded-sm">
                <table className="w-full text-center border-collapse">
                    <thead className="bg-green-700 text-white text-[10px] font-black uppercase tracking-wider">
                        <tr>
                            <th className="py-1.5 px-3 text-left border-r border-white font-black">Subject</th>
                            <th className="py-1.5 px-1 border-r border-white">Prog.</th>
                            <th className="py-1.5 px-1 border-r border-white">Class</th>
                            <th className="py-1.5 px-1 border-r border-white">Exam</th>
                            <th className="py-1.5 px-1 border-r border-white">Total</th>
                            <th className="py-1.5 px-1 border-r border-white">Grade</th>
                            <th className="py-1.5 px-1 border-r border-white">Remarks</th>
                            <th className="py-1.5 px-3">Rank</th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                        {student.subjects.map((sub, idx) => (
                            <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="py-1 px-3 text-left border-r border-slate-300 text-slate-900 uppercase text-[10px]">{sub.name}</td>
                                {sub.weights.map((w, wi) => (
                                    <td key={wi} className="py-1 px-1 border-r border-slate-300 text-slate-700">{w.weightedValue}</td>
                                ))}
                                {/* Fill empty columns if weights are less than 3 */}
                                {[...Array(Math.max(0, 3 - sub.weights.length))].map((_, i) => (
                                    <td key={`empty-${i}`} className="py-1 px-1 border-r border-slate-300 text-slate-400">---</td>
                                ))}
                                <td className="py-1 px-1 border-r border-slate-300 font-black text-slate-900">{sub.total}</td>
                                <td className="py-1 px-1 border-r border-slate-300 font-black text-slate-900">7</td> {/* Dynamic Grade logic needed */}
                                <td className="py-1 px-1 border-r border-slate-300 text-slate-500 text-[9px] uppercase leading-tight">Uncompetitive</td>
                                <td className="py-1 px-3 font-black text-slate-900">89th</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t-2 border-blue-900 text-[12px] font-black">
                        <tr>
                            <td className="py-2 px-3 text-right pr-4 uppercase text-blue-900 italic text-[11px]" colSpan="4">Average Scores / Position:</td>
                            <td className="py-2 px-1 text-red-600 border-r border-slate-300">52.79</td>
                            <td className="py-2 px-1 text-red-600 border-r border-slate-300">5</td>
                            <td className="py-2 px-1 text-red-600 border-r border-slate-300 uppercase italic text-[10px]">Developing</td>
                            <td className="py-2 px-3 text-red-600 italic">98th</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Remarks Section */}
            <div className="flex items-start gap-3 mb-6 text-[12px] leading-snug">
                 <div className="w-28 shrink-0 font-black text-slate-500 border-r-2 border-slate-200 pr-3">
                    Remarks on Learner:
                 </div>
                 <div className="flex-1 font-black text-blue-900 italic border-l-4 border-blue-100 pl-3 py-0.5">
                    "{student.name} is struggling with understanding due to minimum knowledge and skills, and so needs to be repeated but is promoted with caution. Success takes sweat, so work harder in the next class and you will make it to the top."
                 </div>
            </div>

            {/* Bottom Section: Grade Scheme, Signature, Chart */}
            <div className="grid grid-cols-12 gap-6 pt-6 border-t border-slate-200">
                {/* Grade Scheme */}
                <div className="col-span-4 overflow-hidden rounded-sm border border-slate-300">
                    <table className="w-full text-[8.5px] text-center border-collapse">
                        <thead className="bg-green-700 text-white font-black uppercase">
                            <tr>
                                <th colSpan="3" className="py-1 border-b border-white">Grade Scheme</th>
                            </tr>
                            <tr className="bg-slate-100 text-slate-600 border-b border-slate-300">
                                <th className="py-0.5 border-r border-slate-300">Score</th>
                                <th className="py-0.5 border-r border-slate-300">Grade</th>
                                <th className="py-0.5">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody className="font-bold">
                            {[
                                ['80.00 - 100.00', '1', 'Mastery'],
                                ['70.00 - 79.99', '2', 'Advance'],
                                ['60.00 - 69.99', '3', 'Proficient'],
                                ['55.00 - 59.99', '4', 'Approaching Proficiency'],
                                ['50.00 - 54.99', '5', 'Developing'],
                                ['45.00 - 49.99', '6', 'Beginning'],
                                ['40.00 - 44.99', '7', 'Uncompetitive'],
                                ['35.00 - 39.99', '8', 'Unmotivated'],
                                ['00.00 - 34.00', '9', 'Ugraded']
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-slate-200">
                                    <td className="py-0.5 border-r border-slate-200 bg-slate-50/50">{row[0]}</td>
                                    <td className="py-0.5 border-r border-slate-200">{row[1]}</td>
                                    <td className="py-0.5 text-left pl-2 leading-tight">{row[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Signature and Keys */}
                <div className="col-span-4 flex flex-col items-center justify-between text-center">
                    <div className="space-y-3 w-full">
                        <h4 className="font-black text-slate-500 text-[10px] uppercase underline decoration-slate-200">Head Teacher's Signature</h4>
                        <div className="border-b-2 border-dotted border-slate-400 h-8 w-full mt-4"></div>
                    </div>

                    <div className="w-full text-[9px] text-left mt-6 font-bold space-y-0.5">
                        <h5 className="font-black text-slate-800 text-center uppercase tracking-widest border-b border-slate-100 pb-0.5 mb-1.5">Key</h5>
                        <div className="flex justify-between border-b border-slate-50">
                            <span className="text-slate-400">Prog.</span>
                            <span className="text-slate-600">- Progressive Exam (20%)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50">
                            <span className="text-slate-400">Class</span>
                            <span className="text-slate-600">- Class/Project Work (10%)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50">
                            <span className="text-slate-400">Exam</span>
                            <span className="text-slate-600">- Exam Score (70%)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50">
                            <span className="text-slate-400">Total</span>
                            <span className="text-slate-600">- Total Score (100%)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Rank</span>
                            <span className="text-slate-600">- Position in Class</span>
                        </div>
                        <div className="text-[8px] text-orange-600 italic mt-1.5 text-center leading-tight">No. on Roll - A & B Classes combined</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="col-span-4 flex flex-col items-center">
                    <h4 className="text-[11px] font-black text-green-600 uppercase mb-3 tracking-tighter border-2 border-slate-100 px-3 py-0.5 rounded-full shadow-sm">Performance Chart</h4>
                    <div className="w-full h-36 border border-slate-100 rounded-lg p-1 bg-slate-50/30">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 15, right: 5, left: -30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 9, fontWeight: 'bold', fill: '#64748b'}} 
                                />
                                <YAxis 
                                    domain={[0, 1000]} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 8, fill: '#94a3b8'}} 
                                />
                                <Tooltip cursor={{fill: '#f1f5f9'}} />
                                <Bar dataKey="score" radius={[3, 3, 0, 0]} barSize={25}>
                                    <LabelList 
                                        dataKey="score" 
                                        position="top" 
                                        style={{ fontSize: 9, fontWeight: 'black', fill: '#2563eb' }} 
                                    />
                                    {chartData.map((entry, index) => (
                                        <rect key={index} fill={index === 2 ? '#7c2d12' : index === 1 ? '#2563eb' : '#fbbf24'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="flex items-center justify-between mt-8 pt-3 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500">🗓️ {today}</div>
                    <div className="flex items-center gap-1.5 text-slate-500">⏰ {time}</div>
                </div>
                <div className="flex items-center gap-1 italic">
                    Software Designed by: <span className="text-pink-600 font-bold opacity-80">Henapp Infocom Technologies</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-slate-500">Tel: (+233) 0242-711-930</div>
                    <div className="flex items-center gap-1 text-slate-500 lowercase italic underline">www.henapp.net</div>
                </div>
            </div>
        </div>
    );
});

export default ReportTemplate;
