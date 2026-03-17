import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, FileText } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/exam-configs');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            {/* Header */}
            <header className="w-full px-8 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 rounded">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">Student Report Gen</span>
                </div>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Help
                </a>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Sign In Card */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
                            <p className="text-slate-400 text-sm">
                                Welcome back. Please enter your details to access the report generator.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            {/* Username/Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your username"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-slate-300">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            Secured Administrative Access
                        </p>
                    </div>

                    {/* Footer Message */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                            Please contact your administrator
                        </a>
                    </p>
                </div>
            </div>

            {/* Bottom Footer */}
            <footer className="w-full px-8 py-4 text-center text-xs text-slate-600 border-t border-slate-800">
                © 2024 Student Report Gen. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;
