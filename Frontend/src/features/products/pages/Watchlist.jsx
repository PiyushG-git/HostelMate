import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Watchlist = () => {
    const watchlist = useSelector(state => state.product.watchlist);
    const user = useSelector(state => state.auth.user);
    const { handleGetWatchlist, handleRemoveFromWatchlist } = useProduct();
    const navigate = useNavigate();
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        if (user) handleGetWatchlist();
    }, [handleGetWatchlist, user]);

    const onRemove = async (productId, e) => {
        e.stopPropagation();
        setRemovingId(productId);
        try {
            await handleRemoveFromWatchlist(productId);
        } catch (err) {
            console.error(err);
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24 pt-[100px]">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-1">My Watchlist</h1>
                        <p className="text-slate-500">Items you saved for later.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm font-bold text-indigo-600 hover:underline"
                    >
                        ← Browse more items
                    </button>
                </div>

                {watchlist && watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {watchlist.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://via.placeholder.com/400x300?text=No+Image';

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-[20px] border border-slate-200/60 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.08)] flex flex-col transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div
                                        className="h-44 overflow-hidden relative bg-slate-50 cursor-pointer group"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                        {product.isSold && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-red-50 text-red-700 px-5 py-2 rounded-full font-bold text-sm border border-red-200 shadow-sm">SOLD</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                className="font-[800] font-['Fustat'] text-[17px] text-slate-900 line-clamp-1 flex-1 pr-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>
                                            <span className="font-[800] font-['Fustat'] text-indigo-600 shrink-0 text-lg">₹{product.price}</span>
                                        </div>

                                        <div className="flex gap-2 text-[11px] font-[800] uppercase tracking-wider text-slate-500 mb-5">
                                            <span className="bg-indigo-50/50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100/50">{product.category}</span>
                                            <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">{product.hostelBlock}</span>
                                        </div>

                                        <div className="mt-auto pt-4 flex gap-2">
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                disabled={product.isSold}
                                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${product.isSold ? 'bg-slate-100/50 text-slate-400 border-slate-200/50 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'}`}
                                            >
                                                {product.isSold ? 'Sold Out' : 'View Details'}
                                            </button>
                                            <button
                                                onClick={(e) => onRemove(product._id, e)}
                                                disabled={removingId === product._id}
                                                className="px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm border border-red-200 hover:border-red-300 shadow-sm transition-all disabled:opacity-50"
                                                title="Remove from watchlist"
                                            >
                                                {removingId === product._id ? '...' : '🗑️'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[32px] py-24 text-center px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="text-5xl mb-6 drop-shadow-md">🔖</div>
                        <h2 className="text-2xl font-[800] font-['Fustat'] text-slate-900 mb-3 tracking-tight">Your watchlist is empty</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
                            Tap the bookmark icon on any listing to save it here for easy access later.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_8px_20px_rgba(79,70,229,0.2)] hover:-translate-y-0.5 transition-all"
                        >
                            Browse Listings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
