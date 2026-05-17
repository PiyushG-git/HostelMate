import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        email: '',
        password: ''
    });
    const [ errorMsg, setErrorMsg ] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [ name ]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        try {
            await handleLogin({ email: formData.email, password: formData.password });
            navigate("/");
        } catch (error) {
            console.error("Login failed", error);
            setErrorMsg(error?.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-['Inter']">
            {/* Left Side - Hero/Info (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-16 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-indigo-600 font-black text-xl">H</span>
                        </div>
                        <span className="text-white font-bold text-2xl tracking-tight">HostelMart.in</span>
                    </div>
                    
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-6 font-['Plus_Jakarta_Sans']">
                        The Student <br /> Marketplace.
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                        Join thousands of students buying and selling items within the hostel community. Simple, fast, and secure.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-400"></div>
                        ))}
                    </div>
                    <p className="text-indigo-100 text-sm font-medium">500+ active student listings today</p>
                </div>

                {/* Abstract Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-20">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">H</span>
                        </div>
                        <span className="text-slate-900 font-bold text-xl tracking-tight">HostelMart</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Login to your student account to manage listings.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">University Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@university.edu"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        {errorMsg && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-sm font-semibold text-red-700 leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Authenticating...' : 'Login Now'}
                        </button>
                    </form>

                    <div className="relative my-10 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <span className="relative px-4 bg-white text-slate-400 text-sm font-bold uppercase tracking-wider">or continue with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <ContinueWithGoogle />
                    </div>

                    <p className="mt-10 text-center text-slate-500 font-medium">
                        New to HostelMart?{' '}
                        <a href="/register" className="text-indigo-600 font-bold hover:underline">Create an account</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;