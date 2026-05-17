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
        <div className="min-h-screen bg-slate-50 font-['Inter'] pb-24">
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-12">

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
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                                >
                                    <div
                                        className="h-44 relative bg-slate-100 cursor-pointer overflow-hidden"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                        {product.isSold && (
                                            <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                                                <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full font-bold text-sm border border-red-200">SOLD</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3
                                                className="font-bold text-slate-900 line-clamp-1 flex-1 pr-2 cursor-pointer hover:text-indigo-600"
                                                onClick={() => navigate(`/product/${product._id}`)}
                                            >
                                                {product.title}
                                            </h3>
                                            <span className="font-bold text-indigo-600 shrink-0">₹{product.price}</span>
                                        </div>

                                        <div className="flex gap-1.5 text-xs font-medium text-slate-500 mb-4">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.hostelBlock}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">{product.category}</span>
                                        </div>

                                        <div className="mt-auto flex gap-2">
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                disabled={product.isSold}
                                                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${product.isSold ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                                            >
                                                {product.isSold ? 'Sold Out' : 'View Details'}
                                            </button>
                                            <button
                                                onClick={(e) => onRemove(product._id, e)}
                                                disabled={removingId === product._id}
                                                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold text-sm border border-red-200 transition-colors"
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
                    <div className="bg-white border border-slate-200 rounded-3xl py-24 text-center px-6">
                        <div className="text-5xl mb-4">🔖</div>
                        <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 mb-2">Your watchlist is empty</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Tap the bookmark icon on any listing to save it here for easy access later.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
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
