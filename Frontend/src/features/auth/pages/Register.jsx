import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        try {
            await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                fullname: formData.fullName
            });
            navigate("/");
        } catch (error) {
            console.error("Registration failed", error);
            setErrorMsg(error?.response?.data?.message || "Registration failed. Please try again.");
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
                        Start Selling <br /> Locally.
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                        Create your student account to list items, reach buyers in your hostel, and manage your deals in one place.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-indigo-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            </div>
                            <h3 className="text-white font-bold">Safe & Secure</h3>
                        </div>
                        <p className="text-indigo-100 text-sm">Every listing is verified within your university network.</p>
                    </div>
                </div>

                {/* Abstract Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">H</span>
                        </div>
                        <span className="text-slate-900 font-bold text-xl tracking-tight">HostelMart</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join your campus marketplace in minutes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contact No.</label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 00000 00000"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">University Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="name@university.edu"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min. 8 characters"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>


                        {errorMsg && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-sm font-semibold text-red-700">{errorMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {isLoading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase tracking-wider">or sign up with</span>
                    </div>

                    <ContinueWithGoogle />

                    <p className="mt-8 text-center text-slate-500 font-medium">
                        Already have an account?{' '}
                        <a href="/login" className="text-indigo-600 font-bold hover:underline">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;