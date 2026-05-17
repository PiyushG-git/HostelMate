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
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-12">

                {/* Profile Header */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-3xl font-black text-indigo-600">
                            {user.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-1">{user.fullname}</h1>
                        <p className="text-slate-500 mb-1">{user.email}</p>
                        {user.contact && <p className="text-slate-500 text-sm">📞 {user.contact}</p>}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center">
                        <div className="bg-slate-50 rounded-xl px-6 py-3 border border-slate-200">
                            <div className="text-2xl font-bold text-indigo-600">{activeListings.length}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Ads</div>
                        </div>
                        <div className="bg-slate-50 rounded-xl px-6 py-3 border border-slate-200">
                            <div className="text-2xl font-bold text-green-600">{soldListings.length}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sold</div>
                        </div>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex gap-3 mb-10">
                    <button
                        onClick={() => navigate('/post-ad')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors"
                    >
                        List new Product
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Manage Listings
                    </button>
                    <button
                        onClick={() => navigate('/watchlist')}
                        className="bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        🔖 Watchlist
                    </button>
                </div>

                {/* My Active Listings */}
                <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-5">
                    My Active Listings
                    <span className="text-base font-medium text-slate-400 ml-2">({activeListings.length})</span>
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
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
                                >
                                    <div className="h-40 overflow-hidden bg-slate-100">
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 line-clamp-1 flex-1 pr-2">{product.title}</h3>
                                            <span className="font-bold text-indigo-600">₹{product.price}</span>
                                        </div>
                                        <div className="flex gap-1.5 mt-2 text-xs font-medium text-slate-500">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.hostelBlock}</span>
                                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md border border-green-200">Active</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl py-14 text-center px-6 mb-8">
                        <p className="text-slate-500 mb-4">You have no active listings.</p>
                        <button
                            onClick={() => navigate('/post-ad')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors"
                        >
                            Post Your First Ad
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserProfile;
