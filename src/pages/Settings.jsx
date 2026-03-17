import React, { useState } from 'react';
import { 
  School, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Image as ImageIcon,
  Save,
  Settings as SettingsIcon,
  User,
  Shield,
  Bell
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('school-info');
    
    const tabs = [
        { id: 'school-info', label: 'School Info', icon: School },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const [schoolInfo, setSchoolInfo] = useState({
        name: 'St. Andrews Catholic School',
        contactNumbers: '024 123 4567, 020 987 6543',
        postAddress: 'P.O. Box 456, Achimota, Accra',
        email: 'info@standrewscatholic.edu.gh',
        website: 'www.standrewscatholic.edu.gh',
        logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200&h=200'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSchoolInfo(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                    Settings
                </h1>
                <p className="text-slate-400 text-base mt-2">
                    Manage your school information and account preferences.
                </p>
            </div>

            {/* Tabbed Interface */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                {/* Tabs Header */}
                <div className="flex flex-wrap border-b border-slate-700/50 bg-slate-900/30">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                                activeTab === tab.id 
                                ? 'text-blue-400 bg-blue-500/5' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_-4px_10px_rgba(59,130,246,0.5)]"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {activeTab === 'school-info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Logo Selection */}
                                <div className="lg:col-span-4 flex flex-col items-center gap-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 w-full mb-2">School Logo</label>
                                    <div className="relative group cursor-pointer w-full">
                                        <div className="aspect-square w-full rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/5">
                                            {schoolInfo.logo ? (
                                                <img 
                                                    src={schoolInfo.logo} 
                                                    alt="School Logo" 
                                                    className="w-full h-full object-contain rounded-xl shadow-lg"
                                                />
                                            ) : (
                                                <ImageIcon className="w-12 h-12 text-slate-700 group-hover:text-blue-500 transition-colors" />
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Change Logo</button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-600 text-center font-medium leading-relaxed">
                                        Recommend large size (at least 256x256). <br/> Supports PNG, JPG or SVG.
                                    </p>
                                </div>

                                {/* Form Fields */}
                                <div className="lg:col-span-8 flex flex-col gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">School Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <School className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={schoolInfo.name}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                placeholder="Enter school name"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Numbers</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Phone className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    name="contactNumbers"
                                                    value={schoolInfo.contactNumbers}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                    placeholder="e.g. 024..., 020..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Mail className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    value={schoolInfo.email}
                                                    onChange={handleInputChange}
                                                    className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                    placeholder="info@school.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Postal Address</label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-3.5 pointer-events-none">
                                                <MapPin className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <textarea 
                                                name="postAddress"
                                                value={schoolInfo.postAddress}
                                                onChange={handleInputChange}
                                                rows="2"
                                                className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                                                placeholder="Enter full postal address"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">School Website</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Globe className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <input 
                                                type="text" 
                                                name="website"
                                                value={schoolInfo.website}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                                placeholder="www.schoolsite.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-slate-700/50">
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                    <Save className="w-5 h-5" />
                                    <span>Save School Information</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'school-info' && (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                            <SettingsIcon className="w-16 h-16 text-slate-700" />
                            <h3 className="text-xl font-bold text-slate-400">Settings Coming Soon</h3>
                            <p className="text-sm text-slate-500 max-w-xs"> This section is under development. Please check back later for more configuration options.</p>
                        </div>
                    )}
                </div>
            </div>

            <footer className="py-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                School Information Management System • v1.0.0
            </footer>
        </div>
    );
};

export default Settings;
