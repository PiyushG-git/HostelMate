import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const UserProfile = () => {
    const user = useSelector(state => state.auth.user);
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const { handleGetSellerProduct } = useProduct();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) handleGetSellerProduct();
    }, [handleGetSellerProduct, user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-600 mb-4 font-semibold">Please log in to view your profile.</p>
                    <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
                        Login
                    </button>
                </div>
            </div>
        );
    }

    const activeListings = sellerProducts?.filter(p => !p.isSold) || [];
    const soldListings = sellerProducts?.filter(p => p.isSold) || [];

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 pt-[100px]">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-4">

                {/* Profile Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm z-10">
                        <span className="text-4xl font-black text-indigo-600 drop-shadow-sm">
                            {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-3xl font-[800] font-['Fustat'] text-slate-900 mb-2 tracking-tight">{user.fullname}</h1>
                        <p className="text-slate-500 font-medium mb-1">{user.email}</p>
                        {user.contact && <p className="text-slate-500 text-[15px] font-medium flex items-center justify-center md:justify-start gap-2"><span className="text-indigo-400">📞</span> {user.contact}</p>}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-center z-10">
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 border border-slate-200/60 shadow-sm flex flex-col items-center min-w-[110px]">
                            <div className="text-3xl font-[800] font-['Fustat'] text-indigo-600 mb-1">{activeListings.length}</div>
                            <div className="text-[11px] font-[800] text-slate-500 uppercase tracking-wider">Active Ads</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 border border-slate-200/60 shadow-sm flex flex-col items-center min-w-[110px]">
                            <div className="text-3xl font-[800] font-['Fustat'] text-green-600 mb-1">{soldListings.length}</div>
                            <div className="text-[11px] font-[800] text-slate-500 uppercase tracking-wider">Sold</div>
                        </div>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <button
                        onClick={() => navigate('/post-ad')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 transition-all"
                    >
                        List new Product
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white border border-slate-200/60 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 px-6 py-3.5 rounded-xl font-bold shadow-sm transition-all"
                    >
                        Manage Listings
                    </button>
                    <button
                        onClick={() => navigate('/watchlist')}
                        className="bg-white border border-slate-200/60 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 px-6 py-3.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
                    >
                        <span>🔖</span> Watchlist
                    </button>
                </div>

                {/* My Active Listings */}
                <h2 className="text-2xl font-[800] font-['Fustat'] text-slate-900 mb-6 tracking-tight">
                    My Active Listings
                    <span className="text-lg font-medium text-slate-400 ml-2">({activeListings.length})</span>
                </h2>

                {activeListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {activeListings.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/400x300?text=No+Image';

                            return (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/dashboard/product/${product._id}`)}
                                    className="bg-white rounded-[20px] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.08)] cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                                >
                                    <div className="h-44 overflow-hidden bg-slate-50 relative">
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-5 bg-gradient-to-b from-white to-slate-50/50 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-[800] font-['Fustat'] text-[17px] text-slate-900 line-clamp-1 flex-1 pr-2 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                                            <span className="font-[800] font-['Fustat'] text-indigo-600 text-lg">₹{product.price}</span>
                                        </div>
                                        <div className="flex gap-2 mt-auto text-[11px] font-[800] uppercase tracking-wider text-slate-500">
                                            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">{product.hostelBlock}</span>
                                            <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md border border-green-200 shadow-sm">Active</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[32px] py-20 text-center px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
                        <div className="text-5xl mb-6 drop-shadow-md opacity-70">📦</div>
                        <p className="text-slate-500 mb-6 text-[15px] font-medium">You have no active listings.</p>
                        <button
                            onClick={() => navigate('/post-ad')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 transition-all"
                        >
                            List your first Product
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserProfile;
